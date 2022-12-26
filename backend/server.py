import pathlib
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

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
client_secrets_file = os.path.join(
    pathlib.Path(__file__).parent, "./client_secret.json")
config = json.load(
    open(os.path.join(pathlib.Path(__file__).parent, "./config.json"))
)

# create random secret
config["secret"] = os.urandom(32).hex()

flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=["https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "openid"],
    redirect_uri="https://api.hcsa.tech/callback" if config["production"]
    else "http://localhost:8000/callback")

app = Sanic(config["name"])


def session_handler():
    def decorator(f):
        @wraps(f)
        async def decorated_function(request, *args, **kwargs):
            session = request.token
            if session:
                print("SESSION WAS :" + session)
                try:
                    session = jwt.decode(
                        session, config["secret"], algorithms=["HS256"])
                    if session["email"] not in app.ctx.sessions or \
                            session["session"] not in app.ctx.sessions[session["email"]]["sessions"]:
                        return response.json(
                            {"success": False,
                             "error": "invalid session, session not found, the server probs restarted"})
                    return await f(request, *args, **kwargs)
                except jwt.ExpiredSignatureError:
                    # remove from app.session
                    del app.ctx.sessions[session["email"]
                                         ]["sessions"][session["session"]]
                    return response.json({"error": "Session expired"}, status=401)

                # except jwt.InvalidSignatureError:
                #     return response.json({"error": "Invalid signature"}, status=401)
            else:
                return response.json({"error": "No session found"}, status=401)

        return decorated_function

    return decorator


async def revoke_token(token):
    async with aiohttp.ClientSession() as session:
        async with session.post("https://oauth2.googleapis.com/revoke", data={"token": token}) as resp:
            return await resp.json()


@app.middleware("response")
async def cors(_, resp):
    resp.headers.update({"Access-Control-Allow-Origin": "*",
                         "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Auth-Token, X-Requested-With",
                         "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"})


@app.listener("before_server_start")
async def setup(app_, _):
    app_.ctx.sessions = {}


app.register_listener(setup, "before_server_start")


@app.route("/login")
async def login(_):
    authorization_url, state = flow.authorization_url()
    resp = response.redirect(authorization_url)
    resp.cookies["state"] = state
    resp.cookies["state"]["httponly"] = False

    # what type of cookie should I use for state?
    return resp  # maybe could use &hd=fcpsschools.net


@app.route("/callback")
async def callback(request):
    flow.fetch_token(authorization_response=request.url)

    cookie = request.cookies.get("state")

    if not cookie or not cookie == request.args.get("state"):
        # return response.redirect(config["frontend_url"] + "/state_mismatch")
        return response.json({"error": "state mismatch",
                              "State was": request.cookies.get("state"),
                              "and was supposed to be ": request.args.get("state")})

    credentials = flow.credentials
    token_request = google.auth.transport.requests.Request()
    # noinspection PyProtectedMember
    id_info = id_token.verify_oauth2_token(id_token=credentials._id_token, request=token_request,
                                           audience=credentials.client_id)
    await revoke_token(credentials.token)

    uuid_ = str(uuid.uuid4())
    email = id_info["email"]
    jwt_token = jwt.encode({"email": email, "session": uuid_},
                           config["secret"], algorithm="HS256")
    print("SESSION IS SUPPOSED TO BE: " + jwt_token)
    if email not in app.ctx.sessions:
        # use ip from cloudflare if production
        app.ctx.sessions[email] = {
            "firstName": id_info["given_name"],
            "lastName": id_info["family_name"],
            "email": email,
            "picture": id_info["picture"],
            "sessions": {

                uuid_: {
                    "ip": request.ip if not config["production"] else request.headers.get("CF-Connecting-IP"),
                    "User-Agent": request.headers.get("User-Agent"),
                }
            }
        }
    else:
        app.ctx.sessions[email]["sessions"][uuid_] = {
            "ip": request.ip if not config["production"] else request.headers.get("CF-Connecting-IP"),
            "User-Agent": request.headers.get("User-Agent"),
        }

    return response.redirect(config["frontend_url"] + "/callback?session=" + jwt_token)


@app.route("/user", methods=["OPTIONS"])
async def user_preflight(request):
    resp = response.text("", headers={
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Auth-Token, X-Requested-With",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"})
    return resp


@app.route("/everything")
async def everything(request):
    if not config["production"]:
        return response.json(app.ctx.sessions)
    else:
        # return formated app.ctx.sessions with line breaks and formatting
        x = json.dumps(app.ctx.sessions, indent=4)
        return response.text(x)


@app.route("/user", methods=["GET"])
@session_handler()
async def user(request):
    session = request.token
    session = jwt.decode(session, config["secret"], algorithms=["HS256"])
    data = copy.deepcopy(app.ctx.sessions[session["email"]])
    del data["sessions"]
    data["success"] = True
    return response.json(data)


@app.route("/user/sessions")
# @session_handler()
async def user_sessions(request):
    session = request.args.get("session")
    session = jwt.decode(session, config["secret"], algorithms=["HS256"])
    # create html from the sessions
    sessions = app.ctx.sessions.get(session["email"], {}).get("sessions", {})
    if not sessions:
        return response.json({"error": "No sessions found"}, status=404)

    html = """
            <!DOCTYPE html>
            <html>
            <head>
            <title>Sessions</title>
            </head>
            <body>
            <h1>Sessions</h1>
            <table>
            """
    for session_ in sessions:
        html += f"""
                <tr>
                <td>ID: {f"<strong>{session['session']}</strong>" if session_ == session["session"] else session_}</td>
                <td>IP: {sessions[session_]["ip"]}</td>
                <td>USER AGENT: {sessions[session_]["User-Agent"]}</td>
                </tr>
                """
    html += """
            </table>
            </body>
            </html>
            """
    return response.html(html)


@app.route("/user/logout", methods=["OPTIONS"])
async def logout_preflight(request):
    resp = response.text("", headers={
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Auth-Token, X-Requested-With",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"})
    return resp


@app.route("/user/logout", methods=["POST"])
# @session_handler()
async def logout(request):
    session = request.token
    session = jwt.decode(session, config["secret"], algorithms=["HS256"])
    del app.ctx.sessions[session["email"]]["sessions"][session["session"]]
    return response.json({"success": True})


@app.route("/")
async def index(_):
    return response.redirect(config["frontend_url"])


@app.route("/favicon.ico")
async def favicon(_):
    return await response.file(os.path.join(pathlib.Path(__file__).parent, "./favicon.ico"))

# if production is false in the config file, then the server will be ran in debug mode
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000,
            fast=config["production"], debug=True)
