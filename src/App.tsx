import "./assets/App.css";
import NavBar from "./components/NavBar";
import Waves from "./components/Waves";
import Footer from "./components/Footer";
import Callback from "./components/Callback";

import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { useState, lazy, useEffect } from "react";

const HomePage = lazy(() => import("./pages/HomePage"));
const MembersPage = lazy(() => import("./pages/MembersPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

const App = () => {
	const location = useLocation();
	const [userData, setUserData] = useState({});
	useEffect(() => {
		let session = localStorage.getItem("session");
		if (session) {
			fetch("http://localhost:8000/user?session=" + session)
				.then((res) => res.json())
				.then((data) => {
					if (data.success) {
						console.log(data);
						setUserData(data);
					} else {
						console.log("error");
						console.log(data);
						localStorage.removeItem("session");
					}
				});
		}
	}, []);
	return (
		<>
			<Waves />
			<div className="app">
				<NavBar userData={userData} setUserData={setUserData} />
				<AnimatePresence initial={false} mode="wait">
					<Routes key={location.pathname} location={location}>
						<Route path="/" element={<HomePage />} />
						<Route path="/members" element={<MembersPage />} />
						<Route path="/contact" element={<ContactPage />} />
						<Route path="/callback" element={<Callback />} />
					</Routes>
				</AnimatePresence>
				<Footer />
			</div>
		</>
	);
};

export default App;
