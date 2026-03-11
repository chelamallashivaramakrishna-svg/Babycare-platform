# BABY CARE MANAGEMENT APPLICATION
## PHASE-II PROJECT REPORT

---

# TABLE OF CONTENTS
1. INTRODUCTION
   1.1 PURPOSE AND OBJECTIVES
   1.2 EXISTING AND PROPOSED SYSTEM
   1.3 SCOPE OF PROJECT
2. SYSTEM ANALYSIS
   2.1 HARDWARE AND SOFTWARE REQUIREMENTS
   2.2 SOFTWARE REQUIREMENTS SPECIFICATION
3. SYSTEM DESIGN
   3.1 ARCHITECTURE
   3.2 UML DIAGRAMS
4. METHODOLOGY
   4.1 MODULE DESCRIPTION
   4.2 PROCESS/ALGORITHM
5. IMPLEMENTATION
   5.1 SAMPLE CODE
   5.2 OUTPUT SCREENS
6. CONCLUSION & FUTURE SCOPE
7. BIBLIOGRAPHY

---

# 1. INTRODUCTION

## 1.1 PURPOSE AND OBJECTIVES

**Purpose:**
The primary purpose of the Baby Care Management Application is to build a comprehensive, production-ready, full-stack digital solution for managing a child’s complete life record from birth while providing controlled learning and media experiences. In today’s fast-paced world, parents often struggle to keep track of their child's healthcare records, vaccination schedules, growth milestones, and daily activities. Furthermore, managing the digital content consumption of children is increasingly becoming a challenge. This application bridges this gap by offering a centralized, secure, and user-friendly platform where parents can manage every aspect of their child's early developmental years.

**Objectives:**
1. **User Management and Authentication:** To implement a robust and highly secure authentication system that includes email/password registration, JWT-based session management, hashed passwords, and a PIN login feature for quick access. It aims to support Role-Based Access Control (RBAC) accommodating distinct roles such as Parent, Child, and Doctor/Support, integrated within a family grouping structure.
2. **Comprehensive Core Features:** To develop a secure family dashboard that allows seamless child profile management. It must retain a complete baby record spanning from the moment of birth. This encompasses intricate details like hospital summaries, financial bills, exact medicine dosages, real-time vaccination tracking, detailed growth percentiles, ongoing health reports, everyday activity history, and the provision for secure file uploads for medical documentation.
3. **Advanced Media & Screen Control Mechanism:** To incorporate a specialized media center that categorizes video content based on age criteria. Crucially, it must feature stringent parent controls including absolute screen time limits, manual content approval pipelines, and comprehensive viewing analytics or reports to ensure children consume only safe and beneficial content.
4. **Learning & Development Modules:** To establish a structured learning environment through a child timetable planner, interactive daily task checklists, knowledge or cognitive scoring modules, and AI-driven insights that generate periodic, detailed parent reports on the child’s cognitive and behavioral advancement.
5. **Support and Medical System:** To integrate an exclusive Doctor Feedback Portal. This feature aims to establish an immediate communication bridge between healthcare providers and parents, facilitating medical feedback, e-prescriptions, pediatric suggestions, and an efficient appointment booking system whereby doctors can clearly view slots booked by parents.
6. **Data Privacy and Security:** To ensure stringent compliance with data privacy standards by incorporating industry-best encryption protocols to secure the sensitive medical, personal, and developmental data of minors.

## 1.2 EXISTING AND PROPOSED SYSTEM

### 1.2.1 Existing System
The existing methodology for baby care management heavily relies on fragmented and often physical modes of record-keeping. Parents typically utilize scattered physical vaccination cards, loosely kept hospital discharge summaries, unsynchronized digital calendars, and standalone rudimentary mobile applications that perform only one specific task (e.g., only a weight tracker, or only a digital diary).
*   **Disadvantages of Existing Systems:**
    *   **Data Fragmentation:** Health reports, prescriptions, and developmental milestones are rarely in one place, leading to lost information or confusion during pediatric visits.
    *   **Lack of Unified Access:** Multiple caregivers (mother, father, grandparents, doctors) do not have a synchronized view of the child's status.
    *   **Ineffective Media Control:** Standard streaming platforms offer generic "kids" modes which often fail to restrict granularly, requiring parents to constantly monitor the screen physically.
    *   **No Integrated Medical Feedback:** Parents typically have to use separate tele-medicine apps or physical visits for even minor pediatric feedback, breaking the continuity of the child’s health context.

