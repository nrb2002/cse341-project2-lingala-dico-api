const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Authentication required' });
};

const isModerator = (req, res, next) => {
  const moderatorGitHubIds = [ /* list of GitHub IDs allowed */ ];
  if (moderatorGitHubIds.includes(req.user.id)) return next();
  res.status(403).json({ message: 'Moderator access required' });
};

module.exports = { isAuthenticated, isModerator };
