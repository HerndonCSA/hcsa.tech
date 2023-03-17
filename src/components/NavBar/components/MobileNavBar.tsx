import HomeIcon from "../assets/images/home.svg";
import MembersIcon from "../assets/images/members.svg";
import ContactIcon from "../assets/images/contact.svg";
import { useLocation, useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import { useState } from "react";

const MobileNavBar = ({
	setMobileMenuOpen,
	mobileMenuOpen,
}: {
	setMobileMenuOpen: any;
	mobileMenuOpen: boolean;
}) => {
	const location = useLocation();
	const navigate = useNavigate();

	const navLinkClickEvent = (location: string) => {
		// close the mobile menu
		setMobileMenuOpen(false);
		navigate(location);
	};

	return (
		<>
			<div className="burger-container">
				<div
					className={"burger " + (mobileMenuOpen ? " open" : "")}
					onClick={() => {
						setMobileMenuOpen(!mobileMenuOpen);
					}}
				/>
			</div>

			{/* SIDEBAR */}
			<motion.div
				animate={{ left: mobileMenuOpen ? "0" : "-60vw" }}
				className="side-navbar"
			>
				<ul>
					<li
						onClick={() => navLinkClickEvent("/")}
						// className={location.pathname === "/" ? "selected" : ""}
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
			</motion.div>
		</>
	);
};

export default MobileNavBar;
