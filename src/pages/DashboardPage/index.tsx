import './assets/DashboardPage.scss';

import LogoutIcon from './assets/logout.svg';

import ResetIcon from './assets/reset.svg';

import PrivateIcon from './assets/private.svg';
import PublicIcon from './assets/public.svg';
import InvisibleIcon from './assets/invisible.svg';

import DiscordIcon from './assets/discord.svg';
import GithubIcon from './assets/github.svg';
import FigmaIcon from './assets/figma.svg';

import { useState } from 'react';

const DashboardPage = () => {
	const [selected, setSelected] = useState('public');

	return (
		<>
			<div className="navbar">
				<h1>Dashboard</h1>
				<button>Logout</button>
			</div>
			<div className="content">
				<div className="profile-editor">
					<div className="profile-picture-container">
						<img
							src="https://via.placeholder.com/150"
							alt="Profile"
						/>
						<button>
							<img src={ResetIcon} alt="Reset" />
							Reset Profile Picture
						</button>
					</div>
				</div>
				<div className="profile-settings">
					<div className="profile-visibility">
						<div className="options">
							<div
								className={
									selected === 'public'
										? 'public selected'
										: 'public'
								}
								onClick={() => setSelected('public')}
							>
								<img src={PublicIcon} alt="?" />
								<p>Public</p>
							</div>
							<div
								className={
									selected === 'private'
										? 'private selected'
										: 'private'
								}
								onClick={() => setSelected('private')}
							>
								<img src={PrivateIcon} alt="?" />
								<p>Private</p>
							</div>
							<div
								className={
									selected === 'invisible'
										? 'invisible selected'
										: 'invisible'
								}
								onClick={() => setSelected('invisible')}
							>
								<img src={InvisibleIcon} alt="?" />
								<p>Invisible</p>
							</div>
						</div>
					</div>
					<div className="profile-link"></div>
					<div className="about"></div>
				</div>
			</div>
			<div className="external-accounts">
				<div className="header">
					<h1>External Accounts</h1>
					<hr />
					<p>
						Please use a unified email for all of the following. It
						will be shared with us as you login.
					</p>
					<p>Do not use your school email for anything.</p>
				</div>
				<div className="accounts">
					<div className="discord">
						<img src={DiscordIcon} alt="Discord" />
					</div>
					<div className="github"></div>
					<div className="other">
						<div className="figma"></div>
						<div className="email"></div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DashboardPage;
