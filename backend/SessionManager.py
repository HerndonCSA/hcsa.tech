class SessionManager:
    def __init__(self):
        self.sessions = {}
        self.users = {}

    def create_session(self, user_data, session_data) -> None:
        email = user_data['email']
        self.users[email] = user_data
        self.sessions[session_data['session_id']] = (email, session_data)

    def look_up(self, session_id) -> dict:
        if session_id in self.sessions:
            email, _ = self.sessions[session_id]
            return self.users[email]
        return {}

    def add_session(self, user_data, session_data) -> None:
        if user_data["email"] in self.users:
            self.sessions[session_data['session_id']] = (user_data["email"], session_data)
        else:
            self.create_session(user_data, session_data)

    def list_sessions(self, email, current_session_id=None):
        sessions = [session[1] for session in self.sessions.values() if session[0] == email]
        for session in sessions:
            print(current_session_id, session['session_id'])
            session['current'] = session['session_id'] == current_session_id
        return sessions

    def delete_session(self, session_id) -> None:
        if session_id in self.sessions:
            email, _ = self.sessions.pop(session_id)
            if not self.list_sessions(email):
                self.users.pop(email)

    def __str__(self):
        user_str = '\n'.join([f"{email}: {data}" for email, data in self.users.items()])
        session_str = '\n'.join([f"{session_id}: {data}" for session_id, data in self.sessions.items()])
        return f"Users:\n{user_str}\nSessions:\n{session_str}"
