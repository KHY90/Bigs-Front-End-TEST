import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Main from "../pages/Board";
import PostPage from "../pages/PostPage";
import DetailPage from "../pages/DetailPage";
import EditPage from "../pages/EditPage";
import ProfilePage from "../pages/Profile";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/main" element={<Main />} />
      <Route path="/write" element={<PostPage />} />
      <Route path="/detail/:id" element={<DetailPage />} /> 
      <Route path="/edit/:id" element={<EditPage />} /> 
      <Route path="/profile" element={<ProfilePage />} /> 
      <Route path="*" element={<Navigate to="/signin" />} />
    </Routes>
  );
};

export default AppRoutes;
