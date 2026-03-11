import React, { useState, useContext } from 'react';
import { FamilyContext } from '../context/FamilyContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Calendar, Activity, Droplet, ShieldAlert, Key, Monitor, ArrowLeft } from 'lucide-react';

const AddChild = () => {
    const { addChild } = useContext(FamilyContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        gender: 'male',
        bloodGroup: '',
        allergies: '',
        pin: '',
        screenTimeLimit: 60,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const result = await addChild(formData);
        setIsSubmitting(false);
        if (result.success) {
            navigate('/dashboard');
        } else {
            alert(result.message);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="max-w-3xl mx-auto mt-8 mb-16 p-4 md:p-8 glass-panel rounded-3xl relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>

            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm font-semibold text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
                <ArrowLeft size={16} className="mr-1" /> Back
            </button>

            <div className="flex items-center gap-3 mb-8">
                <div className="bg-primary/10 text-primary p-3 rounded-2xl">
                    <UserPlus size={28} />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Add Child Profile</h2>
                    <p className="text-muted-foreground font-medium">Create a new profile to track health, milestones, and media.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2 text-foreground">
                            <span className="text-blue-500"><UserPlus size={16} /></span> Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Baby's name"
                            className="w-full bg-background border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* DOB */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2 text-foreground">
                            <span className="text-purple-500"><Calendar size={16} /></span> Date of Birth
                        </label>
                        <input
                            type="date"
                            name="dob"
                            required
                            className="w-full bg-background border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            value={formData.dob}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2 text-foreground">
                            <span className="text-pink-500"><Activity size={16} /></span> Gender
                        </label>
                        <select
                            name="gender"
                            className="w-full bg-background border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Blood Group */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2 text-foreground">
                            <span className="text-red-500"><Droplet size={16} /></span> Blood Group
                        </label>
                        <input
                            type="text"
                            name="bloodGroup"
                            placeholder="e.g. O+, A-"
                            className="w-full bg-background border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            value={formData.bloodGroup}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Allergies */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2 text-foreground">
                            <span className="text-orange-500"><ShieldAlert size={16} /></span> Allergies
                        </label>
                        <input
                            type="text"
                            name="allergies"
                            placeholder="Comma separated (e.g. Peanuts, Dairy)"
                            className="w-full bg-background border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            value={formData.allergies}
                            onChange={handleChange}
                        />
                    </div>

                    {/* PIN */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2 text-foreground">
                            <span className="text-indigo-500"><Key size={16} /></span> Child Login PIN
                        </label>
                        <input
                            type="password"
                            name="pin"
                            maxLength="4"
                            required
                            placeholder="4-digit PIN for Media Center"
                            className="w-full bg-background border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            value={formData.pin}
                            onChange={handleChange}
                        />
                        <p className="text-xs text-muted-foreground font-medium">Used by the child to log in to the App/Media Center.</p>
                    </div>

                    {/* Screen Time Limit */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2 text-foreground">
                            <span className="text-green-500"><Monitor size={16} /></span> Screen Time Limit
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                name="screenTimeLimit"
                                min="0"
                                required
                                className="w-full bg-background border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                value={formData.screenTimeLimit}
                                onChange={handleChange}
                            />
                            <span className="text-sm font-bold text-muted-foreground shrink-0">minutes</span>
                        </div>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-8 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                            Processing...
                        </>
                    ) : (
                        <>Save Child Profile ✨</>
                    )}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default AddChild;
