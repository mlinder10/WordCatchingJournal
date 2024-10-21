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
import RequestReset from "./pages/auth/request-reset/page";
import ResetPassword from "./pages/auth/reset-password/page";
import Likes from "./pages/likes/page.tsx";
import Favorites from "./pages/favorites/page.tsx";
import EditProfile from "./pages/profile/edit-profile.tsx";

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
    path: "/request-reset",
    element: <RequestReset />,
  },
  {
    path: "/reset-password/:userId",
    element: <ResetPassword />,
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
  {
    path: "/edit-profile",
    element: (
      <ProtectedRoute>
        <div className="page nav-page">
          <Navbar />
          <EditProfile />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/likes",
    element: (
      <ProtectedRoute>
        <div className="page nav-page">
          <Navbar />
          <Likes />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/favorites",
    element: (
      <ProtectedRoute>
        <div className="page nav-page">
          <Navbar />
          <Favorites />
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
