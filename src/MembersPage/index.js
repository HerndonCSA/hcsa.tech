import { motion } from "framer-motion";

export default function MembersPage({ enterAnimation, exitAnimation, animationVariants }) {
  return (
    <motion.div className="container"
      key="members"
      variants={animationVariants}
      initial={animationVariants[enterAnimation]}
      animate="visible"
      exit={animationVariants[exitAnimation]}
      transition={{ duration: 0.25 }}
    >
      <div className="members">
        <h1>Members</h1>
      </div>

      <div className="user-card">
        <div className="card-content">

          {/* user name area */}
          <div className="user-name">
            <div className="username-F">
              Sudarshan
            </div>
            <div className="username-L">
              Lamichhane
            </div>
          </div>

          {/* connections area */}
          <div className="connections">
            <div className="connection">
              <div className="connection-icon">
                <img src="https://www.svgrepo.com/show/331368/discord-v2.svg" width="25" height="25" alt="Discord logo"></img>
              </div>
              <div className="connection-id">
                soos#6008
              </div>
            </div>
          </div>

          {/* email area */}
          <div className="email">
            soos@hcsa.tech
          </div>

        </div>
      </div>

    </motion.div>
  );
}