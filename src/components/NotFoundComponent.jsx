import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div>
      <h1>404 Not Found</h1>
      <p>Sorry, the page you have requested does not exits.</p>
      <p>
        <Link to="/">Go back to the main page</Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