### 1.2.2 Proposed System
The proposed system is an integrated, full-stack Baby Care Management ecosystem. It unifies healthcare, daily scheduling, digital consumption limits, and developmental tracking into one robust platform.
*   **Advantages of Proposed Systems:**
    *   **Centralized Repository:** Everything from the first hospital bill to the latest prescribed medication, including secure uploads of X-rays or reports, is instantly accessible by authorized family members.
    *   **Role-Based Interaction:** Parents have admin control, doctors have consultation access to prescribe or view analytics, and children have restricted access specifically tailored to educational or approved media consumption.
    *   **Proactive Health and Schedule Management:** Automated reminders for vaccinations, medications, and daily tasks reduce manual oversight.
    *   **Advanced Analytics:** AI-driven insights parse through the child's learning scores and growth data to provide predictive analysis to parents regarding developmental trajectories.
    *   **Robust Security:** The use of JWT authentication and encrypted data transmission ensures that the highly sensitive pediatric profile information is not compromised.

## 1.3 SCOPE OF PROJECT
The scope of the project encompasses the design, development, thorough testing, and deployment of a multi-platform web application utilizing a modern tech stack (typically MERN or equivalent). 
The boundaries of the project include:
*   Developing frontend interfaces tailored for three distinct user experiences: The Parent Dashboard, The Child Interface, and the Doctor Portal.
*   Designing an intricate relational or document-based database structure capable of handling diverse data types (text logs, numerical health data, multimedia files, PDF reports).
*   Implementing server-side logic that robustly handles authentication, media streaming restrictions, time-lock mechanisms, and role verification.
*   Integrating an appointment handling API that dynamically checks provider availability and allows parents to book, whilst rendering this data live to the respective doctor’s portal.
Expected End Product: A fully functional web application that serves as a one-stop centralized digital hub for modern parenting and pediatric tracking.

---

# 2. SYSTEM ANALYSIS

## 2.1 HARDWARE AND SOFTWARE REQUIREMENTS

**Hardware Requirements:**
*   **Processor:** Intel Core i5 / AMD Ryzen 5 or equivalent (Minimum); Intel Core i7 / AMD Ryzen 7 (Recommended for development).
*   **RAM:** 8 GB (Minimum); 16 GB (Recommended for running local servers and databases without latency).
*   **Storage:** 256 GB SSD (Minimum, SSD highly recommended to speed up module compilation and database reads).
*   **Display:** Standard Monitor (1920x1080 resolution recommended) for UI testing across responsive breakpoints.
*   **Network:** Stable broadband internet connection for downloading NPM packages, Docker images (if used), and interacting with cloud hosting platforms.

**Software Requirements:**
*   **Operating System:** Windows 10/11, macOS, or any standard Linux Distribution (e.g., Ubuntu).
*   **Frontend Framework:** React.js / Vite / Next.js (HTML5, CSS3/TailwindCSS, JavaScript/TypeScript).
*   **Backend Environment:** Node.js with Express.js framework.
*   **Database:** MongoDB (NoSQL) for flexible document schemas (ideal for complex health records) or PostgreSQL (Relational) for stringent data integrity.
*   **IDE:** Visual Studio Code (VS Code) with extensions for linting (ESLint), formatting (Prettier), and API testing (Thunder Client/Postman).
*   **Version Control:** Git & GitHub/GitLab for repository management and collaborative versioning.
*   **API Testing Tool:** Postman or Insomnia.
*   **Other Tools:** JWT for Authentication, Bcrypt for password hashing, Multer for file uploads (handling medical records and profile pictures).

## 2.2 SOFTWARE REQUIREMENTS SPECIFICATION

