import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "./style/style.css"
import HomePage from './HomePage/HomePage';
import MembersPage from './MembersPage/MembersPage';
import ContactPage from "./ContactPage/ContactPage";
import particlesOptions from "./particles.json";
import { Route, Routes, Link } from "react-router-dom";
import LinkButton from "./LinkButton";
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";





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

  const navLinkClick = (e) => {
    e.preventDefault();
    navigate(e.target.href);
  }

  return (
    <>
      <Particles id="tsparticles" options={particlesOptions} init={particlesInit} loaded={particlesLoaded} />
      <div className="login">
        <h1>Login</h1>
      </div>
      <div className="nav">
        <ul>
          <li className="selected">
            <LinkButton to="/">Home</LinkButton>
          </li>
          <li className="">
            <LinkButton to="/members">Members</LinkButton>
          </li>
          <li className="">
            <LinkButton to="/contact">Contact Us</LinkButton>
          </li>
        </ul>
        <div className="selector" />
      </div>
      <AnimatePresence exitBeforeEnter initial={false}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/members" element={<MembersPage />} /> 
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </AnimatePresence>

    </>
  );
};

export default App;
