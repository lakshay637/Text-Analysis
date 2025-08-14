import React from "react";
import { Link } from "react-router-dom";

export default function Navbar(props) {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{
        background:
          props.mode === "dark"
            ? "linear-gradient(90deg, #141e30 0%, #243b55 100%)"
            : "linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)",
        borderBottom:
          props.mode === "dark" ? "1px solid #334155" : "1px solid #d1d5db",
        boxShadow: "0 2px 12px 0 rgba(20,30,48,0.12)",
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <div className="container-fluid px-2">
        <Link
          className="navbar-brand fw-bold"
          to="/"
          style={{
            fontWeight: 700,
            fontSize: "clamp(1.2rem, 3vw, 2rem)",
            letterSpacing: 1,
            color: props.mode === "dark" ? "#f8fafc" : "#0b0b0dff",
            textShadow:
              props.mode === "dark"
                ? "0 1px 8px #131415ff"
                : "0 1px 4px rgba(0,0,0,0.1)",
            transition: "color 0.3s ease-in-out",
          }}
        >
          <span role="img" aria-label="logo">
            📝
          </span>{" "}
          Text Analysis
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
                style={{
                  fontWeight: 600,
                  fontSize: "clamp(1rem, 2vw, 1.1rem)",
                  color: props.mode === "dark" ? "#f8fafc" : "#09090bff",
                  transition: "color 0.3s ease-in-out",
                }}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/about"
                style={{
                  fontWeight: 600,
                  fontSize: "clamp(1rem, 2vw, 1.1rem)",
                  color: props.mode === "dark" ? "#f8fafc" : "#111114ff",
                  transition: "color 0.3s ease-in-out",
                }}
              >
                About
              </Link>
            </li>
            <li className="nav-item ms-2">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={props.toggleMode}
                style={{
                  fontWeight: 600,
                  borderRadius: 8,
                  fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
                  color: props.mode === "dark" ? "#f8fafc" : "#1f2937",
                  borderColor: props.mode === "dark" ? "#f8fafc" : "#1f2937",
                  background:
                    props.mode === "dark"
                      ? "rgba(51,65,85,0.8)"
                      : "rgba(248,250,252,0.8)",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                {props.mode === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
