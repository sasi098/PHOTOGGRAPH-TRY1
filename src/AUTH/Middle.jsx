import React, { useState, useEffect } from "react";
import { saveusername, saveToken, saverefershtoken } from "../UTILS/Local";
import { useNavigate } from "react-router-dom";

const Middle = () => {
  const [username, setname] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [wait, setwait] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchauth = async () => {
      try {
        const resp = await fetch(`http://localhost:8081/oauth/user-info`, {
          credentials: "include",
        });
        if (!resp.ok) {
          console.log("error in fetching auth ingo");
        }
        const data = await resp.json();
        console.log(data);
        setemail(data.email);
        if (data.exist === true) {
          saveusername(data.username);
          const tores = await fetch(
            `http://localhost:8081/token/tokengen/${data.username}`,
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
          navigate("/page1");
        } else {
          setwait(false);
        }
      } catch (err) {
        console.log("error in fetching thing " + err);
      }
    };
    fetchauth();
  }, []);

  const register = async (e) => {
    e.preventDefault();

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
          navigate("/tables");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center space-y-4">
        <p className="text-xl font-bold text-gray-800">👋 Hey, User</p>

        {wait ? (
          <div className="animate-pulse space-y-2">
            <p className="text-lg font-medium text-blue-600">
              ⏳ Please wait for a minute...
            </p>
            <p className="text-sm text-gray-600">
              Your login process is in progress
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-left">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Enter Username
              </label>
              <input
                type="text"
                onChange={(e) => setname(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="text-left">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Enter Password
              </label>
              <input
                type="password"
                onChange={(e) => setpassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              onClick={(e) => register(e)}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Create Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Middle;
