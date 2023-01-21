import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Callback({ setUserData }: any) {
  const navigate = useRef(useNavigate());

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get("session_creation_token") as string;
    fetch(API_URL + "/create_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        session_creation_token: session,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("session", data.session);
          setUserData(data.user);
          navigate.current("/");
        } else {
          alert("error");
        }
      });
  }, []);

  return null;
}

export default Callback;
