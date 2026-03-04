export const blockIfAuthenticated = (req, res, next) => {
    if (req.authState === "VALID") {
      return res.status(400).json({
        message: "Already logged in"
      })
    }
    next()
  }
  