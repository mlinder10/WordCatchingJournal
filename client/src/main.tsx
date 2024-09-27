import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/login/page";
import Register from "./pages/auth/register/page";
import Feed from "./pages/feed/page.tsx";
import Create from "./pages/create/page";
import Profile from "./pages/profile/page";
import AuthProvider, { ProtectedRoute } from "./contexts/AuthProvider.tsx";
import Navbar from "./components/navbar/navbar.tsx";
import Search from "./pages/search/page.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <div className="page nav-page">
          <Navbar />
          <Feed />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/create",
    element: (
      <ProtectedRoute>
        <div className="page nav-page">
          <Navbar />
          <Create />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/search",
    element: (
      <ProtectedRoute>
        <div className="page nav-page">
          <Navbar />
          <Search />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <ProtectedRoute>
        <div className="page nav-page">
          <Navbar />
          <Profile />
        </div>
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);