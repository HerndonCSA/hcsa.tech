import "./assets/NavBar.scss";

import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import Profile from "./components/Profile";
import Dropdown from "./components/Dropdown";

import DesktopNavBar from "./components/DesktopNavBar";
import MobileNavBar from "./components/MobileNavBar";

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
					<button
						onClick={() => {
							window.location.href = API_URL + "/login";
						}}
					>
						Sign in
					</button>
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
