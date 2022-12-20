import './assets/NavBar.css';
import { useNavigate, useLocation } from "react-router-dom";

const NavBar = () => {
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<div className="navbar">
			<div className="nav-items">
				<div className="navlogo">
					<img src="" alt="" />
				</div>

				<div className="nav-links">
					<ul>
						<li>
							<img src="" alt="" />
							<p>Home</p>
						</li>
                        <li>
							<img src="" alt="" />
							<p>Members</p>
						</li>
                        <li>
							<img src="" alt="" />
							<p>Contact Us</p>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default NavBar;