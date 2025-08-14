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
        borderBottom: "1px solid #222942",
        boxShadow: "0 2px 12px 0 rgba(20,30,48,0.12)",
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
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
            color: props.mode === "dark" ? "#f8fafc" : "#22223b",
            textShadow: props.mode === "dark" ? "0 1px 8px #141e30" : "",
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
                  color: props.mode === "dark" ? "#f8fafc" : "#22223b",
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
                  color: props.mode === "dark" ? "#f8fafc" : "#22223b",
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
                  color: props.mode === "dark" ? "#f8fafc" : "",
                  borderColor: props.mode === "dark" ? "#f8fafc" : "",
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
