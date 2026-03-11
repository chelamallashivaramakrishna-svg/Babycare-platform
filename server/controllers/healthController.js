const HealthRecord = require('../models/HealthRecord');
const Child = require('../models/Child');
const Family = require('../models/Family');

// @desc    Add health record
// @route   POST /api/health
// @access  Private
const addHealthRecord = async (req, res) => {
    try {
        const { childId, type, title, notes, height, weight, headCircumference, date } = req.body;

        // Verify child belongs to user's family
        const family = await Family.findOne({ parents: req.user._id, children: childId });
        // Note: This query assumes family.children array contains childId. 
        // If family.children is not populated, we need to check differently.
        // Better: Find family where parents=user, then check if family.children includes childId.

        // Simplification: Check if user has access to child
        // let's fetch child and check family
        const child = await Child.findById(childId).populate('family');

        if (!child) {
            return res.status(404).json({ message: 'Child not found' })
        }

        // Check if user is parent of this family
        const isParent = child.family.parents.some(pId => pId.toString() === req.user._id.toString());
        // Allow doctor/support too? (RBAC later)
        if (!isParent && req.user.role === 'parent') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        let attachments = [];
        if (req.files) {
            attachments = req.files.map(file => ({
                name: file.originalname,
                url: `/uploads/${file.filename}`,
                type: file.mimetype
            }));
        }

        const newRecordData = {
            child: childId,
            type,
            title,
            notes,
            date: date || Date.now(),
            metrics: {
                height: height ? Number(height) : undefined,
                weight: weight ? Number(weight) : undefined,
                headCircumference: headCircumference ? Number(headCircumference) : undefined,
            },
            attachments,
        };

        // If the user adding this is a doctor, attach their details
        if (req.user.role === 'doctor') {
            newRecordData.doctor = {
                name: req.user.name,
                id: req.user._id
            };
        }

        const record = await HealthRecord.create(newRecordData);

        // If growth record, update child's current metrics too?
        if (type === 'growth') {
            child.growthMetrics.push({
                date: date || Date.now(),
                height: height ? Number(height) : undefined,
                weight: weight ? Number(weight) : undefined,
                headCircumference: headCircumference ? Number(headCircumference) : undefined,
            });
            await child.save();
        }

        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get health records for a child
// @route   GET /api/health/:childId
// @access  Private
const getHealthRecords = async (req, res) => {
    try {
        const records = await HealthRecord.find({ child: req.params.childId }).sort({ date: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addHealthRecord, getHealthRecords };
