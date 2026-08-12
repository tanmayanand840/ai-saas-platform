// This middleware must run after `auth`. The plan is calculated by Clerk on
// the server in that middleware, never from a client-provided value.
export const requirePremium = (req, res, next) => {
  if (!req.authenticatedUserId) {
    return res.status(401).json({ success: false, message: "Unauthorized. Please sign in." });
  }

  // Fail closed when Clerk billing is unavailable, missing, or reports a
  // non-premium plan.
  if (req.plan !== "premium") {
    return res.status(403).json({
      success: false,
      message: "This feature is available only to Premium users.",
    });
  }

  next();
};
