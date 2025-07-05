import React, { useEffect, useState } from "react";
import "../AUTH/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { saverefershtoken, saveToken, saveusername } from "../UTILS/Local";

const LoginPage = () => {
  const [username, setname] = useState("");
  const [password, setpassword] = useState("");
  const [provider, setprovider] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!provider) {
      return;
    }
    const fetchprovode = async () => {
      try {
        const resp = await fetch(`http://localhost:8081/oauth/authlogin`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!resp.ok) {
          throw new Error("Error in fetching the auth username");
        }
        const data = await resp.text();
        console.log(data);
        saveusername(data);
        const tores = await fetch(
          `http://localhost:8081/token/tokengen/${data}`,
          {
            credentials: "include",
            // method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // body: JSON.stringify({ username }),
          }
        );
        if (!tores.ok) {
          throw new Error("Token generation failed");
        }
        const todata = await tores.json();
        console.log("Token generated:", todata);
        saveToken(todata.token);
        saverefershtoken(todata.refreshtoken);
      } catch (e) {
        console.log("ERROR IN CREATION OF TOKEN");
        console.log("Error in Fetching username og gooogle auth");
        toast.error("Token creation failed.");
      } finally {
        setprovider(false);
      }
    };
    fetchprovode();
  }, [provider]);

  const login = async (e) => {
    e.preventDefault();

    const data = {
      username,
      password,
    };
    try {
      const resp = await fetch(`http://localhost:8081/oauth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          project: "trying jwt",
        }),
      });

      if (!resp.ok) {
        throw new Error("Error In Fetching Login Details");
      }
      const res = await resp.json();
      console.log(res);
      if (res.auth == false) {
        toast.error("Try to Login with google or github");
      } else if (res.password == false) {
        toast.error("Check Your Password");
      } else if (res.username == false) {
        toast.error("Usernmae not exist");
      } else {
        saveToken(res.token);
        saverefershtoken(res.refreshtoken);
        saveusername(username);
        navigate("/page1");
      }
    } catch (e) {
      console.log("error in login page");
      toast.error("Login failed.");
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
            <input type="text" placeholder="Name" />
            {/* <input type="email" placeholder="Email" /> */}
            <input type="password" placeholder="Password" />
            <button>Sign Up</button>
          </form>
        </div>

        <div className="form-container sign-in">
          <form>
            <h1>Sign In</h1>
            <div className="social-icons">
              <a
                href="http://localhost:8081/oauth2/authorization/google"
                onClick={() => setprovider(true)}
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
                onClick={() => setprovider(true)}
              >
                <i className="fa-brands fa-github"></i>
              </a>
              {/* <a href="#" className="icon">
              <i className="fa-brands fa-linkedin-in"></i>
            </a> */}
            </div>
            <span>or use your email password</span>
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
            <button onClick={(e) => login(e)}>Sign In</button>

            <Link to="/register">
              <button>Register (OR) Sign Up</button>
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

export default LoginPage;
