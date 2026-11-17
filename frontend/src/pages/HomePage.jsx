import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import "./HomePage.css";

// Home page — owned by Trupal Jageshkumar Patel
const PATCHES = [
  { text: "Grab my package?", tone: "patch-denim" },
  { text: "Going to the market Saturday, room for 2", tone: "patch-marigold" },
  { text: "Borrow a drill", tone: "patch-rose" },
  { text: "Airport ride, 6am", tone: "patch-moss" },
  { text: "Extra dal tonight", tone: "patch-clay" },
  { text: "Help moving one couch", tone: "patch-plum" },
  { text: "Printer won't connect", tone: "patch-sky" },
  { text: "Water my plants", tone: "patch-stone" },
];

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-copy">
          <h1>Small favors, stitched into a community.</h1>
          <p>
            Living away from family, the hard part is often knowing whom to ask.
            Quilt is a board for your campus and neighborhood: post what you
            need, or post a trip you&rsquo;re already making so others can join
            in.
          </p>
          <div className="home-hero-actions">
            <Link
              to={user ? "/requests/new" : "/register"}
              className="btn btn-primary btn-lg"
            >
              Ask for help
            </Link>
            <Link
              to={user ? "/offers/new" : "/register"}
              className="btn btn-outline-primary btn-lg"
            >
              Offer help
            </Link>
          </div>
        </div>

        <ul className="home-quilt" aria-label="Examples of favors on Quilt">
          {PATCHES.map((patch) => (
            <li key={patch.text} className={`home-quilt-patch ${patch.tone}`}>
              {patch.text}
            </li>
          ))}
        </ul>
      </section>

      <section className="home-guide" aria-labelledby="how-to-use">
        <h2 id="how-to-use">How to use Quilt</h2>
        <div className="home-guide-columns">
          <div>
            <h3>When you need a hand</h3>
            <ol>
              <li>Create an account and log in.</li>
              <li>
                Choose <Link to="/requests/new">Post a request</Link>. Add a
                category, urgency, your area, and the date you need it by.
              </li>
              <li>
                Someone nearby taps &ldquo;I can help.&rdquo; You&rsquo;ll see
                their name under <Link to="/my-requests">My requests</Link>, and
                they&rsquo;ll see your contact note.
              </li>
              <li>Mark it completed and leave a rating and thank-you note.</li>
            </ol>
            <p>
              Or skip posting: browse <Link to="/offers">offers</Link> and claim
              a spot on a trip someone is already making.
            </p>
          </div>
          <div>
            <h3>When you have time to give</h3>
            <ol>
              <li>
                Browse <Link to="/requests">open requests</Link>. Search, filter
                by category and area, and sort by urgency.
              </li>
              <li>
                Tap &ldquo;I can help&rdquo; and reach out using the contact
                note.
              </li>
              <li>
                Making a trip anyway?{" "}
                <Link to="/offers/new">Post an offer</Link> with your
                availability and how many people you can help.
              </li>
              <li>
                Track who claimed spots and read feedback under{" "}
                <Link to="/my-offers">My offers</Link>.
              </li>
            </ol>
          </div>
        </div>
        <p className="home-privacy">
          To keep everyone safe, posts show only a general area. Contact notes
          are shared only with the person you&rsquo;re helping or being helped
          by.
        </p>
      </section>
    </div>
  );
}

HomePage.propTypes = {};

export default HomePage;
