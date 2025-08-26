// config/passport.js
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { getDB } from "./configdb.js";   // OJO: en tu estructura ya tienes configdb.js
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export const configurePassport = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const db = getDB();
        const user = await db
          .collection("usuarios") // 👈 tu colección se llama usuarios, no "users"
          .findOne({ _id: new ObjectId(jwt_payload.id) });

        if (user) return done(null, user);
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
};