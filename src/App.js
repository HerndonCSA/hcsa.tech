import "./assets/App.css";
import NavBar from "./components/NavBar";
import Waves from "./components/Waves";
import Footer from "./components/Footer";

import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { useState, lazy } from "react";

const HomePage = lazy(() => import("./pages/HomePage"));
const MembersPage = lazy(() => import("./pages/MembersPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

const App = () => {
	const location = useLocation();

	return (
		<>
			<Waves />
			<div className="app">
				<NavBar/>
				<AnimatePresence initial={false} mode='wait'>
					<Routes key={location.pathname} location={location}>
						<Route path="/" element={<HomePage />} />
						<Route path="/members" element={<MembersPage />} />
						<Route path="/contact" element={<ContactPage />} />
					</Routes>
				</AnimatePresence>
				<Footer />
			</div>

		</>
	);
};

export default App;