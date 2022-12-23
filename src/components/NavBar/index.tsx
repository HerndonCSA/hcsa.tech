import "./assets/NavBar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Profile from "./components/Profile";
import Dropdown from "./components/Dropdown";
import HomeIcon from "./assets/images/home.svg";
import MembersIcon from "./assets/images/members.svg";
import ContactIcon from "./assets/images/contact.svg";
import Logo from "./assets/images/logo.png";
import React from "react";

// userdata is like
// {"firstName":"Sudarshan","lastName":"Lamichhane (Student)","email":"1559020@fcpsschools.net","picture":"https:\/\/lh3.googleusercontent.com\/a\/AEdFTp4QRSTIIf1H3O31JODtNiKM9nuQvxnswCg37bUA4A=s96-c"}

const NavBar = ({ userData, setUserData }: any) => {
	const profileRef = useRef<HTMLDivElement>(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	// copilot how do I make the navChange's parameter be a type of string?
	// A: You can use a type annotation to specify the type of a parameter

	const navLinkClickEvent = (location: string) => {
		navigate(location);
	};

	const clickOutSideToCloseDropdown = useCallback((nativeEvent: any) => {
		if (
			profileRef.current &&
			!profileRef.current.contains(nativeEvent.target)
		) {
			setDropdownOpen(false);
		}

	}, [profileRef]);


	useEffect(() => {
		document.addEventListener("click", clickOutSideToCloseDropdown)

		return function cleanup() {
			document.removeEventListener("click", clickOutSideToCloseDropdown)
		}
	}, [clickOutSideToCloseDropdown])


	useEffect(() => {

		// set width of userMenu to be the same width as the profile div
		if (profileRef.current) {
			const profileWidth = profileRef.current.offsetWidth;
			console.log(profileWidth);
			const userMenu = document.querySelector(".user-menu") as HTMLDivElement;
			if (userMenu) {
				userMenu.style.width = `${profileWidth}px`;
			}
		}


	}, [profileRef])


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
			{/* Check if userdata is empty */}
			<>
				{Object.keys(userData).length === 0 ? (
					<motion.div key="sign-in"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}

						className="sign-in-button">
						<button
							onClick={() => {
								window.location.href =
									"http://localhost:8000/login";
							}}
						>
							Sign in
						</button>
					</motion.div>
				) : (
					<motion.div key="profile"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}>
						<Profile userData={userData} dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} profileRef={profileRef} />
						<AnimatePresence>
							{/* DROPDOWN COMPONENT */}
							{dropdownOpen && (
								<Dropdown setUserData={setUserData} setOpen={setDropdownOpen} opened={dropdownOpen} />
							)}
						</AnimatePresence>

					</motion.div>
				)}
			</>

		</div >
	);
};

export default NavBar;
