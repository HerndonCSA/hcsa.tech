"""
1. Make sure you have python and pip installed using `python --version` and `pip --version`
2. Install the dependencies `pip install -r requirements.txt`
3. Get the configuration files (secrets.json and client_secret.json)
4. Make sure that config.json has the correct info such as production and the frontend url
5. Run the server `python server.py` (make sure to be in the correct dir)
"""

import datetime
import pathlib

import aiosqlite
from sanic import Sanic, response
from google_auth_oauthlib.flow import Flow
import google.auth.transport.requests
from google.oauth2 import id_token
import jwt
import uuid
import json
import os
import aiohttp
import copy
from functools import wraps

from user_agents import parse

from SessionManager import SessionManager, RedisSessionManager

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
client_secrets_file = os.path.join(
    pathlib.Path(__file__).parent, "./client_secret.json"
)
config = json.load(open(os.path.join(pathlib.Path(__file__).parent, "./config.json")))

# create random secret

flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=[
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
    ],
    redirect_uri="https://api.hcsa.tech/callback"
    if config["production"]
    else "http://localhost:8000/callback",
)

app = Sanic(config["name"])


async def send_email(payload):
    url = "https://api.sendinblue.com/v3/smtp/email"

    headers = {
        'accept': 'application/json',
        'api-key': app.ctx.sendinblue_key,
        'content-type': 'application/json'
    }

    async with app.ctx.aiohttp_session.post(url, data=json.dumps(payload), headers=headers) as resp:
        return await resp.json()


async def notify_users_email(email, name):
    # return if in development environment
    if not config["production"]:
        return

    payload = {
        "sender": {
            "email": "hello@hcsa.tech",
            "name": "HCSA Support"
        },
        "to": [
            {
                "email": email
            }
        ],
        "subject": "Account Notification",
        "htmlContent": "<html><head></head><body>"
                       "<h4>[New Sign in]</h4>"
                       f"<p>{name.title()}, your email ({email}) was used to sign in to <a href='https://hcsa.tech'>hcsa.tech</a> on {datetime.datetime.now().strftime('%A, %B %d, %Y at %I:%M %p')}.</p>"
                       "<p>If you did not authorize this, please secure your google account.</p>"
                       "<p>Alternatively, you can view and manage your active sessions <a href='https://hcsa.tech/sessions/?refer=notification'>here.</a></p>"
                       "<br/><br/><br/>"
                       "<p><small>Any questions or comments? You can reply to this email to create a ticket.<small/></p>"
                       "</body></html>"
    }

    return await send_email(payload)


async def location_from_ip(ip):
    # this api doesn't support ssl, so we can't use https
    async with app.ctx.aiohttp_session.get(f"http://ip-api.com/json/{ip}") as resp:
        resp = await resp.json()
        return f"{resp['city']}, {resp['regionName']}" if resp["status"] == "success" else f"Unknown ({ip})"


def session_handler():
    def decorator(f):
        @wraps(f)
        async def decorated_function(request, *args, **kwargs):
            session = request.token
            if session:
                try:
                    decoded = jwt.decode(session, app.ctx.secret, algorithms=["HS256"])
                    user = await app.ctx.session_manager.look_up(decoded["session"])
                    if user:
                        request.ctx.user = user
                        request.ctx.user["session"] = decoded["session"]
                        return await f(request, *args, **kwargs)
                    else:
                        return response.json(
                            {"error": "session deleted from another device"}, status=401
                        )
                except jwt.ExpiredSignatureError:
                    # remove from app.ctx.session_manager
                    await app.ctx.session_manager.delete_session(decoded["session"])
                    return response.json({"error": "Session expired"}, status=401)
                except jwt.InvalidTokenError:
                    return response.json({"error": "Invalid token"}, status=401)
                except jwt.InvalidSignatureError:
                    return response.json({"error": "Invalid signature"}, status=401)
            else:
                return response.json({"error": "Token not provided"}, status=401)

        return decorated_function

    return decorator


async def revoke_token(token):
    async with app.ctx.aiohttp_session.post(
            "https://oauth2.googleapis.com/revoke", data={"token": token}
    ) as resp:
        return await resp.json()


@app.middleware("response")
async def cors(_, resp):
    resp.headers.update(
        {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        }
    )


@app.listener("before_server_start")
async def setup(app_, _):
    # redis is running on localhost with port 6379, pass it into session manager (it accepts a url)
    app_.ctx.session_manager = RedisSessionManager()
    await app_.ctx.session_manager.connect()
    app_.ctx.session_creation_tokens = {}
    app_.ctx.secret = "iojasdfoiuaousdfljiasdfljasdff"
    app_.ctx.sendinblue_key = json.load(open(os.path.join(pathlib.Path(__file__).parent, "./secrets.json")))[
        "sendinblue_key"]
    app_.ctx.db = await aiosqlite.connect(os.path.join(pathlib.Path(__file__).parent, "./database.db"))
    try:
        app_.ctx.aiohttp_session = aiohttp.ClientSession()
    except Exception as e:
        print(e)
    await create_database_tables()


