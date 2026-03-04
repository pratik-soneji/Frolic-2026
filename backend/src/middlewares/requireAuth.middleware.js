export const requireAuth = (req, res, next) => {
  console.log('requireAuth hit');
  
    if (
      req.authState === "VALID" ||
      req.authState === "REFRESHED"
    ) {
      return next();
    }
    // return res.status(401).json({
    //   message: "Please login again"
    // });
      return next();
  };
  