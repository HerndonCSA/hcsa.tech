import "./assets/NavBar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { memo, useEffect } from "react";
import HomeIcon from "./assets/images/home.svg";
import MembersIcon from "./assets/images/members.svg";
import ContactIcon from "./assets/images/contact.svg";
import Logo from "./assets/images/logo.png";

const NavBar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	// copilot how do I make the navChange's parameter be a type of string?
	// A: You can use a type annotation to specify the type of a parameter

	const navLinkClickEvent = (location: string) => {
		navigate(location);
	};

	useEffect(() => {
		// FOR TEST PURPOSES ONLY
		// const elementArray = [
		// 	".nav-bar",
		// 	".nav-logo",
		// 	".nav-links",
		// 	"ul",
		// 	"li",
		// 	".login-button",
		// ];
		// let a = 0.25;
		// for (let i = 0; i < elementArray.length; i++) {
		// 	a += 0.05;
		// 	let element = document.querySelector(
		// 		elementArray[i]
		// 	) as HTMLElement;
		// 	element.style.backgroundColor = `rgba(0,0,0,${a})`;
		// }
	}, []);

	// copilot how do I make the selectorStyles object have a type of string?
	// A: You can use a type annotation to specify the type of a parameter
	// A: You can use a type annotation to specify the type of a parameter
	// show me how

	const selectorStyles: { [key: string]: { [key: string]: string } } = {
		"/": {},
		"/members": {},
		"/contact": {},
	};

	return (
		<div className="nav-bar">
			<div className="nav-logo">
				<img src={Logo} alt="" />
			</div>

			<div className="nav-links">
				<motion.div
					className="selector"
					style={selectorStyles[location.pathname]}
					animate={{ ...selectorStyles[location.pathname] }}
					transition={{
						duration: 0.1,
						type: "spring",
						stiffness: 60,
						damping: 15,
					}}
					initial={false}
				/>
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
						onClick={() => navLinkClickEvent("/contact")}
						className={
							location.pathname === "/contact" ? "selected" : ""
						}
					>
						<img src={ContactIcon} alt="contact icon" />
						<p>Contact Us</p>
					</li>
				</ul>
			</div>

			<div className="login-button">
				<button>Sign in</button>
			</div>
		</div>
	);
};

export default NavBar;