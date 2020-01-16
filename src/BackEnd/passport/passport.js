const LocalStrategy = require("passport-local").Strategy;
const User = require("../Models/User");
const bcrypt = require("bcrypt");

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      { usernameField: "userName" },
      (username, password, done) => {
        User.findOne({ userName: username }, (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            console.log(user);
            return done(null, false);
          }
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.log(err);
            }
            if (!isMatch) {
              console.log(isMatch);
              return done(null, false);
            } else {
              console.log(isMatch);
              return done(false, user);
            }
          });
        });
      }
    )
  );
};
