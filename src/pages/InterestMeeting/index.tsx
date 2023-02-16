import "./assets/style.scss";
import GoogleLogo from "./assets/images/google.svg";
import Button from "@mui/material/Button";
const API_URL = import.meta.env.VITE_API_URL;

const InterstMeeting = ({ userData, setUserData }: any) => {
	return (
		<div className="interest-meeting">
			<div className="header">
				<div className="logo">
					<h1>HERNDON</h1>
					<h2>COMPUTER SCIENCE ASSOCIATION</h2>
				</div>

				<hr />
				<div className="title">
					<h3>INTEREST MEETING</h3>
				</div>
			</div>

			<div className="meeting-time">
				<div className="date">
					March 1<sup>ST</sup>
				</div>
				<div className="location">Mr. Barber's Room (K200)</div>
				<div className="time">3PM - 4PM</div>
			</div>

			{
				// if user is logged in, show button to join meeting
				Object.keys(userData).length !== 0 ? (
					<Button variant="contained">Interested</Button>
				) : (
					// if user is not logged in, show button to sign in
					<Button
						variant="contained"
						className="sign-in-button"
						onClick={() => {
							window.location.href =
								API_URL + "/login?continue=interest-meeting";
						}}
					>
						<img src={GoogleLogo} alt="Google Logo" />
						Continue with Google
					</Button>
				)
			}

			<div className="footnote">
				{Object.keys(userData).length !== 0 ? (
					<>
						{`Logged in as soos. Not you? `}
						<span
							onClick={() => {
								fetch(API_URL + "/user/logout", {
									method: "POST",
									headers: {
										Authorization:
											"Token " +
											localStorage.getItem("session"),
									},
								})
									.then((res) => res.json())
									.then((data) => {
										if (data.success) {
											localStorage.removeItem("session");
											setUserData({});
										} else {
											alert("Error logging out");
										}
									});
							}}
						>
							Sign out
						</span>
					</>
				) : (
					`If you are interested in joining us for the meeting, click the
					button above to verify that you are in High School. You
					will need to use an @domain.net email.`
				)}
			</div>
		</div>
	);
};

export default InterstMeeting;
