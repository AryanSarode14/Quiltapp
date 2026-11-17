import { Link } from "react-router-dom";
import "./NotFoundPage.css";

function NotFoundPage() {
  return (
    <section className="not-found-page">
      <h1 className="page-title">This page has a hole in it</h1>
      <p>The link may be old or mistyped.</p>
      <Link to="/" className="btn btn-primary">
        Go to the home page
      </Link>
    </section>
  );
}

NotFoundPage.propTypes = {};

export default NotFoundPage;
