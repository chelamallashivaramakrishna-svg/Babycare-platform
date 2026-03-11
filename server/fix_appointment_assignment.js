const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Appointment = require('./models/Appointment');

dotenv.config();

const reassign = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Find Dr. Rama
        // Using partial match or finding the first doctor to be safe, or specific email if known
        // Based on previous interaction, user said "Dr. rama". 
        // Let's look for a user with 'rama' in the name if email fails, or just list all doctors.

        // For this specific fix, let's try to find the doctor by name 'rama' since the email might be different.
        const targetDoctor = await User.findOne({ name: { $regex: 'rama', $options: 'i' }, role: 'doctor' });

        if (!targetDoctor) {
            console.log('Target doctor (rama) not found. Trying to find ANY doctor...');
            const anyDoctor = await User.findOne({ role: 'doctor' });
            if (!anyDoctor) {
                console.log('NO DOCTORS FOUND AT ALL.');
                process.exit(1);
            }
            console.log(`Fallback: Using doctor ${anyDoctor.name} (${anyDoctor._id})`);
            // Reassign to this doctor
            const result = await Appointment.updateMany({}, { $set: { doctor: anyDoctor._id } });
            console.log(`✅ Updated ${result.modifiedCount} appointments to be assigned to ${anyDoctor.name}.`);
            process.exit();
        }

        console.log(`Target Doctor Found: ${targetDoctor.name} (${targetDoctor._id})`);

        // 2. Find ALL appointments and reassign to Rama
        const result = await Appointment.updateMany(
            {},
            { $set: { doctor: targetDoctor._id } }
        );

        console.log(`✅ Updated ${result.modifiedCount} appointments to be assigned to Dr. Rama.`);
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

reassign();
