import React, { useEffect, useState } from "react";
import {
  getusername,
  getToken,
  getrefershtoken,
  saveToken,
  saverefershtoken,
} from "../UTILS/Local";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Page1 = () => {
  const [username, setusername] = useState();
  const [photographer, setphotohrapher] = useState(false);
  const [bookings, setbookings] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setusername(location.state.username);
    }
  }, [location.state]);

  useEffect(() => {
    const getdata = async () => {
      try {
        const resp = await fetch(`http://localhost:8083/photoapi/userdata`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (resp.status === 401) {
          const suxxess = await refreshtoken();
          console.log(suxxess);
          if (suxxess) {
            return getdata();
          } else {
            toast.error("Unable to refresh token.");
            navigate("/");
          }
        }

        const data = await resp.json();
        console.log(data);
        setphotohrapher(data.photographer);
      } catch (e) {
        console.log(e);
        console.log("error in fetching specific user data");
      }
    };
    getdata();
  }, []);

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

  useEffect(() => {
    const getbookings = async () => {
      try {
        const resp = await fetch(
          `http://localhost:8083/photoapi/userbook/${username}`
        );
        if (!resp.ok) {
          console.log("error in fetching user bookings");
        }
        const data = await resp.json();
        console.log(data);
        setbookings(data);
      } catch (e) {
        console.log("error in fetching user bookings");
      }
    };
    getbookings();
  }, []);

  return (
    <div className="bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 min-h-screen text-gray-800 font-sans">
      {/* Hero Section */}
      <div className="text-center py-20 px-6 bg-gradient-to-r from-rose-200 to-orange-100 rounded-b-[3rem] shadow-md">
        <h1 className="text-5xl font-extrabold text-purple-700 mb-4">
          Capture Beautiful Moments 🌸
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
          Welcome {username}! 📸 Book talented local photographers in seconds.
          Turn every trip or occasion into a lifelong memory.
        </p>
        <button
          onClick={() => navigate("/photographers")}
          className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-white font-bold px-8 py-3 rounded-full shadow hover:scale-105 transition"
        >
          Start Finding Now
        </button>
        <button
          onClick={() => navigate("/myorders")}
          className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-white font-bold px-8 py-3 rounded-full shadow hover:scale-105 transition"
        >
          My Orders
        </button>
      </div>

      {/* Key Features */}
      <div className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold text-purple-700 mb-4">
            ✨ Key Features
          </h2>
          <ul className="space-y-4 text-lg text-gray-700 list-disc list-inside">
            <li>
              <strong>Verified Experts:</strong> Skilled, trusted photographers
              near you.
            </li>
            <li>
              <strong>Instant Location Booking:</strong> Search by city or
              region easily.
            </li>
            <li>
              <strong>Affordable Packages:</strong> Get quality without high
              prices.
            </li>
            <li>
              <strong>Instant Confirmation:</strong> No waiting, just book and
              go.
            </li>
            <li>
              <strong>High-Quality Results:</strong> Professionally captured
              memories.
            </li>
          </ul>
        </div>
        <img
          src="https://images.unsplash.com/photo-1597466765990-64ad1c35dafc"
          alt="Photographer"
          className="rounded-3xl shadow-xl w-full h-80 object-cover"
        />
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-yellow-100 via-teal-100 to-lime-100 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 text-center gap-6">
          <div className="bg-white rounded-xl py-6 shadow hover:shadow-lg transition">
            <p className="text-4xl font-extrabold text-pink-500">250+</p>
            <p className="text-gray-600 mt-2">Photographers Available</p>
          </div>
          <div className="bg-white rounded-xl py-6 shadow hover:shadow-lg transition">
            <p className="text-4xl font-extrabold text-blue-500">180+</p>
            <p className="text-gray-600 mt-2">Cities Covered</p>
          </div>
          <div className="bg-white rounded-xl py-6 shadow hover:shadow-lg transition">
            <p className="text-4xl font-extrabold text-purple-500">4.9/5</p>
            <p className="text-gray-600 mt-2">User Ratings</p>
          </div>
        </div>
      </div>

      {/* User Testimonials */}
      <div className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-10">
          ❤️ What Users Are Saying
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <p className="italic text-gray-700">
              “I used this app in Jaipur. The photographer was punctual and
              clicked amazing shots at Hawa Mahal!”
            </p>
            <p className="mt-4 font-semibold text-purple-600">
              — Aditi Verma, Solo Traveler
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <p className="italic text-gray-700">
              “As a freelancer, I get clients from nearby cities thanks to this
              app. Very helpful!”
            </p>
            <p className="mt-4 font-semibold text-purple-600">
              — Nikhil Rao, Photographer
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <p className="italic text-gray-700">
              “Hired a photographer for my birthday. Great photos and such a
              smooth booking process.”
            </p>
            <p className="mt-4 font-semibold text-purple-600">
              — Simran Kaur, Student
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-14 bg-gradient-to-r from-pink-200 via-yellow-100 to-purple-200 rounded-t-[3rem] shadow-inner">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Are you a Photographer? 📷
        </h3>
        <p className="text-gray-700 mb-6">
          Join our growing community and start earning by capturing memories.
        </p>
        {photographer ? (
          <div>
            {/* <p>Hey Photographer . Do you want to Know About Your work </p> */}
            <button
              onClick={() =>
                navigate("/photographer", { state: { username: username } })
              }
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-full transition shadow"
            >
              Hey Photographer
            </button>
            <button
              onClick={() =>
                navigate("/requests", { state: { username: username } })
              }
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-full transition shadow"
            >
              Hey Photographer Check your Requests
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={() => navigate("/registergrpaher")}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-full transition shadow"
            >
              Register as Photographer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page1;
