import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import AdminNavbar from "./Components/AdminNavbar/AdminNavbar";


import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import axios from "axios";

import Main from "./Page/Main/Main";
import About from "./Page/About/About";
import LeaderShip from "./Page/LeaderShip/LeaderShip";
import Board from "./Page/Board/Board";
import BoardDetail from "./Page/Board/BoardDetail";
import Services from "./Page/Services/Services";
import Contact from "./Page/Contact/Contact";

import AdminLogin from "./Page/Admin/AdminLogin";
import AdminPosts from "./Page/Admin/AdminPosts";
import AdminCreatePost from "./Page/Admin/AdminCreatePost";
import AdminEditPost from "./Page/Admin/AdminEditPost";
import AdminContacts from "./Page/Admin/AdminContacts";
import { useState, useEffect } from "react";

function AuthRedirectRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post("/api/auth/verify-token", {}, { withCredentials: true });
        setIsAuthenticated(response.data.isValid);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("인증 토큰 검증 실패:", error);
        }
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

function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post("/api/auth/verify-token", {}, { withCredentials: true });
        setIsAuthenticated(response.data.isValid);
        setUser(response.data.user);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("인증 토큰 검증 실패:", error);
        }
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    verifyToken();
  }, []);

  if(isAuthenticated === null) {
    return <div>로딩 중...</div>;
  }
  
  return isAuthenticated ? <Outlet context={{ user }} /> : <Navigate to="/admin" replace />;
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
function AdminLayout() {
  return (
    <>
      <AdminNavbar />
      <Outlet />
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
        path: "board/:id",
        element: <BoardDetail />,
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
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
      {
        path: "posts",
        element: <AdminPosts />
      },
      {
        path: "create-post",
        element: <AdminCreatePost />
      },
      {
        path: "edit-post/:id",
        element: <AdminEditPost />
      },
      {
        path: "contacts",
        element: <AdminContacts />
      },
    ],
    }
  ]
}
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
