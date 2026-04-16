import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// If user hits root or /landing without index.html or ?app flag, redirect to exact cinematic landing page file
const params = new URLSearchParams(window.location.search);
const path = window.location.pathname;
if ((path === "/" || path === "/landing" || path === "/landing/") && !params.has("app")) {
  window.location.replace("/landing/index.html");
} else {
  createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
}
