import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const { unitPreference } = req.body;
    if (!['metric', 'imperial'].includes(unitPreference)) {
      return res.status(400).json({ message: 'Invalid unit preference' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { unitPreference },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
