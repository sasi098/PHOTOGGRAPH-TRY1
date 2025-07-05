import React, { useState } from "react";
import {
  FaCameraRetro,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaMoneyBillAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import {
  getusername,
  getToken,
  saverefershtoken,
  getrefershtoken,
  saveToken,
} from "../UTILS/Local";
import { toast } from "react-toastify";

const Photographers = () => {
  const [place, setplace] = useState("");
  const [photographers, setphotographers] = useState([]);
  const [sending, setsending] = useState(false);
  const [date, setdate] = useState("");

  const getphotographers = async () => {
    try {
      const resp = await fetch(`http://localhost:8083/photoapi/photographers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          famousplace: place,
          date: date,
        }),
      });
      if (resp.status === 401) {
        const suxxess = await refreshtoken();
        console.log(suxxess);
        if (suxxess) {
          return getphotographers();
        } else {
          toast.error("Unable to refresh token.");
          navigate("/");
        }
      }
      const data = await resp.json();
      setphotographers(data);
      console.log(data);
    } catch (error) {
      toast.error("Error fetching photographers");
      console.log(error);
    }
  };

  const handlebooking = async (username) => {
    try {
      setsending(true);
      const resp = await fetch(
        `http://localhost:8083/photoapi/book/${username}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (resp.status === 401) {
        const suxxess = await refreshtoken();
        console.log(suxxess);
        if (suxxess) {
          return handlebooking(username);
        } else {
          toast.error("Unable to refresh token.");
          navigate("/");
        }
      }
      const data = await resp.text();
      if (!resp.ok) throw new Error(data);
      toast.success(data);
    } catch (e) {
      toast.error("Booking failed. Try again later.");
    } finally {
      setsending(false);
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
    <div className="min-h-screen bg-gradient-to-br from-[#fefce8] to-[#ecfdf5] p-6 md:p-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-extrabold text-emerald-600 mb-2">
          📸 Discover Local Photographers
        </h1>
        <p className="text-gray-600 text-lg">
          Find talented photographers in your area and book them in seconds.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-12">
        <input
          type="text"
          placeholder="Enter location (e.g., Araku Valley)"
          value={place}
          onChange={(e) => setplace(e.target.value)}
          className="w-full px-5 py-3 rounded-2xl shadow-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setdate(e.target.value)}
          className="w-full md:w-auto px-5 py-3 rounded-2xl shadow-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        />

        <button
          onClick={getphotographers}
          className="w-full md:w-auto bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-md hover:bg-emerald-600 transition duration-200"
        >
          🔍 Search
        </button>
      </div>

      {/* Sending Booking */}
      {sending && (
        <div className="text-center mb-6">
          <p className="text-emerald-600 font-semibold">
            Sending booking request...
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {photographers.map((item, index) => (
          <div
            key={index}
            className="bg-[#f9fafb] p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-200 border border-emerald-100"
          >
            <h2 className="text-xl font-bold text-emerald-700 mb-1">
              {item.photographer.name}
            </h2>
            <p className="text-gray-500 text-sm mb-3">
              @{item.photographer.username}
            </p>

            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-emerald-400" />{" "}
                {item.photographer.district}, {item.photographer.state}
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-emerald-400" />{" "}
                {item.photographer.email}
              </p>
              <p className="flex items-center gap-2">
                <FaPhoneAlt className="text-emerald-400" />{" "}
                {item.photographer.phonenumber}
              </p>
              <p className="flex items-center gap-2">
                <FaCameraRetro className="text-emerald-400" />{" "}
                {item.photographer.camera_type}
              </p>
              <p className="flex items-center gap-2">
                <FaMoneyBillAlt className="text-emerald-400" /> ₹
                {item.photographer.cost}
              </p>
              <p className="flex items-center gap-2">
                {item.photographer.is_working ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaTimesCircle className="text-red-400" />
                )}
                {item.photographer.is_working
                  ? "Available Now"
                  : "Currently Unavailable"}
              </p>
              <p className="mt-2 italic text-emerald-500">
                🌟 Famous for: {item.photographer.famousplace}
              </p>
              <p className="mt-2 text-xs text-gray-400">📅 Date: {item.date}</p>
            </div>

            <button
              onClick={() => handlebooking(item.photographer.username)}
              className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl font-semibold shadow transition"
            >
              📩 Book Now
            </button>
          </div>
        ))}

        {photographers.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No photographers found. Try a different location.
          </p>
        )}
      </div>
    </div>
  );
};

export default Photographers;
