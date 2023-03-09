import { motion } from "framer-motion";
import "./assets/MembersPage.scss";
import GithubIcon from "./assets/github.svg";
import users from "./data.js";

const MembersPage = () => {
  return (
    <motion.div
      className="members-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="members-page-title">Members</div>
      
      <div className="contains-all-cards">
        {/*  map through the users array and return a div for each user */}

        {users.map((user) => (
          <div className="user-card" key={user.userNameF}>
            <div className="card-content">
              <div className="user-name">
                <div className="username-F">{user.userNameF}</div>
                <div className="username-L">{user.userNameL}</div>
              </div>
              <div className="connections">
                <div className="connection">
                  <div className="connection-icon">
                    <img
                      src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/6266bc493fb42d4e27bb8393_847541504914fd33810e70a0ea73177e.ico"
                      width="25"
                      height="25"
                      alt="Discord logo"
                    />
                  </div>
                  <div className="connection-id">{user.discord}</div>
                </div>
                <div className="connection">
                  <div className="connection-icon">
                    <img src={GithubIcon} alt="GitHub logo" />
                  </div>
                  <div className="connection-id">{user.github}</div>
                </div>
              </div>
              <div className="email">{user.email}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MembersPage;