@app.listener("after_server_stop")
async def teardown(app_, _):
    await app_.ctx.db.close()
    await app_.ctx.aiohttp_session.close()
    await app_.ctx.session_manager.disconnect()


async def create_database_tables():
    await app.ctx.db.execute("CREATE TABLE IF NOT EXISTS interested_people "
                             "(first_name TEXT, last_name TEXT, email TEXT, interested TEXT)")


@app.route("/login")
async def login(request):
    authorization_url, state = flow.authorization_url()
    resp = response.redirect(authorization_url + "&hd=fcpsschools.net")
    resp.cookies["state"] = state
    resp.cookies["state"]["httponly"] = True
    # set redirect if it exists
    if request.args.get("continue"):
        resp.cookies["continue"] = request.args.get("continue")
        resp.cookies["continue"]["httponly"] = True
    if request.args.get("popup"):
        resp.cookies["popup"] = "true"
        resp.cookies["popup"]["httponly"] = True
    return resp


@app.route("/callback")
async def callback(request):
    flow.fetch_token(authorization_response=request.url)

    cookie = request.cookies.get("state")

    if not cookie or not cookie == request.args.get("state"):
        # return response.redirect(config["frontend_url"] + "/state_mismatch")
        return response.json(
            {
                "error": "state mismatch",
                "State was": request.cookies.get("state"),
                "and was supposed to be ": request.args.get("state"),
            }
        )

    credentials = flow.credentials
    token_request = google.auth.transport.requests.Request()
    # noinspection PyProtectedMember
    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token,
        request=token_request,
        audience=credentials.client_id,
    )
    await revoke_token(credentials.token)

    session_creation_token = uuid.uuid4().hex
    app.ctx.session_creation_tokens[session_creation_token] = {
        "email": id_info["email"],
        "first_name": id_info["given_name"],
        "last_name": id_info["family_name"],
        "picture": id_info["picture"].replace("\\", ""),
    }
    resp = response.redirect(
        config["frontend_url"]
        + "/callback?session_creation_token="
        + session_creation_token
        + (f"&continue={request.cookies.get('continue')}" if request.cookies.get("continue") else "")
        + (f"&popup=true" if request.cookies.get("popup") else "")
    )
    if request.cookies.get("continue"): del resp.cookies["continue"]
    if request.cookies.get("popup"): del resp.cookies["popup"]
    del resp.cookies["state"]
    return resp


@app.route("/create_session", methods=["OPTIONS"])
async def create_session_preflight(_):
    resp = response.text(
        "",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        },
    )
    return resp


@app.route("/create_session", methods=["POST"])
async def create_session(request):
    session_creation_token = request.headers.get("session_creation_token")
    if (
            session_creation_token
            and session_creation_token in app.ctx.session_creation_tokens
    ):
        data = app.ctx.session_creation_tokens[session_creation_token]
        del app.ctx.session_creation_tokens[session_creation_token]
        session_id = uuid.uuid4().hex
        # if production, ip is from cloudflare, otherwise use request.ip
        await app.ctx.session_manager.add_session(
            data,
            {
                "session_id": session_id,
                "ip": request.headers.get("CF-Connecting-IP")
                if config["production"]
                else request.ip,
                "user_agent": str(parse(request.headers.get("User-Agent"))),
                "location": await location_from_ip(
                    request.headers.get("CF-Connecting-IP") if config["production"] else request.ip),
            },
        )
        # notify email
        await notify_users_email(data["email"], data["first_name"])
        return response.json(
            {
                "session": jwt.encode(
                    {"session": session_id}, app.ctx.secret, algorithm="HS256"
                ),
                "user": data,
                "success": True,
            }
        )
    else:
        return response.json({"error": "invalid session_creation_token"}, status=401)


@app.route("/everything")
async def everything(_):
    return response.text("Go away!")


@app.route("/user", methods=["OPTIONS"])
async def user_preflight(request):
    resp = response.text(
        "",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Auth-Token, X-Requested-With",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        },
    )
    return resp


@app.route("/user", methods=["GET"])
@session_handler()
async def get_user(request):
    # deep copy, add success field and return
    data = copy.deepcopy(request.ctx.user)
    data["success"] = True
    return response.json(data)


