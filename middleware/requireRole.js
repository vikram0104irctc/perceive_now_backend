export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user && role === "any") {
      return next();
    }
    if (req.user && req.user.role === role) {
      return next();
    }
    return res.status(403).json({ message: "Access denied" });
  };
};
