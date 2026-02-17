const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Access denied! Please login first. ' });
};

// const isModerator = (req, res, next) => {
//   const moderatorGitHubIds = [ /* list of GitHub IDs allowed */ ];
//   if (moderatorGitHubIds.includes(req.user.id)) return next();
//   res.status(403).json({ message: 'Moderator access required.' });
// };

// const isAdmin = (req, res, next) => {
//   if (!req.user || req.user.role !== "admin") {
//     return res.status(403).json({ message: "Access denied. Admins only." });
//   }
//   next();
// };

module.exports = { 
  isAuthenticated, 
  // isModerator, 
  // isAdmin 
};
