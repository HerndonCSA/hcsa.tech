import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react';

function Callback( { setUserData }: any) {
    const navigate = useRef(useNavigate());

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const session = urlParams.get('session_creation_token') as string;
        fetch('https://api.hcsa.tech/create_session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "session_creation_token": session,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    localStorage.setItem('session', data.session);
                    setUserData(data.user);
                    navigate.current('/');
                } else {
                    alert('error');
                }
            }
            );

    }, [])

    return null;

}

export default Callback;
