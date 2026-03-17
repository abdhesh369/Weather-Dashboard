import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    // password and refreshToken are select:false — safe to return full doc
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.toPublicJSON());
  } catch (err) {
    console.error('[User] getProfile:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const { unitPreference } = req.body;
    if (!['metric', 'imperial'].includes(unitPreference)) {
      return res.status(400).json({ message: 'Unit must be "metric" or "imperial"' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { unitPreference },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.toPublicJSON());
  } catch (err) {
    console.error('[User] updatePreferences:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
