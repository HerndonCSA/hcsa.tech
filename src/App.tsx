import "./assets/App.scss";
import NavBar from "./components/NavBar";
import Waves from "./components/Waves";
// import Footer from "./components/Footer";
import Callback from "./components/Callback";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { useState, lazy, useEffect } from "react";
import SessionManager from "./components/SessionManager";

import NotFound404 from "./components/HTTPErrors/NotFound404";

const HomePage = lazy(() => import("./pages/HomePage"));
const MembersPage = lazy(() => import("./pages/MembersPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const InterestMeeting = lazy(() => import("./pages/InterestMeeting"));

const API_URL = import.meta.env.VITE_API_URL;

const App = () => {
	const location = useLocation();
	const [userData, setUserData] = useState({});
	const [is_interested, setIsInterested] = useState(null);
	useEffect(() => {
		let session = localStorage.getItem("session");
		if (session) {
			console.log("PREVIOUS SESSION FOUND");
			// -H "Authorization: Token [token]"
			fetch(API_URL + "/user", {
				method: "GET",
				headers: {
					Authorization: "Token " + session,
				},
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.success) {
						console.log(data);
						setUserData(data);
						fetch(API_URL + "/user/is_interested", {
							method: "GET",
							headers: {
								Authorization: "Token " + session,
							},
						})
							.then((response) => response.json())
							.then((data) => {
								console.log(data);
								setIsInterested(data.interested);
							});
					} else {
						// console log in red
						console.log(data);
						console.log("%c" + data.error, "color: red");
						localStorage.removeItem("session");
					}
				});
		} else {
			console.log("NO PREVIOUS SESSION FOUND");
		}
	}, []);
	// if path is /, /members, or /contact, render navbar and waves
	return (
		<>
			{["/", "/members", "/contact"].includes(location.pathname) && (
				<Waves />
			)}
			<div className="app">
				{["/", "/members", "/contact"].includes(location.pathname) && (
					<NavBar userData={userData} setUserData={setUserData} />
				)}
				<AnimatePresence initial={false} mode="wait">
					<Routes key={location.pathname} location={location}>
						<Route path="/" element={<HomePage />} />
						<Route path="/members" element={<MembersPage />} />
						<Route path="/contact" element={<ContactPage />} />
						<Route
							path="/meetings"
							element={
								<InterestMeeting
									userData={userData}
									setUserData={setUserData}
									is_interested={is_interested}
									setIsInterested={setIsInterested}
								/>
							}
						/>
						<Route
							path="/callback"
							element={
								<Callback
									setUserData={setUserData}
									is_interested={is_interested}
									setIsInterested={setIsInterested}
								/>
							}
						/>
						<Route path="/sessions" element={<SessionManager />} />
						<Route path="*" element={<NotFound404 />} />
					</Routes>
				</AnimatePresence>
				{/* <Footer /> */}
			</div>
		</>
	);
};

export default App;
