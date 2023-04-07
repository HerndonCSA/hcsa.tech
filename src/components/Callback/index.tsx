import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function Callback({ setUserData, setIsInterested }: any) {
	const navigate = useRef(useNavigate());

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const session = urlParams.get('session_creation_token') as string;
		fetch(API_URL + '/create_session', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				session_creation_token: session,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					localStorage.setItem('session', data.session);
					setUserData(data.user);
					fetch(API_URL + '/user/is_interested', {
						method: 'GET',
						headers: {
							Authorization: 'Token ' + data.session,
						},
					})
						.then((response) => response.json())
						.then((data) => {
							console.log(data);
							setIsInterested(data.interested);
						})
						.catch((error) => {
							console.log(error);
						});

					// check for continue query param
					const urlParams = new URLSearchParams(
						window.location.search
					);

					const windowIsPopup = urlParams.get('popup');
					if (windowIsPopup) {
						window.close();
						return;
					}

					const continueTo = urlParams.get('continue');
					if (continueTo) {
						switch (continueTo) {
							case 'interest-meeting':
								navigate.current('/meetings');
								break;
							case 'sessions':
								navigate.current('/sessions');
								break;
							default:
								navigate.current('/');
								break;
						}
					} else {
						navigate.current('/');
					}
				} else {
					alert('error');
				}
			});
	}, []);

	return null;
}

export default Callback;
