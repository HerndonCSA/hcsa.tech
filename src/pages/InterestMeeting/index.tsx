import './assets/style.scss';
import GoogleLogo from './assets/images/google.svg';
import InterestedImage from './assets/images/interested.svg';
import NotInterestedImage from './assets/images/not-interested.svg';
import Button from '@mui/material/Button';

const API_URL = import.meta.env.VITE_API_URL;
// import useEffect, and useState
import { useEffect, useState } from 'react';

const InterestMeeting = ({
	userData,
	setUserData,
	is_interested,
	setIsInterested,
}: any) => {
	// useEffect log is_interested
	useEffect(() => {
		console.log(is_interested);
	}, [is_interested]);

	function toggleInterested() {
		const session = localStorage.getItem('session');

		fetch(API_URL + '/user/update_interested', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Token ' + session,
			},
			body: JSON.stringify({
				interested:
					is_interested == 'True' ? 'False' : ('True' as string),
			}),
		})
			.then((response) => {
				if (response.status === 200) {
					setIsInterested(
						is_interested == 'True' ? 'False' : ('True' as string)
					);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	return (
		<div className="interest-meeting">
			<div className="header">
				<div className="logo">
					<h1>HERNDON</h1>
					<h2>COMPUTER SCIENCE ASSOCIATION</h2>
				</div>

				<hr />

				<div className="title">
					<h3>NEXT MEETING</h3>
				</div>
			</div>

			<div className="meeting-time">
				<div className="date">
					March 22<sup>ND</sup>
				</div>

				<div className="location">Mr. Barber's Room (K200)</div>

				<div className="time">3PM - 4PM</div>
			</div>

			{
				// if user is logged in, show button to join meeting
				Object.keys(userData).length !== 0 ? (
					<>
						{is_interested && (
							<Button
								// add a "not" in front of the button class & text if the user is not interested
								variant="contained"
								className={`${
									is_interested == 'True' ? '' : 'not-'
								}interested-button`}
								onClick={toggleInterested}
							>
								{/* image, depends on if the user is interested or not */}
								<img
									src={
										is_interested == 'True'
											? InterestedImage
											: NotInterestedImage
									}
									alt={`${
										is_interested ? '' : 'Not'
									} interested`}
								/>
								{/* text, depends on if the user is interested or not */}
								{`Currently ${
									is_interested == 'True' ? '' : 'Not'
								} Interested`}
							</Button>
						)}
						<p className="info">Tap to toggle</p>
					</>
				) : (
					// if user is not logged in, show button to sign in
					<Button
						variant="contained"
						className="sign-in-button"
						onClick={() => {
							window.location.href =
								API_URL + '/login?continue=interest-meeting';
						}}
					>
						<img src={GoogleLogo} alt="Google Logo" />
						Continue with Google
					</Button>
				)
			}

			{Object.keys(userData).length !== 0 ? (
				<div className="footnote margin-top">
					{`Logged in as ${userData.first_name}. Not you? `}
					<Button
						variant="text"
						className="sign-out-button"
						onClick={() => {
							fetch(API_URL + '/user/logout', {
								method: 'POST',
								headers: {
									Authorization:
										'Token ' +
										localStorage.getItem('session'),
								},
							})
								.then((res) => res.json())
								.then((data) => {
									if (data.success) {
										localStorage.removeItem('session');
										setUserData({});
									} else {
										alert('Error logging out');
									}
								});
						}}
					>
						Sign out
					</Button>
				</div>
			) : (
				<div className="footnote">
					If you are interested in joining us for the meeting, click
					the button above to verify that you are in High School. You
					will need to use an @fcpsschools.net email.
				</div>
			)}
		</div>
	);
};

export default InterestMeeting;
