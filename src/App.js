import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "./style/style.css"
import HomePage from './HomePage/HomePage';
import particlesOptions from "./particles.json";



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

  return (
    <>
      <Particles id="tsparticles" options={particlesOptions} init={particlesInit} loaded={particlesLoaded} />
      <div className="login">
        <h1>Login</h1>
      </div>
      <div className="nav">
        <ul>
          <li className="selected">
            <a href="/">Home</a>
          </li>
          <li className="">
            <a href="/members">View Our Members</a>
          </li>
          <li className="">
            <a href="/contact">Contact Us</a>
          </li>
        </ul>
        <div className="selector" />
      </div>
      <HomePage />
    </>
  );
};

export default App;
