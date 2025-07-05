// import { useState } from "react";
// import LoginPage from "./AUTH/LoginPage";
// import Register from "./AUTH/Register";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import Connection from "./COMPONENETS/Connection";
// import Page1 from "./COMPONENETS/Page1";
// import Registerphotographer from "./COMPONENETS/Registerphotographer";
// import Photogrpaher from "./COMPONENETS/Photogrpaher";
// import Photographers from "./COMPONENETS/Photographers";
// import Requests from "./COMPONENETS/Requests";
// import Myorders from "./COMPONENETS/Myorders";
// import { ChatPage2 } from "./COMPONENETS/ChatPage2";
// import Header from "./COMPONENETS/Header";
// import Middle from "./AUTH/Middle";
// import Landing from "./COMPONENETS/Landing";
// import Navbar from "./COMPONENETS/Navbar";
// import Footer from "./COMPONENETS/Footer";
// function App() {
//   return (
//     <>
//       <ToastContainer />
//       <BrowserRouter>
//         <Navbar />
//         <Routes>
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/" element={<Landing />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/connection" element={<Connection />} />
//           <Route path="/page1" element={<Page1 />} />
//           <Route path="/registergrpaher" element={<Registerphotographer />} />
//           <Route path="/photographer" element={<Photogrpaher />} />
//           <Route path="/photographers" element={<Photographers />} />
//           <Route path="/requests" element={<Requests />} />
//           <Route path="/myorders" element={<Myorders />} />
//           <Route path="/chat" element={<ChatPage2 />} />
//           <Route path="/middle" element={<Middle />} />
//         </Routes>
//         <Footer />
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;

import { useState } from "react";
import LoginPage from "./AUTH/LoginPage";
import Register from "./AUTH/Register";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Connection from "./COMPONENETS/Connection";
import Page1 from "./COMPONENETS/Page1";
import Registerphotographer from "./COMPONENETS/Registerphotographer";
import Photogrpaher from "./COMPONENETS/Photogrpaher";
import Photographers from "./COMPONENETS/Photographers";
import Requests from "./COMPONENETS/Requests";
import Myorders from "./COMPONENETS/Myorders";
import { ChatPage2 } from "./COMPONENETS/ChatPage2";
import Navbar from "./COMPONENETS/Navbar";
import Middle from "./AUTH/Middle";
import Landing from "./COMPONENETS/Landing";

function App() {
  const PublicRoute = ({ element }) => {
    return localStorage.getItem("username") ? (
      <Navigate to="/page1" replace />
    ) : (
      element
    );
  };

  const ProtectedRoute = ({ element }) => {
    return localStorage.getItem("username") ? (
      element
    ) : (
      <Navigate to="/login" replace />
    );
  };

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute element={<Landing />} />} />
          <Route
            path="/login"
            element={<PublicRoute element={<LoginPage />} />}
          />
          <Route
            path="/register"
            element={<PublicRoute element={<Register />} />}
          />

          {/* Protected Routes */}
          <Route
            path="/connection"
            element={<ProtectedRoute element={<Connection />} />}
          />
          <Route
            path="/page1"
            element={<ProtectedRoute element={<Page1 />} />}
          />
          <Route
            path="/registergrpaher"
            element={<ProtectedRoute element={<Registerphotographer />} />}
          />
          <Route
            path="/photographer"
            element={<ProtectedRoute element={<Photogrpaher />} />}
          />
          <Route
            path="/photographers"
            element={<ProtectedRoute element={<Photographers />} />}
          />
          <Route
            path="/requests"
            element={<ProtectedRoute element={<Requests />} />}
          />
          <Route
            path="/myorders"
            element={<ProtectedRoute element={<Myorders />} />}
          />
          <Route
            path="/chat"
            element={<ProtectedRoute element={<ChatPage2 />} />}
          />
          <Route
            path="/middle"
            element={<ProtectedRoute element={<Middle />} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
