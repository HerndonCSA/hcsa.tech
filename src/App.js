import { useCallback, useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "./assets/styles/style.css"
import HomePage from "./HomePage";
import MembersPage from './MembersPage';
import ContactPage from "./ContactPage";
import particlesOptions from "./particles.json";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useCycle } from "framer-motion";





const App = () => {
  
  const particlesInit = useCallback(async engine => {
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

  const animationVariants = {
    visible: { 
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" }
    },
    enterLeft:{
      x:'-10vw',
      opacity: 0,
      transition: { duration: 0.4, ease: 'easeInOut' }
    },
    enterRight:{
      x:'10vw',
      opacity: 0,
      transition: { duration: 0.4, ease: 'easeInOut' }
    },
    exitLeft:{
      x:'-10vw',
      opacity: 0,
      transition: { duration: 0.4, ease: 'easeInOut' }
    },
    exitRight:{
      x:'10vw',
      opacity: 0,
      transition: { duration: 0.4, ease: 'easeInOut' }
    },
    "initial": {
      x: 0,
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  };

  const [exitAnimation, setExitAnimation] = useState("");
  const [enterAnimation, setEnterAnimation] = useState("");
  

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
          <li className={location.pathname === "/" ? "" : "unselected"}
          onClick={() => {
            if(location.pathname === "/") return;
            if(location.pathname === "/members") {
              setExitAnimation("exitRight");  
              setEnterAnimation("enterLeft");
            }
            if(location.pathname === "/contact") {
              setExitAnimation("exitRight");
              setEnterAnimation("enterLeft");
            }
            navigate("/");
          }}
          >
            <button>Home</button>
          </li>
          <li className={location.pathname === "/members" ? "" : "unselected"}
          onClick={() => {
            if(location.pathname === "/members") return;
            if(location.pathname === "/") {
              setExitAnimation("exitRight");
              setEnterAnimation("enterLeft");
            }
            if(location.pathname === "/contact") {
              setExitAnimation("exitRight");
              setEnterAnimation("enterLeft");
            }
            navigate("/members");
          }}
          >
            <button to="/members">Members</button>
          </li>
          <li className={location.pathname === "/contact" ? "" : "unselected"}
          onClick={() => {
            if(location.pathname === "/contact") return;
            if(location.pathname === "/") {
              setExitAnimation("exitRight");
              setEnterAnimation("enterLeft");
            }
            if(location.pathname === "/members") {
              setExitAnimation("exitLeft");
              setEnterAnimation("enterRight");
            }
            navigate("/contact");
          }}
          >
            <button to="/contact">Contact Us</button>
          </li>
        </ul>
        <motion.div className="selector" style={selectorStyles[location.pathname]} animate={{...selectorStyles[location.pathname]}} transition={{duration: 0.5, type: "spring", stiffness: 60, damping: 15}} initial={false}/>

      </div>
      <AnimatePresence initial={false} >
        <Routes key={location.pathname} location={location}>
          <Route path="/" element={<HomePage enterAnimation={enterAnimation} exitAnimation={exitAnimation} animationVariants={animationVariants} />} />
          <Route path="/members" element={<MembersPage enterAnimation={enterAnimation} exitAnimation={exitAnimation} animationVariants={animationVariants} />} /> 
          <Route path="/contact" element={<ContactPage enterAnimation={enterAnimation} exitAnimation={exitAnimation} animationVariants={animationVariants} />} />
        </Routes>
      </AnimatePresence>

    </>
  );
};

export default App;
