import React from "react";

const Connection = () => {
  const handledetails = async () => {
    try {
      const resp = await fetch(`http://localhost:8083/photoapi/hi`);
      if (!resp.ok) {
        consolo.log("error in backend fetching");
      }
      const data = await resp.json();
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <button
        onClick={() => {
          handledetails();
        }}
      >
        CLICK HERE TO GET USER DEATAILS
      </button>
    </div>
  );
};

export default Connection;
