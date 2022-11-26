import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "./style/style.css"
import HomePage from "./HomePage";
import MembersPage from './MembersPage';
import ContactPage from "./ContactPage";
import particlesOptions from "./particles.json";
import { Route, Routes, Link } from "react-router-dom";
import LinkButton from "./LinkButton";
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion} from "framer-motion";





const App = () => {
  
  const particlesInit = useCallback(async engine => {
    console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    await console.log(container);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const navLinkClick = (e) => {
    e.preventDefault();
    navigate(e.target.href);
  }

  const selectorStyles = {
    "/": {
      marginRight: "32.85em",
      width: "5.71em"
    },
    "/members": {
      marginRight: "3.154em",
      width: "7.86em"
    },
    "/contact": {
      marginRight: "-29.6em",
      width: "8.9em"
    }
  }

  return (
    <>
      <Particles id="tsparticles" options={particlesOptions} init={particlesInit} loaded={particlesLoaded} />
      <div className="login">
        <h1>Login</h1>
      </div>
      <div className="nav">
        <ul>
          {/* Use a ternary operator to add the selected class if location.pathname is the current path*/}
          <li className={location.pathname === "/" ? "" : "unselected"}>
            <LinkButton to="/">Home</LinkButton>
          </li>
          <li className={location.pathname === "/members" ? "" : "unselected"}>
            <LinkButton to="/members">Members</LinkButton>
          </li>
          <li className={location.pathname === "/contact" ? "" : "unselected"}>
            <LinkButton to="/contact">Contact Us</LinkButton>
          </li>
        </ul>
        <motion.div className="selector" style={selectorStyles[location.pathname]} animate={{...selectorStyles[location.pathname]}} transition={{duration: 0.5, type: "spring", stiffness: 60, damping: 15}} initial={false}/>

      </div>
      <AnimatePresence initial={false} exitBeforeEnter>
        <Routes key={location.pathname} location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/members" element={<MembersPage />} /> 
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </AnimatePresence>

    </>
  );
};

export default App;
