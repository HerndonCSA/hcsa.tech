import HomeIcon from "../assets/images/home.svg";
import MembersIcon from "../assets/images/members.svg";
import ContactIcon from "../assets/images/contact.svg";
import Logo from "../assets/images/logo.png";
import { useLocation, useNavigate } from "react-router-dom";

const DesktopNavBar = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const navLinkClickEvent = (location_: string) => {
		// change the title of the page
		updatePageTitle(location_);
		navigate(location_);
	};

	function updatePageTitle(location_: string) {
		switch (location_) {
			case "/":
				document.title = "Herndon Computer Science Association";
				break;
			case "/members":
				document.title = "Members | HCSA";
				break;
			case "/contact":
				document.title = "Contact Us | HCSA";
				break;
			default:
				document.title = "Herndon Computer Science Association";
				break;
		}
	}

	return (
		<>
			<div className="nav-logo">
				<img src={Logo} alt="" />
			</div>

			<div className="nav-links">
				<ul>
					<li
						onClick={() => navLinkClickEvent("/")}
						className={location.pathname === "/" ? "selected" : ""}
					>
						<img src={HomeIcon} alt="home icon" />
						<p>Home</p>
					</li>

					<li
						onClick={() => navLinkClickEvent("/members")}
						className={
							location.pathname === "/members" ? "selected" : ""
						}
					>
						<img src={MembersIcon} alt="members icon" />
						<p>Members</p>
					</li>

					<li
						onClick={() => {
							window.open("mailto:hello@hcsa.tech");
						}}
						className={
							location.pathname === "/contact" ? "selected" : ""
						}
					>
						<img src={ContactIcon} alt="contact icon" />
						<p>Contact Us</p>
					</li>
				</ul>
			</div>
		</>
	);
};

export default DesktopNavBar;
