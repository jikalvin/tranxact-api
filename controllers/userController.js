const User = require('../models/User'); // Adjust the path as necessary

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCurrentUser = (req, res) => {
  // Assuming you're using some form of authentication middleware
  // that attaches the user to the request object
  if (req.user) {
      res.json(req.user);
  } else {
      res.status(401).json({ message: 'Not authenticated' });
  }
};
