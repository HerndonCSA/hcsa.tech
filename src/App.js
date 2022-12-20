import "./assets/App.css";
import NavBar from "./components/NavBar";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { useState, lazy } from "react";
import Waves from "./components/Waves";
const HomePage = lazy(() => import("./pages/HomePage"));
const MembersPage = lazy(() => import("./pages/MembersPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

const App = () => {
	const location = useLocation();
  const [wavesHigh, setWavesHigh] = useState(false);

	return (
		<>
    
			<Waves high={wavesHigh}/>
			<div className="app">
				<NavBar />
				<AnimatePresence initial={false} mode='wait'>
					<Routes key={location.pathname} location={location}>
						<Route path="/" element={<HomePage />} />
						<Route path="/members" element={<MembersPage />} />
						<Route path="/contact" element={<ContactPage />} />
					</Routes>
				</AnimatePresence>
			</div>

		</>
	);
};

export default App;