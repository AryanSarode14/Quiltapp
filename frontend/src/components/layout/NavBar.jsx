import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import "./NavBar.css";

// Shared navigation — owned by Heta Vimaleshkumar Patel
function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  async function handleLogout() {
    close();
    await logout();
    navigate("/");
  }

  return (
    <header className="navbar-quilt">
      <nav className="container navbar-quilt-inner" aria-label="Main">
        <Link to="/" className="navbar-quilt-brand" onClick={close}>
          <span className="navbar-quilt-mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          Quilt
        </Link>

        <button
          type="button"
          className="navbar-quilt-toggle"
          aria-expanded={open}
          aria-controls="main-menu"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>

        <ul
          id="main-menu"
          className={`navbar-quilt-links ${open ? "is-open" : ""}`}
        >
          <li>
            <NavLink to="/requests" onClick={close}>
              Requests
            </NavLink>
          </li>
          <li>
            <NavLink to="/offers" onClick={close}>
              Offers
            </NavLink>
          </li>
          {user ? (
            <>
              <li>
                <NavLink to="/my-requests" onClick={close}>
                  My requests
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-offers" onClick={close}>
                  My offers
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-claims" onClick={close}>
                  My claimed spots
                </NavLink>
              </li>
              <li className="navbar-quilt-user">
                <span>Hi, {user.displayName}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" onClick={close}>
                  Log in
                </NavLink>
              </li>
              <li>
                <Link
                  to="/register"
                  className="btn btn-sm navbar-quilt-cta"
                  onClick={close}
                >
                  Join Quilt
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

NavBar.propTypes = {};

export default NavBar;
