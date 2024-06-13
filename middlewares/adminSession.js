export default function adminSessionMiddleware (req, res, next) {
    if (typeof req.session.adminIsOnline === "undefined") {
      req.session.adminIsOnline = false;
    }
    next();
  }