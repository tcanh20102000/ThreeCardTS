import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import RequirePlayers from "../../components/RequirePlayers/RequirePlayers";
import Login from "../Login/index";
import Main from "../Main/index";

function WholeApp() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/" element={<RequirePlayers />}>
          <Route path="/home" element={<Main />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default WholeApp;