### 2.2.1 Functional Requirements
1. **Authentication Module:**
    *   FR-1: System shall allow the registration of a 'Family' root account by a Parent.
    *   FR-2: System shall authenticate users via Email and a securely hashed password.
    *   FR-3: System shall allow Parents to set up child accounts accessible via a 4-digit PIN for ease of use by minors.
2. **Profile & Record Management:**
    *   FR-4: System shall allow parents to create detailed child profiles (DOB, Blood Group, Allergies).
    *   FR-5: System shall provide a vaccination chart where parents can check off completed shots and upload proof.
    *   FR-6: System shall store and retrieve growth metrics (Height, Weight, Head Circumference) plotting them against standard WHO percentiles.
3. **Media Control System:**
    *   FR-7: System shall allow parents to define daily screen-time limits for individual child accounts.
    *   FR-8: System shall forcibly log out or lock the Child interface once the daily time limit is exhausted.
    *   FR-9: System shall maintain an audit log of media consumed by the child.
4. **Doctor Portal & Feedback:**
    *   FR-10: System shall provide doctors with a portal to view parent-booked appointments.
    *   FR-11: System shall allow doctors to append medical feedback, write digital prescriptions, and attach them specifically to a child’s profile, instantly visible to the parent.

### 2.2.2 Non-Functional Requirements
1. **Security:**
    *   NFR-1: All passwords must be hashed using a strong salt before database insertion.
    *   NFR-2: Sensitive APIs must be protected via JSON Web Tokens (JWT) ensuring stateless yet secure interactions.
    *   NFR-3: Role-Based routing must prevent a 'Child' token from accessing 'Parent' or 'Doctor' API endpoints.
2. **Performance:**
    *   NFR-4: The user interface must load within 2 seconds under standard broadband conditions.
    *   NFR-5: Complex operations like generating the growth chart graphs should yield data within 500ms.
3. **Scalability:**
    *   NFR-6: The system architecture should follow a microservices or highly modular monolithic pattern to allow scaling of individual components (e.g., scaling the Media streaming module independently from the Appointment module).
4. **Usability:**
    *   NFR-7: The interface must be fully responsive, accessible seamlessly on mobile browsers, tablets, and desktop devices as parents likely use mobile devices frequently.
    *   NFR-8: The Child Interface must utilize large icons, bright colors, and intuitive navigation suitable for young cognitive levels.

---

# 3. SYSTEM DESIGN

## 3.1 ARCHITECTURE

The Baby Care Management Application employs a modern **Three-Tier Architecture** utilizing the Client-Server model.

1. **Presentation Tier (Frontend):**
   *   Developed primarily using React.js. This layer is entirely responsible for the UI/UX. It makes asynchronous HTTP REST calls using `axios` or `fetch` APIs.
   *   It incorporates State Management (e.g., Redux Toolkit or React Context API) to manage global states like the logged-in User's Profile, current Family Data, and App Setting themes.
   *   Routing is handled via React Router DOM, utilizing Private Routes and Role-Based wrappers to restrict navigation.

2. **Application Logic Tier (Backend):**
   *   Constructed using Node.js and Express.js. This tier handles all the business logic, input validation, authentication verification, and data processing.
   *   **Controllers:** Parse incoming requests, trigger appropriate services, and formulate standard JSON responses.
   *   **Middleware:** Crucial layers for JWT extraction/verification, Role validation (isParent, isDoctor, isChild), and error handling.
   *   **Services:** Execute business rules (e.g., calculating if screen time limit is reached, computing growth percentiles).

3. **Data Access Tier (Database):**
   *   Utilizes a scalable database like MongoDB. Data is categorized into collections: Users, Families, MedicalRecords, Appointments, Tasks, and MediaLogs.
   *   Mongoose ODM (Object Data Modeling) is heavily utilized to enforce schemas, establish relationships (e.g., Family pointing to an array of Child ObjectIds), and execute validation hooks before saving.

## 3.2 UML DIAGRAMS

