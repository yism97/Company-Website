import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import axios from "axios";

import Main from "./Page/Main/Main";
import About from "./Page/About/About";
import LeaderShip from "./Page/LeaderShip/LeaderShip";
import Board from "./Page/Board/Board";
import Services from "./Page/Services/Services";
import Contact from "./Page/Contact/Contact";

import AdminLogin from "./Page/Admin/AdminLogin";
import AdminPosts from "./Page/Admin/AdminPosts";
import { useState, useEffect } from "react";

function AuthRedirectRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // TODO: 인증 토큰 검증 로직 추가
        const response = await axios.post("/api/auth/verify-token", {}, { withCredentials: true });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("인증 토큰 검증 실패:", error);
        setIsAuthenticated(false);
      }
    };
    verifyToken();
  }, []);

  if(isAuthenticated === null) {
    return <div>로딩 중...</div>;
  }
  
  return isAuthenticated ? <Navigate to="/admin/posts" replace /> : <Outlet />;
}

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "leadership",
        element: <LeaderShip />,
      },
      {
        path: "board",
        element: <Board />,
      },
      {
        path: "our-services",
        element: <Services />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AuthRedirectRoute />,
    children: [{ index: true, element: <AdminLogin /> }]
  },
  {
    path: "/admin/posts",
    element: <AdminPosts />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
