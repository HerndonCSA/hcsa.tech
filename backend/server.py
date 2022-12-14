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

from user_agents import parse

from SessionManager import SessionManager

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


def session_handler():
    def decorator(f):
        @wraps(f)
        async def decorated_function(request, *args, **kwargs):
            session = request.token
            if session:
                try:
                    decoded = jwt.decode(session, app.ctx.secret, algorithms=["HS256"])
                    user = app.ctx.session_manager.look_up(decoded["session"])
                    if user:
                        request.ctx.user = user
                        request.ctx.user["session"] = decoded["session"]
                        return await f(request, *args, **kwargs)
                    else:
                        return response.json(
                            {"error": "session deleted from another device"}, status=401
                        )
                except jwt.ExpiredSignatureError:
                    # remove from app.session
                    del app.ctx.sessions[session["email"]]["sessions"][
                        session["session"]
                    ]
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
    async with aiohttp.ClientSession() as session:
        async with session.post(
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
    app_.ctx.session_manager = SessionManager()
    app_.ctx.session_creation_tokens = {}
    app_.ctx.secret = os.urandom(32)


app.register_listener(setup, "before_server_start")


@app.route("/login")
async def login(_):
    authorization_url, state = flow.authorization_url()
    resp = response.redirect(authorization_url)
    resp.cookies["state"] = state
    resp.cookies["state"]["httponly"] = True

    # what type of cookie should I use for state?
    return resp  # maybe could use &hd=fcpsschools.net


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
    return response.redirect(
        config["frontend_url"]
        + "/callback?session_creation_token="
        + session_creation_token
    )


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
        app.ctx.session_manager.add_session(
            data,
            {
                "session_id": session_id,
                "ip": request.headers.get("CF-Connecting-IP")
                if config["production"]
                else request.ip,
                "user_agent": str(parse(request.headers.get("User-Agent"))),
            },
        )
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
    return response.json(str(app.ctx.session_manager))


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
    data = request.ctx.user
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
    sessions = app.ctx.session_manager.list_sessions(
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
        app.ctx.session_manager.delete_session(data["session"])
        return response.json(
            {
                "success": True,
                "sessions": app.ctx.session_manager.list_sessions(
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
    app.ctx.session_manager.delete_session(request.ctx.user["session"])
    return response.json({"success": True})


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
