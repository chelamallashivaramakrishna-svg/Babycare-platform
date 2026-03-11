const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const User = require('./models/User');
const Appointment = require('./models/Appointment');

dotenv.config();

const debugData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        let output = 'MongoDB Connected\n';

        output += 'Finding doctors...\n';
        const doctors = await User.find({ role: 'doctor' });
        output += `Doctors found: ${doctors.length}\n`;
        doctors.forEach(d => output += `Doctor: ${d.name} (${d._id})\n`);

        output += 'Finding appointments...\n';
        const appointments = await Appointment.find({});
        output += `Appointments found: ${appointments.length}\n`;
        appointments.forEach(a => output += `Appointment: DoctorID=${a.doctor}, ParentID=${a.parent}, Date=${a.date}, Status=${a.status}\n`);

        fs.writeFileSync('debug_output.txt', output);
        console.log('Debug output written to debug_output.txt');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugData();

// Prevent hanging
setTimeout(() => {
    console.error('Timeout reached');
    process.exit(1);
}, 10000);
