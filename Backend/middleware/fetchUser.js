const jwt = require("jsonwebtoken");
const User = require("../models/User");

const fetchUser = async (req, res, next) => {
  const authToken = req.header("authToken");
  if (!authToken) {
    return res.status(401).json({error: "Unauthenticated user"});
  }
  try {
    const user = jwt.verify(authToken, process.env.JWT_SECRET);

    const userId = await User.findById(user.userId).select("_id");
    if (!userId) {
      return res.status(401).json({error: "Unauthenticated user"});
    }
    req.user = user.userId;
    next();
  } catch (error) {
    return res.status(500).json({error: "Internal server error"});
  }
};
module.exports = fetchUser;
