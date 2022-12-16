import { useCallback, useState, useEffect, lazy } from "react";
import "./assets/styles/style.css"
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
const HomePage = lazy(() => import("./HomePage"));
const MembersPage = lazy(() => import("./MembersPage"));
const ContactPage = lazy(() => import("./ContactPage"));
const LoginModal = lazy(() => import("./LoginModal"));

const App = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const navLinkClick = (e) => {
    e.preventDefault();
    navigate(e.target.href);
  }

  const [loginShown, setLoginShown] = useState(false);


  const selectorStyles = {
    "/": {
      marginRight: "32.8501em",
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
      <LoginModal loginShown={loginShown} setLoginShown={setLoginShown} key="hi"/>
      <div className="login" onClick={() => setLoginShown(true)}>
        <h1>Login</h1>
      </div>
      <div className="nav">
        <ul>
          {/* Use a ternary operator to add the selected class if location.pathname is the current path*/}
          <li className={location.pathname === "/" ? "" : "unselected"}
            onClick={() => navigate("/")}>
            <button>Home</button>
          </li>
          <li className={location.pathname === "/members" ? "" : "unselected"}
            onClick={() => navigate("/members")}>
            <button to="/members">Members</button>
          </li>
          <li className={location.pathname === "/contact" ? "" : "unselected"}
            onClick={() => navigate("/contact")}
          >
            <button to="/contact">Contact Us</button>
          </li>
        </ul>
        <motion.div className="selector" style={selectorStyles[location.pathname]} animate={{ ...selectorStyles[location.pathname] }} transition={{ duration: 0.5, type: "spring", stiffness: 60, damping: 15 }} initial={false} />

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
