const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Appointment = require('./models/Appointment');

dotenv.config();

const fs = require('fs');
const path = require('path');

const debugData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        let output = 'MongoDB Connected\n\n';

        // 1. List ALL Doctors
        output += '=== DOCTORS ===\n';
        const doctors = await User.find({ role: 'doctor' });
        doctors.forEach(d => {
            output += `Name: ${d.name} | ID: ${d._id} | Email: ${d.email}\n`;
        });

        // 2. List ALL Appointments
        output += '\n=== APPOINTMENTS ===\n';
        const appointments = await Appointment.find({}).populate('doctor', 'name').populate('parent', 'name');

        if (appointments.length === 0) {
            output += 'No appointments found in database.\n';
        } else {
            appointments.forEach(a => {
                output += `Appt ID: ${a._id}\n`;
                output += `   - Assigned Doctor: ${a.doctor ? `${a.doctor.name} (${a.doctor._id})` : `UNLINKED ID: ${a.doctor}`}\n`;
                output += `   - Parent: ${a.parent ? a.parent.name : 'Unknown'}\n`;
                output += `   - Status: ${a.status}\n`;
            });
        }

        fs.writeFileSync(path.join(__dirname, 'debug_dump.txt'), output);
        console.log('Debug data written to debug_dump.txt');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugData();
