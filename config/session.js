import session from 'express-session'

export default function sessionConfig(){
    session({
        secret: "this is the key",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Set to true if using HTTPS
      })
}