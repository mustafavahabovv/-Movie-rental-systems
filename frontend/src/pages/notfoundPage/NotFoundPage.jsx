import React from "react";
import { Link } from "react-router-dom";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Oops! Page not found</h2>
      <p>The page you are looking for might have been removed or is temporarily unavailable.</p>
      <Link to="/" className="home-button">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
