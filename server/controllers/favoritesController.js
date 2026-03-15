import User from '../models/User.js';

export const addFavorite = async (req, res) => {
    try {
        const { city } = req.body;

        if (!city) {
            return res.status(400).json({ message: 'City name is required' });
        }

        const currentUser = await User.findById(req.user._id);
        if (currentUser && currentUser.favoriteCities.length >= 20) {
            return res.status(400).json({ message: 'Maximum of 20 favourite cities reached.' });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { favoriteCities: city } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.favoriteCities);
    } catch (error) {
        console.error('Add favorite error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.favoriteCities);
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const removeFavorite = async (req, res) => {
    try {
        const { city } = req.body;

        if (!city) {
            return res.status(400).json({ message: 'City name is required' });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { favoriteCities: city } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.favoriteCities);
    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
