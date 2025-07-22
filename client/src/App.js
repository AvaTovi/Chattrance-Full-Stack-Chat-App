import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenu from "./components/MainMenu";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPass from './components/ForgotPass';
import JoinQueue from './components/JoinQueue';
import StartQueue from './components/StartQueue';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotPass" element={<ForgotPass />} />
        <Route path="/joinQueue" element={<JoinQueue />} />
        <Route path="/startQueue" element={<StartQueue />} />
      </Routes>
    </Router>
  );
}

export default App;
