const JWTStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const User = require("../Models/User");
require("dotenv").config();

module.exports = passport => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromHeader("auth"),
        secretOrKey: process.env.SECRET
      },
      (payload, done) => {
        User.findById(payload.sub.id, (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false);
          } else {
            done(null, user);
          }
        });
      }
    )
  );
};
