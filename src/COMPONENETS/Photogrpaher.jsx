import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getusername,
  getToken,
  getrefershtoken,
  saveToken,
  saverefershtoken,
} from "../UTILS/Local";
import { toast } from "react-toastify";

const Photogrpaher = () => {
  const location = useLocation();
  const [username, setusername] = useState();
  const [userinfo, setuserinfo] = useState({});
  const [Reviews, setreviews] = useState([]);
  const [works, setworks] = useState([]);
  const [work, setwork] = useState(false);
  const [nums, setnum] = useState();
  const [email, setemail] = useState("");
  const [date, setdate] = useState();
  const [famousplace, setfamousplace] = useState("");

  useEffect(() => {
    if (location.state) {
      setusername(location.state.username);
    }
  }, [location.state]);

  useEffect(() => {
    const getdata = async () => {
      try {
        const resp = await fetch(`http://localhost:8083/photoapi/getdata`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (resp.status === 401) {
          const suxxess = await refreshtoken();
          if (suxxess) {
            return getdata();
          } else {
            toast.error("Unable to refresh token.");
            navigate("/");
          }
        }
        const data = await resp.json();
        console.log(data);
        setuserinfo(data);
      } catch (e) {
        console.log("error in fetching photographer data in trying");
      }
    };
    getdata();
  }, []);

  useEffect(() => {
    const handlereviews = async () => {
      try {
        const resp = await fetch(
          `http://localhost:8083/photoapi/getfeedbacks`,
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
            return handlereviews();
          } else {
            toast.error("Unable to refresh token.");
            navigate("/");
          }
        }
        const data = await resp.json();
        setreviews(Array.isArray(data) ? data : [data]);
        console.log(data);
      } catch (e) {
        console.log("error in fetching reviews");
      }
    };
    handlereviews();
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
    if (userinfo.phonenumber) {
      setnum(userinfo.phonenumber);
      setemail(userinfo.email);
      setfamousplace(userinfo.famousplace);
    }
  }, [userinfo.phonenumber]);

  const handlework = async () => {
    if (userinfo.famousplace !== famousplace) {
      const proceed = window.confirm(
        "You are changing your working place. Do you want to proceed?"
      );
      if (!proceed) {
        return;
      }
    }
    if (!date) {
      alert("Please select a date");
      return;
    }
    try {
      const resp = await fetch(`http://localhost:8083/photoapi/addwork`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: date,
          phonenumber: nums,
          email: email,
          famousplace: famousplace,
        }),
      });
      if (resp.status === 401) {
        const suxxess = await refreshtoken();
        console.log(suxxess);
        if (suxxess) {
          return handlework();
        } else {
          toast.error("Unable to refresh token.");
          navigate("/");
        }
      }
      const data = await resp.text();
      toast.success(data);
      handledates();
    } catch (e) {
      console.log("ERROR IN ADDING WORK");
      console.log(e);
    }
  };

  const handledates = async () => {
    try {
      const resp = await fetch(`http://localhost:8083/photoapi/getwork`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (resp.status === 401) {
        const success = await refreshtoken();
        if (success) {
          return handledates();
        } else {
          toast.error("Unable to refresh token.");
          navigate("/");
          return;
        }
      }
      if (!resp.ok) {
        throw new Error(`Error: ${resp.status}`);
      }
      const data = await resp.json();
      console.log(data);
      setworks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error in fetching working:", e);
    }
  };

  useEffect(() => {
    handledates();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {username} 📸
          </h1>
          <p className="text-gray-600 text-md">
            Explore your photography profile and stats below.
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            👤 Profile Overview
          </h2>
          <div className="space-y-1 text-gray-700">
            <p>
              <strong>Name:</strong> {userinfo.name}
            </p>
            <p>
              <strong>Email:</strong> {userinfo.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {userinfo.phonenumber}
            </p>
            <p>
              <strong>Camera Type:</strong> {userinfo.camera_type}
            </p>
            <p>
              <strong>Cost:</strong> ₹{userinfo.cost}
            </p>
            <p>
              <strong>Country:</strong> {userinfo.country}
            </p>
            <p>
              <strong>State:</strong> {userinfo.state}
            </p>
            <p>
              <strong>District:</strong> {userinfo.district}
            </p>
            <p>
              <strong>Famous Place:</strong> {userinfo.famousplace}
            </p>
            <p>
              <strong>Working Status:</strong>{" "}
              {userinfo.is_working ? "Available ✅" : "Not Available ❌"}
            </p>
          </div>
        </div>

        {works.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {works.map((work, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <p className="text-sm text-gray-500 mb-1">
                  <strong className="text-gray-700">Date:</strong> {work.date}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <strong className="text-gray-700">Email:</strong> {work.email}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <strong className="text-gray-700">Phone:</strong>{" "}
                  {work.phonenumber}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <strong className="text-gray-700">Working Place:</strong>{" "}
                  {work.famousplace}
                </p>
                <p className="text-sm text-gray-500">
                  <strong className="text-gray-700">Photographer:</strong>{" "}
                  {work.photographer?.username || "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => {
            if (work) {
              setwork(false);
            } else {
              setwork(true);
            }
          }}
        >
          {work ? "close" : "ADD WORK"}
        </button>

        {work && (
          <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded shadow">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Set Working Place
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded p-2"
                onChange={(e) => setfamousplace(e.target.value)}
                placeholder="Enter Workin Place"
                value={famousplace}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Working Phone Number
              </label>
              <input
                type="tel"
                className="border border-gray-300 rounded p-2"
                onChange={(e) => setnum(e.target.value)}
                placeholder="Enter phone number"
                value={nums}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Set Working Email
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded p-2"
                onChange={(e) => setemail(e.target.value)}
                placeholder="Enter email"
                value={email}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                className="border border-gray-300 rounded p-2"
                onChange={(e) => setdate(e.target.value)}
                value={date}
                required
              />
            </div>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              onClick={() => handlework()}
            >
              Add Work
            </button>
          </div>
        )}

        {/* Work Section */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            📂 Your Work Portfolio
          </h2>
          <p className="text-gray-600 mb-4">
            Upload your shoots and let the world see your talent.
          </p>
          <div className="border border-dashed border-gray-400 p-4 text-center text-gray-500 rounded">
            (Work section will appear here soon...)
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-green-50 rounded-lg p-6 border border-green-100">
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            🌟 Client Reviews
          </h2>
          <p className="text-gray-600 mb-4">
            People’s thoughts and ratings about your work.
          </p>

          {Reviews.length === 0 ? (
            <div className="border border-dashed border-gray-400 p-4 text-center text-gray-500 rounded">
              (No reviews available yet...)
            </div>
          ) : (
            <div className="space-y-4">
              {Reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-gray-800 text-lg">
                      {review.posteduser || "Anonymous"}
                    </p>
                    <span className="text-xs text-gray-500 italic">
                      {new Date(review.dateTime).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {review.review}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gallery Section */}
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            🖼️ Your Gallery
          </h2>
          <p className="text-gray-600 mb-4">
            A visual portfolio of your favorite captures.
          </p>
          <div className="border border-dashed border-gray-400 p-4 text-center text-gray-500 rounded">
            (Photo gallery placeholder...)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Photogrpaher;