*(Note for formatting in your physical document: Please draw or insert standard UML diagrams in the blank spaces provided utilizing tools like StarUML, Draw.io, or Lucidchart based on the detailed descriptions below to cover maximum page space.)*

### 3.2.1 Use Case Diagram
**Description:** The Use Case Diagram details the system’s primary actors and the operations they can perform.
*   **Actors:** Parent, Child, Doctor, Admin (System).
*   **Parent Use Cases:** Register Family, Add Child Profile, Upload Medical Record, Set Screen Time Limit, View Analytics, Book Doctor Appointment.
*   **Child Use Cases:** Login via PIN, View Authorized Media, Complete Daily Task, View Timetable (Restricted access, bounded by time constraints).
*   **Doctor Use Cases:** Login, View Assigned Appointments, Search Child Record (read-only if authorized), Add Prescription, Append Medical Feedback.
*(Insert full-page Use Case Diagram here)*

### 3.2.2 Class Diagram
**Description:** Highlights the static structure, showing the classes, attributes, methods, and relationships.
*   **Class: User** (Attributes: id, email, passwordHash, role, createdAt. Methods: login(), updateProfile()).
*   **Class: Family** (Attributes: familyId, parentId, childrenIds[], contactNumber).
*   **Class: MedicalRecord** (Attributes: recordId, childId, type [Vaccine, Illness, General], doctorId, date, description, attachments[]. Methods: addRecord(), getHistory()).
*   **Class: ScreenTimeSettings** (Attributes: childId, maxDailyMinutes, currentUsedMinutes, lockedStatus).
*   **Class: Appointment** (Attributes: appointmentId, doctorId, parentId, dateTime, status, feedbackNotes).
*(Insert full-page Class Diagram here)*

### 3.2.3 Sequence Diagram: Appointment Booking Flow
**Description:** Depicts the chronological sequence of messages exchanged between objects for the 'Book Appointment' feature.
1. Parent UI -> Appointment Controller: `POST /api/appointments/book (doctorId, timeSlot)`
2. Appointment Controller -> Authentication Middleware: Validate JWT
3. Authentication Middleware -> Appointment Controller: Token Valid
4. Appointment Controller -> Database (Appointments Model): Verify slot availability
5. Database -> Appointment Controller: Slot Available
6. Appointment Controller -> Database (Appointments Model): `save()` new appointment
7. Database -> Appointment Controller: Save Success (Returns Appointment ID)
8. Appointment Controller -> Parent UI: Return `201 Created` with Success Message.
*(Insert full-page Sequence Diagram here)*

### 3.2.4 Activity Diagram: Child Media Access
**Description:** Flowchart showing the conditional logic when a child attempts to watch a video.
1. Start.
2. Child selects video.
3. System checks `ScreenTimeSettings` for `childId`.
4. Decision: Is `currentUsedMinutes` < `maxDailyMinutes`?
   *   If NO: End Media access. Display "Time's up!" screen. System logs constraint hit. End.
   *   If YES: Proceed.
5. Decision: Is video category approved for Child's age group?
   *   If NO: Deny access. Display "Content Restricted". End.
   *   If YES: Start streaming video.
6. System initiates chronometer.
7. System updates `currentUsedMinutes` every 60 seconds.
8. End (upon video finish or time limit reached).
*(Insert full-page Activity Diagram here)*

---

# 4. METHODOLOGY

## 4.1 MODULE DESCRIPTION

The system is compartmentalized into specific functional modules to ensure clean code architecture and maintainability.

### 4.1.1 Authentication & Authorization Module
This module forms the security backbone. It involves creating RESTful endpoints for user registration and login. Utilizing bcryptjs, raw passwords are converted into irreversible hashes. Upon successful login, jsonwebtoken signs a payload containing the User ID and their Role (e.g., Parent). This JWT is then securely transmitted, often stored in HttpOnly cookies or memory, and must be passed as a Bearer token in the Authorization header for all subsequent protected requests. Crucially, the Child Login flow is optimized; since children cannot manage emails, parents generate a 4-digit PIN mapping to a specific sub-account profile.

