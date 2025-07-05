import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const handlelogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("refreshtoken");
    window.location.href = "/";
  };
  return (
    <div>
      <button onClick={() => handlelogout()}>LOGOUT FUNCITONALITY</button>
    </div>
  );
};

export default Header;
