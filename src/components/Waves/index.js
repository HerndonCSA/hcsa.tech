import "./assets/Waves.css";

const Waves = ({high}) => {
    // Ternary operator syntax: condition ? true : false
    // Ternary turns className to "waves high" if high is true
    return(
        <div className={"waves " + (high ? "high" : "")}></div>
    )
}

export default Waves;