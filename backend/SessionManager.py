import redis.asyncio as redis
import json


class RedisSessionManager:
    def __init__(self, port=6379, host='localhost'):
        self.port = port
        self.host = host
        self.users = None
        self.sessions = None

    async def connect(self):
        self.users = await redis.Redis(port=self.port, host=self.host, db=0)
        self.sessions = await redis.Redis(port=self.port, host=self.host, db=1)

    async def disconnect(self):
        await self.users.close()
        await self.sessions.close()

    async def create_session(self, user_data: dict, session_data: dict) -> None:
        email = user_data['email']
        await self.users.set(email, json.dumps(user_data))
        await self.sessions.set(session_data['session_id'], json.dumps((email, session_data)))

    async def look_up(self, session_id: int) -> dict:
        session = await self.sessions.get(session_id)
        if session:
            email, _ = json.loads(session)
            user = await self.users.get(email)
            return json.loads(user)
        return {}

    async def add_session(self, user_data: dict, session_data: dict) -> None:
        email = user_data['email']
        if await self.users.exists(email):
            await self.sessions.set(session_data['session_id'], json.dumps((email, session_data)))
        else:
            await self.create_session(user_data, session_data)

    async def list_sessions(self, email: str, current_session_id: int = None):
        sessions = []
        for session_id in await self.sessions.keys():
            session = await self.sessions.get(session_id)
            if session:
                session_email, session_data = json.loads(session)
                if session_email == email:
                    session_data['current'] = session_id == current_session_id
                    sessions.append(session_data)
        return sessions

    async def delete_session(self, session_id: int) -> None:
        session = await self.sessions.get(session_id)
        if session:
            email, _ = json.loads(session)
            await self.sessions.delete(session_id)
            if not await self.list_sessions(email):
                await self.users.delete(email)

    async def all_sessions(self):
        sessions = []
        for session_id in await self.sessions.keys():
            session = await self.sessions.get(session_id)
            if session:
                email, session_data = json.loads(session)
                session_data['email'] = email
                sessions.append(session_data)
        return sessions



class SessionManager:
    def __init__(self):
        self.sessions = {}
        self.users = {}

    def create_session(self, user_data: dict, session_data: dict) -> None:
        email = user_data['email']
        self.users[email] = user_data
        self.sessions[session_data['session_id']] = (email, session_data)

    def look_up(self, session_id: int) -> dict:
        if session_id in self.sessions:
            email, _ = self.sessions[session_id]
            return self.users[email]
        return {}

    def add_session(self, user_data: dict, session_data: dict) -> None:
        if user_data["email"] in self.users:
            self.sessions[session_data['session_id']] = (user_data["email"], session_data)
        else:
            self.create_session(user_data, session_data)

    def list_sessions(self, email: str, current_session_id: int = None):
        sessions = [session[1] for session in self.sessions.values() if session[0] == email]
        for session in sessions:
            print(current_session_id, session['session_id'])
            session['current'] = session['session_id'] == current_session_id
        return sessions

    def delete_session(self, session_id: int) -> None:
        if session_id in self.sessions:
            email, _ = self.sessions.pop(session_id)
            if not self.list_sessions(email):
                self.users.pop(email)

    def __str__(self):
        user_str = '\n'.join([f"{email}: {data}" for email, data in self.users.items()])
        session_str = '\n'.join([f"{session_id}: {data}" for session_id, data in self.sessions.items()])
        return f"Users:\n{user_str}\nSessions:\n{session_str}"
