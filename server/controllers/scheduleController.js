const Schedule = require('../models/Schedule');
const Child = require('../models/Child');

// @desc    Get schedule for a child
// @route   GET /api/schedule/:childId
// @access  Private (Parent/Doctor)
const getSchedule = async (req, res) => {
    try {
        let schedule = await Schedule.findOne({ child: req.params.childId });

        if (!schedule) {
            // Return empty structure if no schedule exists yet
            return res.json({ child: req.params.childId, activities: [] });
        }

        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update/Create schedule for a child
// @route   POST /api/schedule/:childId
// @access  Private (Parent)
const updateSchedule = async (req, res) => {
    const { activities } = req.body;

    try {
        let schedule = await Schedule.findOne({ child: req.params.childId });

        if (schedule) {
            schedule.activities = activities;
            const updatedSchedule = await schedule.save();
            res.json(updatedSchedule);
        } else {
            const newSchedule = await Schedule.create({
                child: req.params.childId,
                activities,
            });
            res.status(201).json(newSchedule);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSchedule, updateSchedule };
