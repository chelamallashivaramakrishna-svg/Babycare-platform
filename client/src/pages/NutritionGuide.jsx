import React from 'react';
import { Apple, Droplet, Fish, Wheat } from 'lucide-react';
import { motion } from 'framer-motion';

const NutritionGuide = () => {
    const ageGroups = [
        {
            age: "0 - 6 Months",
            calories: "About 400-500 kcal/day (from milk/formula only)",
            protein: "9g/day",
            focus: "Breast milk or iron-fortified formula exclusively. No solid foods.",
            items: ["Breast milk", "Infant formula"],
            icon: <Droplet className="text-blue-500 w-8 h-8" />
        },
        {
            age: "6 - 12 Months",
            calories: "700 - 800 kcal/day",
            protein: "11g/day",
            focus: "Introduce varying textures. Iron and Zinc are critical.",
            items: ["Pureed meats/poultry", "Iron-fortified infant cereals", "Mashed vegetables (sweet potato, squash)", "Mashed fruits (banana, avocado)"],
            icon: <Apple className="text-red-500 w-8 h-8" />
        },
        {
            age: "1 - 3 Years (Toddlers)",
            calories: "1,000 - 1,400 kcal/day",
            protein: "13g/day",
            focus: "Transition to family foods. Calcium and Vitamin D are important for bone growth.",
            items: ["Whole milk", "Cheese/Yogurt", "Scrambled eggs", "Soft fruits (berries, melons)", "Cooked grains/pasta", "Finely chopped meats"],
            icon: <Wheat className="text-yellow-600 w-8 h-8" />
        },
        {
            age: "4 - 8 Years",
            calories: "1,200 - 1,800 kcal/day",
            protein: "19g/day",
            focus: "Balanced diet across all food groups. Encourage trying new vegetables.",
            items: ["Lean meats/chicken", "Fish (salmon, tuna)", "Beans and lentils", "Whole grain bread/cereals", "Variety of colored vegetables", "Low-fat dairy"],
            icon: <Fish className="text-orange-500 w-8 h-8" />
        }
    ];

    const proteinSources = [
        { name: "Egg (1 large)", amount: "6g protein" },
        { name: "Whole Milk (1 cup)", amount: "8g protein" },
        { name: "Chicken Breast (3 oz)", amount: "26g protein" },
        { name: "Greek Yogurt (1 cup)", amount: "20g protein" },
        { name: "Lentils (1/2 cup cooked)", amount: "9g protein" },
        { name: "Peanut Butter (2 tbsp)", amount: "7g protein" },
        { name: "Cottage Cheese (1/2 cup)", amount: "14g protein" },
        { name: "Almonds (1/4 cup)", amount: "7g protein" },
        { name: "Oats (1 cup cooked)", amount: "6g protein" },
        { name: "Turkey Breast (3 oz)", amount: "24g protein" },
        { name: "Edamame (1 cup)", amount: "17g protein" },
        { name: "Salmon (3 oz)", amount: "17g protein" },
        { name: "Quinoa (1 cup cooked)", amount: "8g protein" },
        { name: "Black Beans (1/2 cup cooked)", amount: "8g protein" },
        { name: "Tofu (1/2 cup firm)", amount: "10g protein" },
        { name: "Pumpkin Seeds (1 oz)", amount: "7g protein" },
        { name: "String Cheese (1 piece)", amount: "6g protein" }
    ];

    const weeklyPlan = [
        {
            day: "Monday",
            breakfast: "Oatmeal with mashed banana and a sprinkle of chia seeds",
            lunch: "Whole wheat pasta with hidden vegetable tomato sauce",
            evening: "Apple slices with a small amount of peanut butter",
            dinner: "Baked salmon, sweet potato mash, and steamed peas"
        },
        {
            day: "Tuesday",
            breakfast: "Scrambled eggs with a slice of whole grain toast",
            lunch: "Chicken and vegetable soup with whole grain crackers",
            evening: "Greek yogurt with a handful of mixed berries",
            dinner: "Turkey meatballs with quinoa and steamed broccoli"
        },
        {
            day: "Wednesday",
            breakfast: "Whole wheat pancakes topped with sliced strawberries",
            lunch: "Lentil soup with a side of mixed fruit salad",
            evening: "A small handful of almonds and walnuts (crushed for toddlers)",
            dinner: "Grilled chicken breast, brown rice, and roasted carrots"
        },
        {
            day: "Thursday",
            breakfast: "Greek yogurt parfait with layers of fruit and oats",
            lunch: "Mini whole wheat pita pizzas with veggie toppings",
            evening: "Carrot sticks with hummus dip",
            dinner: "Baked white fish, couscous, and green beans"
        },
        {
            day: "Friday",
            breakfast: "Smoothie (spinach, banana, milk, and flaxseed)",
            lunch: "Cheese and spinach quesadilla on a whole wheat tortilla",
            evening: "Sliced cucumber and cherry tomatoes (halved)",
            dinner: "Homemade chicken nuggets (baked), potato wedges, and corn"
        },
        {
            day: "Saturday",
            breakfast: "Boiled egg, avocado slices, and toast strips",
            lunch: "Vegetable fried rice with scrambled egg bits",
            evening: "A piece of seasonal fresh fruit (e.g., orange or melon)",
            dinner: "Mild beef or turkey chili with hidden veggies"
        },
        {
            day: "Sunday",
            breakfast: "Whole grain cereal with milk and blueberries",
            lunch: "Turkey and cheese roll-ups with a side of grapes (halved)",
            evening: "A handful of mixed dry fruits (raisins, dates, apricots)",
            dinner: "Roast chicken, mashed potatoes, and roasted zucchini"
        }
    ];

    const healthyHabits = [
        "Hydration is key: Offer water frequently throughout the day, especially after playtime.",
        "Limit added sugars: Avoid sugary drinks, sodas, and excess sweets.",
        "Eat the rainbow: Encourage fruits and vegetables of different colors.",
        "Family meals: Eating together promotes healthy eating habits and social skills.",
        "Don't force feeding: Let the child decide how much to eat; you decide what, when, and where.",
        "Incorporate dry fruits: Almonds, walnuts, cashews, and dates are great for brain development (serve crushed/powdered for under 3s to avoid choking)."
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 max-w-7xl mx-auto py-8">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-center flex justify-center items-center gap-3">
                <span className="bg-primary/20 text-primary p-2 rounded-xl">🥗</span> Child Nutrition & Diet Guide
            </h1>
            <p className="text-center text-muted-foreground font-medium mb-12">Ages 0 to 8 Years - Comprehensive Dietary Guidelines</p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {ageGroups.map((group, idx) => (
                    <motion.div whileHover={{ scale: 1.02 }} key={idx} className="glass-panel rounded-2xl p-6 border border-l-4 border-l-primary transition-all hover:-translate-y-1">
                        <div className="flex items-center mb-6">
                            <div className="bg-muted p-3 rounded-full mr-4 shadow-inner">{group.icon}</div>
                            <h2 className="text-2xl font-extrabold">{group.age}</h2>
                        </div>
                        <div className="space-y-4 text-sm font-medium">
                            <p className="bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/5 px-4 py-3 rounded-xl flex justify-between shadow-sm">
                                <span className="font-bold text-muted-foreground uppercase tracking-wide text-xs">Daily Calories:</span>
                                <span className="font-bold">{group.calories}</span>
                            </p>
                            <p className="bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/5 px-4 py-3 rounded-xl flex justify-between shadow-sm">
                                <span className="font-bold text-muted-foreground uppercase tracking-wide text-xs">Daily Protein:</span>
                                <span className="font-bold">{group.protein}</span>
                            </p>
                            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                                <p className="font-bold text-primary mb-1">Primary Focus:</p>
                                <p className="text-sm font-semibold">{group.focus}</p>
                            </div>
                            <div>
                                <span className="font-bold text-muted-foreground uppercase tracking-wide text-xs block mb-2">Recommended Foods:</span>
                                <ul className="list-disc pl-5 mt-1 space-y-1.5 text-card-foreground font-semibold">
                                    {group.items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-panel bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-3xl p-6 md:p-8 border-blue-200/50 dark:border-blue-800/30 mb-12 relative overflow-hidden">
                <h2 className="text-2xl font-extrabold mb-8 text-blue-800 dark:text-blue-300 flex items-center justify-center gap-3">
                    <span className="bg-blue-200 dark:bg-blue-800/40 p-2 rounded-xl"><Fish className="text-blue-600 dark:text-blue-400" /></span> High-Protein Sources
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {proteinSources.map((source, idx) => (
                        <motion.div whileHover={{ y: -5 }} key={idx} className="glass-panel p-4 rounded-2xl transition-all flex flex-col items-center justify-center text-center h-full">
                            <span className="font-bold text-sm mb-2">{source.name}</span>
                            <span className="text-blue-600 dark:text-blue-400 font-extrabold bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-lg text-xs tracking-wider uppercase">{source.amount}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-center flex items-center justify-center gap-3">
                    <span className="bg-green-100 dark:bg-green-900/40 text-green-600 p-2 rounded-xl">📅</span> Weekly Sample Diet Plan
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {weeklyPlan.map((dayPlan, idx) => (
                        <motion.div whileHover={{ scale: 1.03 }} key={idx} className="glass-panel rounded-2xl p-6 hover:border-green-400 dark:hover:border-green-500 transition-all flex flex-col h-full">
                            <h3 className="text-xl font-extrabold text-green-600 dark:text-green-400 mb-4 pb-3 border-b border-border/50 flex justify-between items-center">
                                {dayPlan.day}
                                <span className="opacity-50 font-normal text-sm">Diet</span>
                            </h3>
                            <ul className="space-y-4 text-sm font-medium flex-1">
                                <li className="bg-muted/40 p-3 rounded-xl border border-dashed"><strong className="block text-primary text-xs uppercase tracking-wider mb-1">🌤️ Morning</strong> {dayPlan.breakfast}</li>
                                <li className="bg-muted/40 p-3 rounded-xl border border-dashed"><strong className="block text-primary text-xs uppercase tracking-wider mb-1">☀️ Afternoon</strong> {dayPlan.lunch}</li>
                                <li className="bg-muted/40 p-3 rounded-xl border border-dashed"><strong className="block text-primary text-xs uppercase tracking-wider mb-1">🌆 Evening</strong> {dayPlan.evening}</li>
                                <li className="bg-muted/40 p-3 rounded-xl border border-dashed"><strong className="block text-primary text-xs uppercase tracking-wider mb-1">🌙 Night</strong> {dayPlan.dinner}</li>
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-panel bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/20 dark:to-transparent rounded-3xl p-6 md:p-8 border-green-200/50 dark:border-green-800/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl">🥑</div>
                <h2 className="text-2xl font-extrabold mb-6 text-green-800 dark:text-green-300 flex items-center gap-3 relative z-10">
                    <span className="bg-green-200 dark:bg-green-800/40 p-2 rounded-xl">💚</span> Healthy Food Habits
                </h2>
                <ul className="list-disc pl-5 space-y-3 text-green-900 dark:text-green-100 font-medium relative z-10 columns-1 sm:columns-2 gap-8">
                    {healthyHabits.map((habit, idx) => (
                        <li key={idx} className="mb-2 break-inside-avoid">{habit}</li>
                    ))}
                </ul>
            </motion.div>

            <p className="text-xs text-center text-muted-foreground font-bold mt-10 mb-4 bg-muted/50 p-4 rounded-xl max-w-2xl mx-auto border border-dashed">
                Note: These are general guidelines. Always consult your pediatrician or a registered dietitian for personalized advice.
            </p>
        </motion.div>
    );
};

export default NutritionGuide;
