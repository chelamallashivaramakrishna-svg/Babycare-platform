const Media = require('../models/Media');

// @desc    Get all media
// @route   GET /api/media
// @access  Private (Parent/Child)
const getMedia = async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};
        const media = await Media.find(query);
        res.json(media);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add media (Parent only)
// @route   POST /api/media
// @access  Private
const addMedia = async (req, res) => {
    try {
        const { title, url, category, minAge, maxAge } = req.body;
        const media = await Media.create({
            title,
            url,
            category,
            ageRange: { min: minAge, max: maxAge },
        });
        res.status(201).json(media);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMedia, addMedia };
