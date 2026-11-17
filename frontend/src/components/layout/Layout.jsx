import { Outlet } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import EmergencyNotice from "./EmergencyNotice.jsx";
import "./Layout.css";

// Shared page frame — owned by Trupal Jageshkumar Patel
function Layout() {
  return (
    <div className="layout">
      <a className="layout-skip visually-hidden-focusable" href="#main">
        Skip to content
      </a>
      <NavBar />
      <main id="main" className="layout-main container">
        <Outlet />
      </main>
      <footer className="layout-footer">
        <div className="container">
          <EmergencyNotice />
          <p className="layout-credit">
            Quilt, made by Heta Vimaleshkumar Patel and Trupal Jageshkumar
            Patel. MIT licensed.
          </p>
        </div>
      </footer>
    </div>
  );
}

Layout.propTypes = {};

export default Layout;
