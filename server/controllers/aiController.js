const Child = require('../models/Child');
const { GoogleGenAI } = require('@google/genai');

// @desc    Get Chatbot Response (Powered by Gemini or Simulated)
// @route   POST /api/ai/chat
// @access  Private
const askChatbot = async (req, res) => {
    try {
        const { question } = req.body;
        const role = req.user ? req.user.role : 'Guest';

        if (!process.env.GEMINI_API_KEY) {
            // Simulated fallback if no API key is provided
            console.log("No GEMINI_API_KEY found, returning simulated response.");
            let answer = "I'm a simulated AI because the `GEMINI_API_KEY` is missing from the `.env` file! Please configure it for real responses. \n\nHowever, here is a helpful simulated tip: It's best to consult a pediatrician if you have concerns.";
            const lowerQ = question.toLowerCase();

            if (role === 'Child') {
                answer = "Hi! 🎈 I'm a simulated AI helper! You need an API key to talk to the real me. Have fun playing games! 🎮";
            } else {
                if (lowerQ.includes('fever') || lowerQ.includes('temp')) {
                    answer = "**Simulated Advice:** For a fever over 100.4°F (38°C) in a baby under 3 months, call a doctor immediately. For older babies, keep them hydrated and monitor behavior. Use acetaminophen if advised by your doctor.";
                } else if (lowerQ.includes('feed') || lowerQ.includes('eat') || lowerQ.includes('milk')) {
                    answer = "**Simulated Advice:** Newborns typically feed every 2-3 hours. By 6 months, you can start introducing solids while continuing breast milk or formula.";
                } else if (lowerQ.includes('sleep') || lowerQ.includes('awake')) {
                    answer = "**Simulated Advice:** Newborns sleep 14-17 hours a day. Establishing a bedtime routine (bath, book, bed) can help improve sleep quality.";
                }
            }

            // Simulate parsing delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            return res.json({ answer });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        let systemInstruction = "You are a helpful and caring AI assistant for a Baby Care Management Application. ";

        if (role === 'Parent') {
            systemInstruction += "You are talking to a Parent. Provide helpful, reassuring, and practical advice regarding child care, development, and app usage. Keep your answers concise and formatted with markdown bullet points if helpful.";
        } else if (role === 'Child') {
            systemInstruction += "You are talking to a Child using the app's GameSpace. Be extremely friendly, enthusiastic, safe, and use simple language. Use emojis! Encourage them to learn and play.";
        } else if (role === 'Doctor' || role === 'Support') {
            systemInstruction += "You are talking to a Doctor or Support staff. Provide concise, professional, and clinical information where appropriate.";
        } else {
            systemInstruction += "Keep your answers helpful and concise.";
        }

        const prompt = `${systemInstruction}\n\nUser Question: ${question}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ answer: response.text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ answer: "I'm sorry, I'm having trouble connecting to my AI brain right now." });
    }
};

// @desc    Get Health Predictions & Insights
// @route   GET /api/ai/predict/:childId
// @access  Private
const getHealthPredictions = async (req, res) => {
    try {
        const child = await Child.findById(req.params.childId).populate('healthRecords');

        if (!child) {
            return res.status(404).json({ message: 'Child not found' });
        }

        // Simulated AI Analysis
        const insights = [];
        const predictions = [];

        // 1. Growth Analysis
        const recentWeight = child.healthRecords.length > 0 ? child.healthRecords[child.healthRecords.length - 1].weight : null;
        if (recentWeight) {
            if (recentWeight < 5) { // Arbitrary low weight for demo
                insights.push({ type: 'warning', text: "Weight is slightly below average for age group. Increase feeding frequency." });
            } else {
                insights.push({ type: 'success', text: "Weight gain tracking normally (50th percentile)." });
            }
        } else {
            insights.push({ type: 'info', text: "No weight records found. Add a health record to get growth insights." });
        }

        // 2. Vaccination Analysis (Mock)
        const ageInMonths = (new Date() - new Date(child.dateOfBirth)) / (1000 * 60 * 60 * 24 * 30.44);
        if (ageInMonths > 2 && child.healthRecords.length < 2) {
            predictions.push({ type: 'alert', text: "Likely due for 2-month vaccinations (DTaP, Polio, Hib)." });
        }

        // 3. Seasonal Health Prediction (Mock)
        const currentMonth = new Date().getMonth();
        if (currentMonth >= 9 || currentMonth <= 2) { // Winter months
            predictions.push({ type: 'info', text: "Flu season active. Monitor for respiratory symptoms." });
        }

        res.json({ insights, predictions });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { askChatbot, getHealthPredictions };
