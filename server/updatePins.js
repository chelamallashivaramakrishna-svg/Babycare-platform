require('dotenv').config();
const mongoose = require('mongoose');
const Child = require('./models/Child');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        await Child.updateMany({ pin: { $exists: false } }, { $set: { pin: '1234', screenTimeLimit: 60, screenTimeUsed: 0 } });
        await Child.updateMany({ pin: null }, { $set: { pin: '1234', screenTimeLimit: 60, screenTimeUsed: 0 } });
        console.log('Updated existing children');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
