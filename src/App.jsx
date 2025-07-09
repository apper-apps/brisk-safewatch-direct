import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import LiveMonitor from "@/components/pages/LiveMonitor";
import Violations from "@/components/pages/Violations";
import Workers from "@/components/pages/Workers";
import Analytics from "@/components/pages/Analytics";
import Settings from "@/components/pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LiveMonitor />} />
            <Route path="/violations" element={<Violations />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;