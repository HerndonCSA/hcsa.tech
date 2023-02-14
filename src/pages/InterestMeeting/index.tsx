import "./assets/style.scss";

const InterstMeeting = () => {
    return (
        <div className="interest-meeting">
            <div className="logo">
                <h1>HERNDON</h1>
                <h2>COMPUTER SCIENCE ASSOCIATION</h2>
            </div>


            <hr />
            <div className="header">
                <h3>INTEREST MEETING</h3>
            </div>
            <div className="meeting-time">
                <div className="date">MARCH 1<sup>ST</sup></div>
                <div className="time">3PM-4PM</div>
            </div>
            <div className="verify-button">

                {/* Set button onClick to open link " api.hcsa.tech/login?continue=interest-meeting" */}
                <button onClick={() => window.open("https://api.hcsa.tech/login?continue=interest-meeting", "_blank")}>Login with Google</button>


            </div>

            <div className="footnote">
                If you are interested in joining us for the meeting, click the button above to verify that you are in Herndon High School. You will need to use an @fcpsschools.net email.
            </div>
        </div>
    );
};

export default InterstMeeting;
