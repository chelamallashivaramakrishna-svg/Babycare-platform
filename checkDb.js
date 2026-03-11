const mongoose = require('mongoose');
const Child = require('./server/models/Child');

mongoose.connect('mongodb://localhost:27017/babycare')
    .then(async () => {
        const children = await Child.find({});
        console.log("Children in DB:", children.map(c => ({ name: c.name, pin: c.pin, familyId: c.family })));

        const Family = require('./server/models/Family');
        const families = await Family.find({});
        console.log("Families in DB:", families.map(f => ({ name: f.name, inviteCode: f.inviteCode, _id: f._id })));

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
