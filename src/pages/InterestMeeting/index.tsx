import "./assets/style.scss";
import GoogleLogo from "./assets/images/google.svg";
import Button from "@mui/material/Button";
const API_URL = import.meta.env.VITE_API_URL;

const InterstMeeting = () => {
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
					MARCH 1<sup>ST</sup>
				</div>
				<div className="time">3PM-4PM</div>
			</div>
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

			<div className="footnote">
				If you are interested in joining us for the meeting, click the
				button above to verify that you are in Herndon High School. You
				will need to use an @fcpsschools.net email.
			</div>
		</div>
	);
};

export default InterstMeeting;
