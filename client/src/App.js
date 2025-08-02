import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenu from "./components/MainMenu";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPass from './components/ForgotPass';
import JoinQueue from './components/JoinQueue';
import StartQueue from './components/StartQueue';
import Chat from './components/Chat';
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainMenu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotPass" element={<ForgotPass />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/joinQueue" element={<JoinQueue />} />
          <Route path="/startQueue" element={<StartQueue />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
