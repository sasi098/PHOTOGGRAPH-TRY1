import React, { useState } from "react";
import {
  getusername,
  getToken,
  saverefershtoken,
  getrefershtoken,
  saveToken,
} from "../UTILS/Local";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Registerphotographer = () => {
  const [country, setcountry] = useState("india");
  const [state, setstate] = useState("");
  const [district, setdistrict] = useState("");
  const [famous_place, setfamous_place] = useState("");
  const [camera_type, setcamera_type] = useState("");
  const [name, setname] = useState("");
  const [cost, setcost] = useState("");
  const [num, setnum] = useState("");
  const navigate = useNavigate("");

  const handleregsiter = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(`http://localhost:8083/photoapi/reg`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          //   username: username,
          name: name,
          //   email: "",
          country: country,
          state: state,
          district: district,
          famousplace: famous_place,
          camera_type: camera_type,
          cost: cost,
          phonenumber: num,
        }),
      });
      if (resp.status === 401) {
        const suxxess = await refreshtoken();
        console.log(suxxess);
        if (suxxess) {
          return handleregsiter();
        } else {
          toast.error("Unable to refresh token.");
          navigate("/");
        }
      }
      if (!resp.ok) {
        console.log("error in registering photographer");
      }
      console.log(resp);
      const data = await resp.json();
      console.log(data);
      if (data.existed === true) {
        toast.error(`Account is alresy created with name ${name}`);
      } else if (data.created === true) {
        toast.success(`you have created your Account with name ${name}`);
      } else if (data.created === false && data.existed === false) {
        toast.error(`account already exts with this account`);
      }
    } catch (e) {
      console.log(e);
      console.log("error in connecting to backend in register photographer");
    }
  };

  const refreshtoken = async () => {
    try {
      const resp = await fetch(`http://localhost:8081/token/refresh`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          refreshtoken: getrefershtoken(),
        }),
      });
      if (resp.status === 200) {
        const data = await resp.json();
        saveToken(data.token);
        saverefershtoken(data.refreshtoken);
        toast.success("Hey You goe nwe session token");
        return true;
      }
    } catch (e) {
      console.log("error in getting refresh token");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-pink-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">
          📸 Register as a Photographer
        </h2>

        <form className="space-y-5" onSubmit={handleregsiter}>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Working Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setname(e.target.value)}
              placeholder="Enter your working name"
              className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={num}
              onChange={(e) => setnum(e.target.value)}
              // placeholder="+91"
              className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setcountry(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setstate(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-300"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                District
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setdistrict(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Famous Place (Your Area)
            </label>
            <input
              type="text"
              value={famous_place}
              onChange={(e) => setfamous_place(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Camera Type
            </label>
            <input
              type="text"
              value={camera_type}
              onChange={(e) => setcamera_type(e.target.value)}
              placeholder="Example: Canon EOS 5D"
              className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Approximate Cost (₹)
            </label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setcost(e.target.value)}
              placeholder="Enter your service cost"
              className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-200"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg shadow-md hover:scale-105 transition"
          >
            REGISTER NOW
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(`/page1`)}
            className="text-blue-600 hover:underline font-medium"
          >
            ← Go Back to Search Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registerphotographer;