### 4.1.2 Family & Profile Control Module
This module handles the core hierarchical data. A 'Family' entity is created which acts as an overarching umbrella. Parents can then perform CRUD (Create, Read, Update, Delete) operations on Child Profiles. For each child profile, this module maintains an intricate schema capable of tracking birth details, calculating current age precisely, and holding references to other massive data modules like medical history or media logs.

### 4.1.3 Digital Medical Record (EMR) Module
Designed to mimic a professional Electronic Medical Record system tailored for pediatrics. This module classifies data into vaccinations, illness logs, and growth charts. The backend implements logic to compare a child's inputted height and weight against static JSON datasets representing WHO standardized percentiles, feeding this analyzed data back to the frontend to draw dynamic line graphs using libraries like Recharts or Chart.js. Furthermore, it incorporates Multer to handle `multipart/form-data`, allowing PDF or Image uploads to cloud storage (like AWS S3 or a local static folder), storing only the retrieving URL in the database.

### 4.1.4 Screen Time & Content moderation Module
A highly event-driven module. Parents use a dashboard to configure a `TimeLimit` schema for each child. On the Child Frontend, a global timer component continually checks the Delta time against the allowed limit. The backend provides secure endpoints that increment the usage counter. When the limit is reached, a WebSocket event or a simple polling boolean triggers the frontend to overlay an un-closable lock screen component over the application, effectively halting digital consumption.

### 4.1.5 Healthcare Provider (Doctor) Module
A segregated workflow dedicated to registered medical professionals. This features a unique dashboard capable of rendering a chronological timeline of appointments. Integrating an intuitive feedback system, when an appointment concludes, the doctor's interface allows submission of structured medical feedback (Symptoms, Diagnosis, Prescriptions). Once committed to the database, this data instantly reflects on the Parent’s timeline view, thereby eliminating paper prescriptions.

## 4.2 PROCESS/ALGORITHM

The development lifecycle adhered to the Agile Methodology, ensuring iterative progress and adaptability to changing requirements (such as the mid-development inclusion of complex Screen Time tracking mechanisms).

**Algorithm: Role-Based Routing Verification (Pseudo-code)**
```text
FUNCTION ValidateRequest(Incoming_Request, Required_Role)
    EXTRACT Token FROM Incoming_Request.Headers.Authorization
    
    IF Token is EMPTY
        RETURN HTTP 401 Unauthorized "No token provided"
    
    TRY
        Decoded_Payload = VerifyJWT(Token, SECRET_KEY)
    CATCH Error
        RETURN HTTP 401 Unauthorized "Invalid or Expired Token"

    User_Record = Database.FindUserById(Decoded_Payload.UserId)
    
    IF User_Record is NULL
        RETURN HTTP 404 Not Found "User no longer exists"

    IF User_Record.Role == Required_Role OR Required_Role == "Any"
        SET Incoming_Request.User = User_Record
        PROCEED TO Next_Middleware_Or_Controller
    ELSE
        RETURN HTTP 403 Forbidden "Access Denied. Insufficient Role Permissions."
END FUNCTION
```

**Algorithm: Growth Percentile Calculation Methodology**
1. Fetch inputted parameters: `childAgeInMonths`, `childGender`, `measuredWeight`, `measuredHeight`.
2. Retrieve standard WHO Data Set Arrays for the specific gender.
3. Locate the closest data node corresponding to `childAgeInMonths`.
4. The node contains standardized L, M, and S parameters (Box-Cox power, Median, Coefficient of variation).
5. Apply the LMS formula: 
   `Z-Score = (((measured / M) ^ L) - 1) / (L * S)`
6. Convert the calculated Z-Score into a percentile ranking using a standard normal cumulative distribution algorithm.
7. Return percentile integer to frontend for display (e.g., "Child is in the 85th percentile for Weight").

---

# 5. IMPLEMENTATION

## 5.1 SAMPLE CODE

*(To fill up to 50-60 pages, extensive blocks of critical implementation code are provided below. These represent the core logic of the diverse modules. In your final printed report, ensure code is printed in a monospaced font like Consolas and properly syntax-highlighted if possible.)*

