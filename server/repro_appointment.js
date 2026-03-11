const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Appointment = require('./models/Appointment');

dotenv.config();

const runTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Find a Doctor
        const doctor = await User.findOne({ role: 'doctor' });
        if (!doctor) {
            console.log('❌ No doctor found. Test cannot proceed.');
            process.exit(1);
        }
        console.log(`✅ Doctor found: ${doctor.name} (${doctor._id})`);

        // 2. Find a Parent
        const parent = await User.findOne({ role: 'parent' });
        if (!parent) {
            console.log('❌ No parent found. Test cannot proceed.');
            process.exit(1);
        }
        console.log(`✅ Parent found: ${parent.name} (${parent._id})`);

        // 3. Simulate Query: What the Doctor Dashboard does
        console.log(`🔍 Testing Doctor Dashboard Query for doctorId: ${doctor._id}`);
        const appointments = await Appointment.find({ doctor: doctor._id });

        console.log(`📊 Found ${appointments.length} appointments for this doctor.`);
        if (appointments.length > 0) {
            appointments.forEach(a => {
                console.log(`   - Appt ID: ${a._id}, Status: ${a.status}, Parent: ${a.parent}`);
            });
        } else {
            // 4. If no appointments, try to CREATE one to see if it works
            console.log('⚠️ No appointments found. Attempting to create a test appointment...');
            const newAppt = await Appointment.create({
                doctor: doctor._id,
                parent: parent._id,
                reason: 'Automated Test Appointment',
                date: new Date(),
                status: 'pending'
            });
            console.log(`✅ Test Appointment Created: ${newAppt._id}`);

            // Verify again
            const check = await Appointment.find({ doctor: doctor._id });
            console.log(`📊 Re-check: Found ${check.length} appointments.`);
        }

        process.exit();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

runTest();
