import { Strategy as LocalStrategy } from "passport-local";
import { findUserById, findUserByUsername } from "../db/usersDB.js";
import { verifyPassword } from "./password.js";

const INVALID_LOGIN = "That username and password don't match.";

export default function configurePassport(passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await findUserByUsername(username);
        if (!user) return done(null, false, { message: INVALID_LOGIN });

        const valid = await verifyPassword(
          password,
          user.salt,
          user.passwordHash,
        );
        if (!valid) return done(null, false, { message: INVALID_LOGIN });

        return done(null, {
          _id: user._id,
          username: user.username,
          displayName: user.displayName,
        });
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user._id.toString());
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await findUserById(id);
      done(null, user || false);
    } catch (err) {
      done(err);
    }
  });
}
