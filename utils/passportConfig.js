import User from '../models/user.model.js';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


const initializingPassport = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://assignment-project-frontend-cbs5.vercel.app/api/auth/auth/google/callback',   //same as in google console
      },
      async (accessToken, refreshToken,profile, done) => {

        // console.log("profile",profile)
        // console.log("acess token",accessToken)
        try {
          let user = await User.findOne({ googleId: profile.id });


          // If user doesn't exist, create a new one
          if (!user) {
            user = await User.create({
              googleId: profile.id,
              username: profile.name.givenName,
              email: profile.emails[0].value,
              lastName: profile.name.familyName,
              password:profile.id,
            });
          }

          //return the user and set the the req.user
          done(null, user);         //null indicates no errors
        } catch (err) {
          done(err, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {     
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

export default initializingPassport;
