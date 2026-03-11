const Child = require('../models/Child');
const Family = require('../models/Family');

// @desc    Add a child
// @route   POST /api/children
// @access  Private
const createChild = async (req, res) => {
    try {
        const { name, dob, gender, bloodGroup, allergies, familyId, pin, screenTimeLimit } = req.body;

        // Verify family belongs to user
        const family = await Family.findOne({ _id: familyId, parents: req.user._id });
        if (!family) {
            return res.status(401).json({ message: 'Not authorized to add child to this family' });
        }

        const child = await Child.create({
            family: familyId,
            name,
            dob,
            gender,
            bloodGroup,
            allergies: Array.isArray(allergies) ? allergies : (allergies ? allergies.split(',') : []),
            pin,
            screenTimeLimit: screenTimeLimit ? Number(screenTimeLimit) : 60,
        });

        family.children.push(child._id);
        await family.save();

        res.status(201).json(child);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all children for a family
// @route   GET /api/children/family/:familyId
// @access  Private
const getChildren = async (req, res) => {
    try {
        const family = await Family.findOne({ _id: req.params.familyId, parents: req.user._id });
        if (!family) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const children = await Child.find({ family: req.params.familyId });
        res.json(children);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update child screen time used
// @route   PUT /api/children/:childId/screentime
// @access  Private
const updateScreenTime = async (req, res) => {
    try {
        const { minutes } = req.body;
        const child = await Child.findById(req.params.childId);
        if (!child) return res.status(404).json({ message: 'Child not found' });

        // Only allow the child themselves or parent to update
        if (req.user.role !== 'child' && req.user.role !== 'parent') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        child.screenTimeUsed += Number(minutes);
        await child.save();
        res.json({ screenTimeUsed: child.screenTimeUsed, screenTimeLimit: child.screenTimeLimit });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single child to get screen time info
// @route   GET /api/children/:childId
// @access  Private
const getChild = async (req, res) => {
    try {
        const child = await Child.findById(req.params.childId);
        if (!child) return res.status(404).json({ message: 'Child not found' });
        res.json(child);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Award star to child
// @route   PUT /api/children/:childId/stars
// @access  Private (Parent)
const awardStar = async (req, res) => {
    try {
        const { points } = req.body;
        const child = await Child.findById(req.params.childId);
        if (!child) return res.status(404).json({ message: 'Child not found' });

        if (req.user.role !== 'parent') {
            return res.status(401).json({ message: 'Not authorized to award stars' });
        }

        child.stars += Number(points || 1);
        await child.save();
        res.json({ stars: child.stars });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update child game score
// @route   PUT /api/children/:childId/game-score
// @access  Private (Child/Parent)
const updateGameScore = async (req, res) => {
    try {
        const { category, score } = req.body;
        const child = await Child.findById(req.params.childId);

        if (!child) return res.status(404).json({ message: 'Child not found' });

        // Validate category
        if (!['brain', 'educational', 'fun'].includes(category)) {
            return res.status(400).json({ message: 'Invalid game category' });
        }

        // Add score to existing score
        child.gameScores[category] += Number(score);

        // Also award a star for every 10 points (optional gamification logic)
        if (Number(score) > 0) {
            // We can keep it simple or add stars here. Let's just update the score for now.
        }

        await child.save();
        res.json({ gameScores: child.gameScores, stars: child.stars });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update child game level progress
// @route   PUT /api/children/:childId/levels
// @access  Private (Child/Parent)
const updateGameLevel = async (req, res) => {
    try {
        const { gameId, levelReached } = req.body;
        const child = await Child.findById(req.params.childId);

        if (!child) return res.status(404).json({ message: 'Child not found' });
        if (!gameId) return res.status(400).json({ message: 'gameId required' });

        // Find if progress exists
        const gameProgressIndex = child.completedLevels.findIndex(lvl => lvl.gameId === gameId);

        if (gameProgressIndex > -1) {
            // Update existing
            child.completedLevels[gameProgressIndex].currentLevel = levelReached;
            if (levelReached > child.completedLevels[gameProgressIndex].maxLevelUnlocked) {
                child.completedLevels[gameProgressIndex].maxLevelUnlocked = levelReached;
            }
        } else {
            // Create new progress record
            child.completedLevels.push({
                gameId,
                currentLevel: levelReached,
                maxLevelUnlocked: levelReached
            });
        }

        await child.save();
        res.json({ completedLevels: child.completedLevels });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a child's profile
// @route   PUT /api/children/:childId
// @access  Private
const updateChild = async (req, res) => {
    try {
        const { name, dob, gender, bloodGroup, allergies, pin, screenTimeLimit } = req.body;
        const child = await Child.findById(req.params.childId).populate('family');

        if (!child) return res.status(404).json({ message: 'Child not found' });

        // Verify family belongs to user
        const isParent = child.family.parents.some(p => p.toString() === req.user._id.toString());
        if (!isParent) {
            return res.status(401).json({ message: 'Not authorized to edit this child' });
        }

        if (name) child.name = name;
        if (dob) child.dob = dob;
        if (gender) child.gender = gender;
        if (bloodGroup !== undefined) child.bloodGroup = bloodGroup;
        if (allergies !== undefined) child.allergies = Array.isArray(allergies) ? allergies : (allergies ? allergies.split(',') : []);
        if (pin) child.pin = pin;
        if (screenTimeLimit !== undefined) child.screenTimeLimit = Number(screenTimeLimit);

        const updatedChild = await child.save();
        res.json(updatedChild);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createChild, getChildren, updateScreenTime, getChild, awardStar, updateGameScore, updateGameLevel, updateChild };
