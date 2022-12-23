import pathlib
from sanic import Sanic, response
from google_auth_oauthlib.flow import Flow
import google.auth.transport.requests
from google.oauth2 import id_token
import jwt
import uuid
import json
import os
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"


import aiohttp
PRODUCTION = False

client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "./client_secret.json")

flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
    redirect_uri="http://localhost:8000/callback"
)


app = Sanic(__name__)


@app.middleware("response")
async def cors(request, resp):
    resp.headers.update({"Access-Control-Allow-Origin": "*"})


@app.listener("before_server_start")
async def setup(app_, loop):
    app_.ctx.sessions = {}
    # get client_secret from config.json
    with open("./backend/config.json", "r") as f:
        config = json.load(f)
    app_.ctx.client_secret = config["client_secret"]


@app.route("/login")
async def login(request):
    authorization_url, state = flow.authorization_url()
    return response.redirect(authorization_url)
    "&hd=fcpsschools.net"

@app.route("/callback")
async def callback(request):
    print(request.url)
    flow.fetch_token(authorization_response=request.url)
    credentials = flow.credentials
    token_request = google.auth.transport.requests.Request()
    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token,
        request=token_request,
        audience=credentials.client_id
    )
    valid_email_extensions = ["@fcps.edu", "@fcpsschools.net"]
    # if not any([id_info["email"].endswith(ext) for ext in valid_email_extensions]):
    #     # revoke the token
    #     async with aiohttp.ClientSession() as session:
    #         async with session.post("https://oauth2.googleapis.com/revoke", data={"token": credentials.token}) as resp:
    #             if resp.status != 200:
    #                 return response.json({"success": False, "error": "invalid email"})
    #     return response.json({"success": False, "error": "invalid email extension, use @fcps.edu or @fcpsschools.net"})
    #  # create jwt token with a uuid, store it in session as a key abd id_info as a value
    uuid_ = str(uuid.uuid4())
    jwt_token = jwt.encode({"session": uuid_}, app.ctx.client_secret, algorithm="HS256")
    id_info["access_token"] = credentials.token
    app.ctx.sessions[uuid_] = id_info
    return response.redirect(f"http://localhost:3000/callback?session={jwt_token}")

@app.route("/user")
async def user(request):
    # return json with firstName, lastName, email, and picture
    session = request.args.get("session")
    # decode session and get the uuid, and check if it is a a valid jwt token
    try:
        session = jwt.decode(session, app.ctx.client_secret, algorithms=["HS256"])
        session_id = session["session"]
    except jwt.exceptions.InvalidSignatureError:
        return response.json({"success": False, "error": "invalid session"})
    
    # check if the uuid is in the sessions
    if session_id in app.ctx.sessions:
        return response.json({
            "success": True,
            "firstName": app.ctx.sessions[session_id]["given_name"],
            "lastName": app.ctx.sessions[session_id]["family_name"],
            "email": app.ctx.sessions[session_id]["email"],
            "picture": app.ctx.sessions[session_id]["picture"]
        })
    else:
        return response.json({"success": False, "error": "invalid session"})



@app.route("/logout", methods=["POST"])
async def logout(request):
    session_id = request.args.get("session")
    # decode session and get the uuid, and check if it is a a valid jwt token
    try:
        session = jwt.decode(session_id, app.ctx.client_secret, algorithms=["HS256"])
        session_id = session["session"]
    except jwt.exceptions.InvalidSignatureError:
        return response.json({"success": False})
    
    # check if the uuid is in the sessions
    if session_id in app.ctx.sessions:
        # revoke the token
        async with aiohttp.ClientSession() as session:
            async with session.post("https://oauth2.googleapis.com/revoke", data={"token": app.ctx.sessions[session_id]["access_token"]}) as resp:
                if resp.status != 200:
                    return response.json({"success": False})
        # delete the session
        del app.ctx.sessions[session_id]
    else:
        return response.json({"success": False})
    
    return response.json({"success": True})

@app.route("/")
async def index(request):
    return response.json({"hello": "world"})

@app.route("/favicon.ico")
async def favicon(request):
    return await response.file("./backend/favicon.ico")

app.register_listener(setup, "before_server_start")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, fast=PRODUCTION, debug=not PRODUCTION)