### 5.1.1 Backend: Authentication & JWT Middleware (Node.js/Express)
```javascript
// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protectRoute = async (req, res, next) => {
    let token;
    // Check if authorization header exists and starts with Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token
            token = req.headers.authorization.split(' ')[1];
            
            // Verify token payload against secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Fetch user from DB, excluding the password field
            req.user = await User.findById(decoded.id).select('-password');
            
            if(!req.user) {
                 return res.status(401).json({ success: false, message: 'User not found.' });
            }
            
            next(); // Move to the next controller
        } catch (error) {
            console.error(error);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token available' });
    }
};

const restrictToRole = (...roles) => {
    return (req, res, next) => {
        // req.user is set by protectRoute middleware
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `User role '${req.user.role}' is not authorized to access this route.`
            });
        }
        next();
    };
};

module.exports = { protectRoute, restrictToRole };
```

### 5.1.2 Backend: Appointment Controller logic
```javascript
// appointmentController.js
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Parent)
exports.bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, timeSlot, reason } = req.body;
        const parentId = req.user._id;

        // Verify if doctor exists and has the correct role
        const doctor = await User.findOne({ _id: doctorId, role: 'Doctor' });
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found or invalid role.' });
        }

        // Check for slot conflict
        const existingAppointment = await Appointment.findOne({ 
            doctor: doctorId, 
            date: date, 
            timeSlot: timeSlot 
        });

        if (existingAppointment) {
            return res.status(400).json({ success: false, message: 'Time slot already booked by another user.' });
        }

        const appointment = await Appointment.create({
            parent: parentId,
            doctor: doctorId,
            date,
            timeSlot,
            reason,
            status: 'Scheduled'
        });

        res.status(201).json({
            success: true,
            data: appointment,
            message: 'Appointment successfully booked.'
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Doctor appending feedback to an appointment 
// @route   PUT /api/appointments/:id/feedback
// @access  Private (Doctor)
exports.addDoctorFeedback = async (req, res) => {
    try {
        const { prescription, doctorNotes, recommendedNextVisit } = req.body;
        
        // Find appointment and ensure it belongs to the requesting doctor
        let appointment = await Appointment.findById(req.params.id);
        
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }
        
        // Ensure requesting user is the doctor assigned to this appointment
        if (appointment.doctor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to modify this appointment' });
        }
        
        appointment.feedback = {
            prescription,
            doctorNotes,
            recommendedNextVisit,
            submittedAt: Date.now()
        };
        appointment.status = 'Completed';

        await appointment.save();

        res.status(200).json({
            success: true,
            data: appointment,
            message: 'Feedback successfully added.'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
```

### 5.1.3 Frontend: Child Screen Time Wrapper Component (React)
```jsx
// ScreenTimeWrapper.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateScreenTimeUsage, lockChildAccount } from '../redux/actions/childActions';

const ScreenTimeWrapper = ({ children }) => {
    const dispatch = useDispatch();
    const { currentProfile, screenTimeConfig } = useSelector(state => state.childAuth);
    const [isLocked, setIsLocked] = useState(false);
    
    useEffect(() => {
        // Verify current lock status upon mounting
        if (screenTimeConfig.usedMinutes >= screenTimeConfig.maxMinutes) {
            setIsLocked(true);
            dispatch(lockChildAccount(currentProfile.id));
            return;
        }

        // Tracking interval - increments every minute (60000 ms)
        const timerInterval = setInterval(() => {
            if (!isLocked) {
                const newUsedTime = screenTimeConfig.usedMinutes + 1;
                
                // Dispatch action to update backend and local state
                dispatch(updateScreenTimeUsage(currentProfile.id, newUsedTime));

                // Check condition
                if (newUsedTime >= screenTimeConfig.maxMinutes) {
                    setIsLocked(true);
                    dispatch(lockChildAccount(currentProfile.id));
                    clearInterval(timerInterval);
                }
            }
        }, 60000);

        return () => clearInterval(timerInterval); // Cleanup on unmount
    }, [screenTimeConfig.usedMinutes, screenTimeConfig.maxMinutes, isLocked, dispatch, currentProfile.id]);

    if (isLocked) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 z-50 absolute w-full top-0 left-0">
                <div className="bg-red-500 rounded-lg p-10 text-center shadow-2xl animate-pulse">
                    <svg className="w-24 h-24 mx-auto text-white mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h1 className="text-4xl font-extrabold text-white tracking-widest">TIME'S UP!</h1>
                    <p className="text-white mt-4 text-xl">You have reached your daily screen time limit.</p>
                    <p className="text-gray-200 mt-2">Please ask your parents to unlock or increase time.</p>
                </div>
            </div>
        );
    }

    // Render child application smoothly if not locked
    return (
        <div className="child-environment-container">
            {/* Visual indicator of remaining time for user experience */}
            <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 shadow-md border-2 border-green-400 font-bold text-gray-700 z-40">
                Time Left: {screenTimeConfig.maxMinutes - screenTimeConfig.usedMinutes} mins
            </div>
            {children}
        </div>
    );
};

export default ScreenTimeWrapper;
```

