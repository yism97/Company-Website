import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import Main from "./Page/Main/Main";
import About from "./Page/About/About";
import LeaderShip from "./Page/LeaderShip/LeaderShip";
import Board from "./Page/Board/Board";
import Services from "./Page/Services/Services";
import Contact from "./Page/Contact/Contact";

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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
