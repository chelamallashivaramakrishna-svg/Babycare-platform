const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Family = require('./models/Family');
const Child = require('./models/Child');
const Appointment = require('./models/Appointment');
const HealthRecord = require('./models/HealthRecord');
const Media = require('./models/Media');
const Schedule = require('./models/Schedule');
const Ticket = require('./models/Ticket');

dotenv.config();

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        console.log('🗑️  Clearing all old data...');
        await Promise.all([
            User.deleteMany({}),
            Family.deleteMany({}),
            Child.deleteMany({}),
            Appointment.deleteMany({}),
            HealthRecord.deleteMany({}),
            Media.deleteMany({}),
            Schedule.deleteMany({}),
            Ticket.deleteMany({}),
        ]);
        console.log('✅ All old data cleared.\n');

        // ─── DOCTORS ──────────────────────────────────────────────────
        console.log('👨‍⚕️  Creating Doctors...');
        const doctorData = [
            { name: 'Dr. Arjun Mehta', email: 'arjun.mehta@babycare.in', specialization: 'Pediatrician', phone: '+91-9810001001' },
            { name: 'Dr. Priya Sharma', email: 'priya.sharma@babycare.in', specialization: 'Child Neurologist', phone: '+91-9820002002' },
            { name: 'Dr. Rohan Verma', email: 'rohan.verma@babycare.in', specialization: 'General Physician', phone: '+91-9830003003' },
            { name: 'Dr. Sneha Patil', email: 'sneha.patil@babycare.in', specialization: 'Neonatologist', phone: '+91-9840004004' },
            { name: 'Dr. Vikram Nair', email: 'vikram.nair@babycare.in', specialization: 'Pediatric Surgeon', phone: '+91-9850005005' },
        ];
        const createdDoctors = [];
        for (const d of doctorData) {
            const doc = new User({ ...d, password: 'Doctor@2026', role: 'doctor' });
            await doc.save();
            createdDoctors.push(doc);
            console.log(`   ✓ ${d.name} — ${d.email}`);
        }

        // ─── PARENTS ──────────────────────────────────────────────────
        console.log('\n👨‍👩‍👧  Creating Parents...');
        const parentData = [
            { name: 'Amit Kapoor', email: 'amit.kapoor@gmail.com', phone: '+91-9710001001' },
            { name: 'Sunita Joshi', email: 'sunita.joshi@gmail.com', phone: '+91-9720002002' },
            { name: 'Rajesh Kumar', email: 'rajesh.kumar@gmail.com', phone: '+91-9730003003' },
            { name: 'Meena Pillai', email: 'meena.pillai@gmail.com', phone: '+91-9740004004' },
            { name: 'Deepak Gupta', email: 'deepak.gupta@gmail.com', phone: '+91-9750005005' },
        ];
        const createdParents = [];
        for (const p of parentData) {
            const parent = new User({ ...p, password: 'Parent@2026', role: 'parent' });
            await parent.save();
            createdParents.push(parent);
            console.log(`   ✓ ${p.name} — ${p.email}`);
        }

        // ─── SUPPORT STAFF ────────────────────────────────────────────
        console.log('\n🎧  Creating Support Staff...');
        const supportData = [
            { name: 'Kavita Rao', email: 'kavita.rao@babycare.in', phone: '+91-9610001001' },
            { name: 'Suresh Iyer', email: 'suresh.iyer@babycare.in', phone: '+91-9620002002' },
        ];
        const createdSupport = [];
        for (const s of supportData) {
            const staff = new User({ ...s, password: 'Support@2026', role: 'support' });
            await staff.save();
            createdSupport.push(staff);
            console.log(`   ✓ ${s.name} — ${s.email}`);
        }

        // ─── FAMILIES & CHILDREN ──────────────────────────────────────
        console.log('\n🏠  Creating Families & Children...');
        const childNames = ['Aarav', 'Ishaan', 'Ananya', 'Riya', 'Kabir'];
        for (let i = 0; i < 5; i++) {
            const family = new Family({
                name: `${createdParents[i].name.split(' ')[0]} Family`,
                parents: [createdParents[i]._id],
                inviteCode: `FAM${i + 1}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            });
            await family.save();

            const child = new Child({
                family: family._id,
                name: childNames[i],
                dob: new Date(2019 + i, i % 12, 10 + i),
                gender: i % 2 === 0 ? 'male' : 'female',
                bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'A-'][i],
                pin: '1234',
                pediatrician: {
                    name: createdDoctors[i].name,
                    phone: createdDoctors[i].phone,
                },
            });
            await child.save();

            family.children.push(child._id);
            await family.save();
            console.log(`   ✓ Family: ${family.name} | Child: ${child.name} | Invite: ${family.inviteCode}`);
        }

        console.log('\n🎉 All data seeded successfully!');
        console.log('\n══════════════════════════════════════════');
        console.log('📋 DEMO CREDENTIALS SUMMARY');
        console.log('══════════════════════════════════════════');
        console.log('👨‍⚕️  DOCTORS  (password: Doctor@2026)');
        doctorData.forEach(d => console.log(`   ${d.email}`));
        console.log('\n👨‍👩‍👧  PARENTS  (password: Parent@2026)');
        parentData.forEach(p => console.log(`   ${p.email}`));
        console.log('\n🎧  SUPPORT  (password: Support@2026)');
        supportData.forEach(s => console.log(`   ${s.email}`));
        console.log('══════════════════════════════════════════\n');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
