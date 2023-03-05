import "./assets/NavBar.scss";

import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import Profile from "./components/Profile";
import Dropdown from "./components/Dropdown";

import DesktopNavBar from "./components/DesktopNavBar";
import MobileNavBar from "./components/MobileNavBar";

import { Button } from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;

const NavBar = ({ userData, setUserData }: any) => {
	const profileRef = useRef<HTMLDivElement>(null);
	const dropDownRef = useRef<HTMLDivElement>(null);
	const mobileMenuRef = useRef<any>(null);

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();

	const navLinkClickEvent = (location: string) => {
		// change title of page
		navigate(location);
		if (mobileMenuOpen) setMobileMenuOpen(false);
		if (mobileMenuRef.current)
			mobileMenuRef.current.classList.remove("open");
	};

	const clickOutSideToCloseDropdown = useCallback(
		(nativeEvent: any) => {
			if (
				profileRef.current &&
				!profileRef.current.contains(nativeEvent.target)
			) {
				setDropdownOpen(false);
			}
		},
		[profileRef]
	);

	useEffect(() => {
		document.addEventListener("click", clickOutSideToCloseDropdown);

		return function cleanup() {
			document.removeEventListener("click", clickOutSideToCloseDropdown);
		};
	}, [clickOutSideToCloseDropdown]);

	return (
		<div className="navbar-container">
			<DesktopNavBar />
			<MobileNavBar
				setMobileMenuOpen={setMobileMenuOpen}
				mobileMenuOpen={mobileMenuOpen}
			/>
			{/* USERDATA AND PROFILE COMPONENTS */}
			{/* Check if userdata is empty, if true return sign in button, else return profile component */}
			{Object.keys(userData).length === 0 ? (
				<motion.div
					key="sign-in"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="sign-in-button"
				>
					<Button
						onClick={() => {
							// window.location.href = API_URL + "/login";

							// create popup window, and listen to changes for localstorage to update user data
							// center window in middle of screen
							const y =
								window.outerHeight / 2 + window.screenY - 300;
							const x =
								window.outerWidth / 2 + window.screenX - 300;
							const popup = window.open(
								API_URL + "/login?popup=true",
								"Login",
								`width=600,height=600,top=${y},left=${x}`
							);

							// add event listener to listen to changes in localstorage
							window.addEventListener("storage", (e) => {
								if (e.key === "session") {
									// update user data
									const token =
										localStorage.getItem("session");
									fetch(API_URL + "/user", {
										method: "GET",
										headers: {
											Authorization: `Bearer ${token}`,
										},
									})
										.then((res) => res.json())
										.then((data) => {
											setUserData(data);
										});
									// close popup
									popup?.close();
								}
							});

							// add event listener to listen to changes in popup window
						}}
					>
						Sign in
					</Button>
				</motion.div>
			) : (
				<motion.div
					key="profile"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="profile-and-dropdown"
				>
					<Profile
						userData={userData}
						dropdownOpen={dropdownOpen}
						setDropdownOpen={setDropdownOpen}
						profileRef={profileRef}
						dropdownRef={dropDownRef}
					/>
					<AnimatePresence>
						{/* DROPDOWN COMPONENT */}
						{dropdownOpen && (
							<Dropdown
								dropDownRef={dropDownRef}
								profileRef={profileRef}
								setUserData={setUserData}
								setOpen={setDropdownOpen}
								opened={dropdownOpen}
							/>
						)}
					</AnimatePresence>
				</motion.div>
			)}
		</div>
	);
};

export default NavBar;