### 5.1.4 Database Models: Mongoose Schema Example
```javascript
// models/ChildProfile.js
const mongoose = require('mongoose');

const ChildProfileSchema = new mongoose.Schema({
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: {
        type: String,
        required: [true, 'Please add a first name'],
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Please provide date of birth to calculate age']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
        default: 'Unknown'
    },
    childAccessPin: {
        type: String, // Stored as a hash
        select: false 
    },
    screenTimeSettings: {
        dailyLimitMinutes: {
            type: Number,
            default: 60 // Default 1 hour
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    allergies: [String],
    emergencyContacts: [{
        name: String,
        relationship: String,
        phone: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('ChildProfile', ChildProfileSchema);
```

## 5.2 OUTPUT SCREENS

*(Note: In the physical printed report, ensure you take multiple full-screen, high-resolution screenshots of the deployed application. Place one screenshot per page with a detailed caption below it. Use the descriptions below as a guide to generate and caption the screenshots to easily fill 15-20 pages of visual documentation.)*

**Fig 5.2.1: The Landing and Authentication Page**
Provides a robust entry point showcasing secure login fields. It contains dual functionality for Parent login and Medical Professional login, sporting a modern UI with responsive design.

*(Insert full-page screenshot of Login/Registration screen)*

**Fig 5.2.2: Parent Dashboard - Global Navigation**
Displays the holistic overview. The dashboard exhibits widgets such as quick health summaries of all registered children, upcoming vaccination alerts in an interactive calendar view, and a side-navigation menu routing to specific modules (Medical Logs, Appointments, Settings).

*(Insert full-page screenshot of Parent Dashboard)*

**Fig 5.2.3: Medical Records & Growth Chart View**
Shows a detailed graph generated by Chart.js mapping a child's height/weight over months. Below the graph is a tabulated view of recently uploaded hospital bills and vaccination ticks.

*(Insert full-page screenshot of the Data Visualization & Records page)*

**Fig 5.2.4: Doctor Appointment Booking Flow**
Captures the modal or dedicated page where parents select a pediatric specialist from a verified list. It illustrates the dropdown UI for selecting dynamic time slots and inputting the reason for visit.

*(Insert full-page screenshot of Appointment Booking Form)*

**Fig 5.2.5: The Doctor Portal - Viewing Appointments**
Represents the perspective of the medical professional. The screen shows a tabular list of patients for the day, their time slot status (Pending, Completed), and action buttons.

*(Insert full-page screenshot of Doctor Control Panel)*

**Fig 5.2.6: Doctor Feedback and E-Prescription Interface**
Captures the form opened by the doctor after clicking an appointment. Displays text area fields for symptoms, medical diagnosis, and an interactive list maker for prescribing specific medications.

*(Insert full-page screenshot of Doctor Feedback Form)*

**Fig 5.2.7: Child Login via PIN Environment**
Shows a highly simplified, kid-friendly login screen containing large graphical numeric keypads where the child inputs their 4-digit PIN to access their media/learning portal safely.

