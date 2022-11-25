export default function HomePage() {
  return (
    <>
    <div className="main">
      <div className="login">
        <h1>Login</h1>
      </div>
      <div className="nav">
        <ul className="items">
          <li className="home">
            <a href="/">Home</a>
          </li>
          <li className="members">
            <a href="/members">View Our Members</a>
          </li>
          <li className="contact">
            <a href="/contact">Contact Us</a>
          </li>
        </ul>
        <div className="selector"/>
      </div>
      <div className="welcome">
        <h1 className="name_top">We are the <span>Herndon</span></h1>
        <div name="flex">
          <h1 className="name_bottom">Computer Science Association</h1>
          <p className="shortcut">Just call us the "HCSA"</p>
        </div>
        <h3 className="info">A place for students to explore the countless fields of computer science.</h3>
      </div>
      <div className="content">
        <div className="join_and_view">
          <img src="/" alt="waves" />
          <button className="view">View what we're working on</button>
          <div className="or">
            <div className="line"/>
            <div className="text">or</div>
            <div className="line"/>
          </div>
          <button className="join">Join us</button>
        </div>
      </div>
    </div>
    </>
  );
}