@app.route("/user/sessions", methods=["OPTIONS"])
async def user_sessions_preflight(_):
    resp = response.text(
        "",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Auth-Token, X-Requested-With",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        },
    )
    return resp


@app.route("/user/sessions")
@session_handler()
async def user_sessions(request):
    print(request.ctx.user)
    sessions = await app.ctx.session_manager.list_sessions(
        request.ctx.user["email"], request.ctx.user["session"]
    )
    return response.json({"sessions": sessions, "success": True})


@app.route("/delete_session", methods=["OPTIONS"])
async def delete_session_preflight(_):
    resp = response.text(
        "",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Auth-Token, X-Requested-With",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        },
    )
    return resp


@app.route("/delete_session", methods=["POST"])
@session_handler()
async def delete_session(request):
    data = request.json
    if "session" in data:
        await app.ctx.session_manager.delete_session(data["session"])
        return response.json(
            {
                "success": True,
                "sessions": await app.ctx.session_manager.list_sessions(
                    request.ctx.user["email"], request.ctx.user["session"]
                ),
            }
        )
    else:
        return response.json({"error": "invalid session"}, status=401)


@app.route("/user/logout", methods=["OPTIONS"])
async def logout_preflight(request):
    resp = response.text(
        "",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, "
                                            "X-Auth-Token, X-Requested-With",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        },
    )
    return resp


@app.route("/user/logout", methods=["POST"])
@session_handler()
async def logout(request):
    await app.ctx.session_manager.delete_session(request.ctx.user["session"])
    return response.json({"success": True})


@app.route("/user/update_interested", methods=["OPTIONS"])
async def is_interested_update_preflight(request):
    resp = response.text(
        "",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, "
                                            "X-Auth-Token, X-Requested-With",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        },
    )
    return resp


@app.route("/user/update_interested", methods=["POST"])
@session_handler()
async def is_interested_update(request):
    interested = request.json.get("interested")
    # print(f"""
    # -----------------
    # UPADTTING INTERESTED TO: {interested}
    # -----------------
    # """)
    # print(request.ctx.user["email"])
    # check if user is already interested
    cursor = await app.ctx.db.execute("SELECT interested FROM interested_people WHERE email = ?",
                                      (request.ctx.user["email"],))
    row = await cursor.fetchone()
    if row:
        # update
        await app.ctx.db.execute("UPDATE interested_people SET interested = ? WHERE email = ?",
                                 (str(interested), request.ctx.user["email"]))
        # what if they are already interested, and they want to uninterested? no, they would already be in the db
        # reasons this couldn't work:
    else:
        # insert add first name, last name, and email
        await app.ctx.db.execute(
            "INSERT INTO interested_people (first_name, last_name, email, interested) VALUES (?, ?, ?, ?)",
            (request.ctx.user["first_name"], request.ctx.user["last_name"], request.ctx.user["email"], str(interested)))
    await app.ctx.db.commit()
    return response.json({"success": True})


@app.route("/user/is_interested", methods=["OPTIONS"])
async def is_interested_preflight(_):
    resp = response.text(
        "",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, "
                                            "X-Auth-Token, X-Requested-With",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        },
    )
    return resp


@app.route("/user/is_interested", methods=["GET"])
@session_handler()
async def is_interested(request):
    cursor = await app.ctx.db.execute("SELECT interested FROM interested_people WHERE email = ?",
                                      (request.ctx.user["email"],))
    row = await cursor.fetchone()
    if row:
        # print(f"""
        # ------------------
        # USER"S EMAIL: {request.ctx.user["email"]}
        # CURRENTLY INTERESTED: {bool(row[0])}
        # ROW: {row}
        # ------------------
        # """)
        return response.json({"success": True, "interested": row[0]})
    else:
        # by default, user is interested, update db with this
        await app.ctx.db.execute(
            "INSERT INTO interested_people (first_name, last_name, email, interested) VALUES (?, ?, ?, ?)",
            (request.ctx.user["first_name"], request.ctx.user["last_name"], request.ctx.user["email"], "True"))
        await app.ctx.db.commit()
        return response.json({"success": True, "interested": "True"})


@app.route("/interested_people")
async def interested_people(request):
    print(request.ctx.user)
    # get all interested people WHERE interested = True
    cursor = await app.ctx.db.execute("SELECT * FROM interested_people WHERE interested = ?",
                                      ("True",))
    rows = await cursor.fetchall()
    return response.json({"success": True, "interested_people": rows})


@app.route("/")
async def index(_):
    return response.redirect(config["frontend_url"])


@app.route("/favicon.ico")
async def favicon(_):
    return await response.file(
        os.path.join(pathlib.Path(__file__).parent, "./favicon.ico")
    )


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=8000,
        debug=not config["production"],
    )
