import { motion } from "framer-motion";
import "./assets/style.css";
import users from "./data.js";

export default function MembersPage({ enterAnimation, exitAnimation, animationVariants }) {
  return (
    <motion.div
      key="members"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div class="welcome">
        <h3>Our Members</h3>
      </div>

      <div className="contains-all-cards">

        {/*  map through the users array and return a div for each user */}
        {users.map((user) => (
          <div className="user-card">
            <div className="card-content">
              <div className="user-name">
                <div className="username-F">
                  {user.userNameF}
                </div>
                <div className="username-L">
                  {user.userNameL}
                </div>
              </div>
              <div className="connections">
                <div className="connection">
                  <div className="connection-icon">
                    <img src="https://www.svgrepo.com/show/331368/discord-v2.svg" width="25" height="25" alt="Discord logo"></img>
                  </div>
                  <div className="connection-id">
                    {user.discord}
                  </div>
                </div>
              </div>
              <div className="email">
                {user.email}
              </div>
            </div>
          </div>
        ))
        }
      </div>
    </motion.div>
  );
}
