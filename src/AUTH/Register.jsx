import React, { useEffect, useState } from "react";
import "../AUTH/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { saverefershtoken, saveToken, saveusername } from "../UTILS/Local";

const Register = () => {
  const [username, setname] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [output, setoutput] = useState([]);

  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    // console.log(username);
    // console.log(email);
    // console.log(password);

    const data = {
      username,
      email,
      password,
    };

    try {
      const resp = await fetch(`http://localhost:8081/oauth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          project: "trying jwt",
        }),
      });

      if (!resp.ok) {
        throw new Error("Error In Fetching Regiter Data");
      }

      const res = await resp.json();
      console.log(res);
      if (res.exist == false) {
        try {
          const res = await fetch(
            `http://localhost:8081/token/tokengen/${username}`,
            {
              credentials: "include",
              // method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              // body: JSON.stringify({ username }),
            }
          );
          if (!res.ok) {
            throw new Error("Error in creation of login suring registraion");
          }
          const data = await res.json();
          console.log("Token generated:", data);
          saveToken(data.token);
          saveusername(username);
          saverefershtoken(data.refreshtoken);
          navigate("/page1");
        } catch (e) {
          console.log("Error in fething token while reg");
        }
      } else {
        toast.error("Mail Already Exist");
      }
    } catch (e) {
      console.log("error in register trying");
    }
  };
  return (
    <div className="container-1">
      <div className="container" id="container">
        <div className="form-container sign-up">
          <form>
            <h1>Create Account</h1>
            <div className="social-icons">
              <a href="#" className="icon">
                <i className="fa-brands fa-google-plus-g"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setemail(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setname(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
            <button>Sign Up</button>
          </form>
        </div>

        <div className="form-container sign-in">
          <form>
            <h1>Register</h1>
            <div className="social-icons">
              <a
                href="http://localhost:8081/oauth2/authorization/google"
                className="icon"
              >
                <i className="fa-brands fa-google-plus-g"></i>
              </a>
              {/* <a href="#" className="icon">
              <i className="fa-brands fa-facebook-f"></i>
            </a> */}
              <a
                href="http://localhost:8081/oauth2/authorization/github"
                className="icon"
              >
                <i className="fa-brands fa-github"></i>
              </a>
              {/* <a href="#" className="icon">
              <i className="fa-brands fa-linkedin-in"></i>
            </a> */}
            </div>
            <span>or use your email password</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setemail(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setname(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
            <a href="#">Forget Your Password?</a>
            <button onClick={(e) => register(e)}>Register</button>
            <Link to="/">
              <button>Have An Account (or) Sign In</button>
            </Link>
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button className="hidden" id="login">
                Sign In
              </button>
              <button className="hidden" id="login">
                Register (OR) Sign Up
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Welcome, Friend!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button className="hidden" id="register">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
