import { useState, useEffect } from 'react';
import "./assets/SessionManager.scss";
import { useNavigate } from 'react-router-dom';
const SessionManager = () => {
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const session = localStorage.getItem("session");
        fetch("https://api.hcsa.tech/user/sessions", {
            method: "GET", headers: {
                "Authorization": "Token " + session,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data);
                    setSessions(data.sessions);
                } else {
                    alert(data.error);
                    window.location.href = "https://api.hcsa.tech/login";
                }
            });
    }, [])

    const deleteSession = (session_id: string) => {
        const session = localStorage.getItem("session");
        fetch("https://api.hcsa.tech/delete_session", {
            method: "POST", headers: {
                "Authorization": "Token " + session,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ session: session_id })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data);
                    setSessions(data.sessions);
                } else {
                    alert(data.error);
                }
            });
    }



    return (
        <div className="session-manager">
            <h1>Session Manager</h1>
            <div className="sessions">
                {
                    sessions.map((session: any) => {
                        return (
                            <div key={session.id} className="session">
                                <p>{session.session_id}</p>
                                <p>{session.ip}</p>
                                <p>{session.user_agent}</p>
                                {session.current ? <p>Current Session</p> : <button onClick={() => deleteSession(session.session_id)}>Delete</button>}
                            </div>
                        )
                    })
                }
            </div>

            <button className="back" onClick={() => navigate("/")}>
                Return Home
            </button>
        </div>
    )

}


export default SessionManager