*(Insert full-page screenshot of Child PIN Login)*

**Fig 5.2.8: Child Media Center & Screen Time Lockout Overlay**
Displays the vibrant Child UI with accessible educational videos. An overlay/popup is captured demonstrating the system successfully intercepting activity once the daily limit parameter triggers the lock mechanism.

*(Insert full-page screenshot of Time Lock screen)*

---

# 6. CONCLUSION & FUTURE SCOPE

## 6.1 CONCLUSION
The Baby Care Management Application successful fulfills the critical requirement of providing a consolidated, reliable, and multi-faceted digital solution connecting parents, children, and pediatricians. By leveraging a robust modern web stack, the system efficiently handles a diverse spectrum of tasks. 

Through dedicated modules, the application guarantees secure storage of highly sensitive data, such as a child’s lifelong medical history and developmental milestones. The successful integration of an intricate Role-Based Access Control (RBAC) ensures logical separation between administrative parent abilities, medical professional access protocols, and restrictive child exploration. The innovation lies in blending rigorous administrative workflows (like booking doctor appointments and handling E-prescriptions) closely with daily behavioral and digital moderation tools (like strict screen time tracking and PIN-locked media access). 

Ultimately, the deployment of this architecture validates that scattered aspects of early-stage parenting and child health supervision can be optimized and centralized, thereby minimizing human error, preventing missed medical schedules, and promoting a controlled, beneficial digital presence for young children.

## 6.2 FUTURE SCOPE
While the initial Phase-II product meets the mandated objectives, several avenues for substantial advancement exist:

1. **Artificial Intelligence & Predictive Health Tracking:** Integrating Machine Learning models to analyze the vast datasets of child growth metrics and task scores to proactively alert parents of developmental delays or exceptional cognitive patterns early on.
2. **Tele-Medicine Video Integration:** Upgrading the Doctor Feedback Portal from a text-based/booking system to utilizing WebRTC for secure, encrypted live video consultations directly through the application browser.
3. **IoT Integration for Smart Care:** Expanding the hardware scope by connecting the backend to smart Internet of Things (IoT) devices, such as smart baby monitors or smart thermometers, auto-logging data without manual parent input.
4. **Mobile Application Porting:** While the current web application is responsive utilizing React, porting the codebase via React Native or Flutter to native iOS and Android ecosystems will allow for critical OS-level push notifications for medicine reminders and offline capability.
5. **Gamification of Learning:** Utilizing advanced animations and point-based reward systems within the child module to augment engagement, making daily tasks and educational milestones inherently interactive.

---

# 7. BIBLIOGRAPHY

1.  **Flanagan, D. (2020).** *JavaScript: The Definitive Guide (7th Edition).* O'Reilly Media. (Provides fundamental insights into ES6+ utilized throughout the MERN stack).
2.  **Banks, A. & Porcello, E. (2020).** *Learning React: Modern Patterns for Developing React Apps.* O'Reilly Media. (Referenced for implementing React Hooks, Context API, and state management techniques necessary for the complex Parent/Child UI rendering).
3.  **Haverbeke, M. (2018).** *Eloquent JavaScript: A Modern Introduction to Programming.* No Starch Press.
4.  **Chodorow, K. (2013).** *MongoDB: The Definitive Guide.* O'Reilly Media. (Crucial for designing NoSQL document schemas suitable for variable health records).
5.  **Brown, E. (2019).** *Web Development with Node and Express: Leveraging the JavaScript Stack.* O'Reilly Media. (Referenced for constructing robust middleware, RESTful API endpoints, and secure routing).
6.  **Official Documentation:**
    *   **React Documentation:** https://reactjs.org/docs/getting-started.html
    *   **Node.js API Reference:** https://nodejs.org/api/
    *   **Express.js API Reference:** https://expressjs.com/
    *   **Mongoose Documentation:** https://mongoosejs.com/docs/guide.html
    *   **JSON Web Tokens (JWT) Industry Standards:** https://jwt.io/introduction/
