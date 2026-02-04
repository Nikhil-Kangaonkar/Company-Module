import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CompanyInfo from "./pages/CompanyInfo";
import FoundingInfo from "./pages/FoundingInfo";
import SocialMedia from "./pages/SocialMedia";
import Contact from "./pages/Contact";

function App() {
  const [progress, setProgress] = useState(0);

  return (
    <>

      {/* Header with dynamic progress */}
      <Header progress={progress} />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<CompanyInfo setProgress={setProgress} />} />
        <Route path="/founding-info" element={<FoundingInfo />} />
        <Route path="/social-media" element={<SocialMedia />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

export default App;
