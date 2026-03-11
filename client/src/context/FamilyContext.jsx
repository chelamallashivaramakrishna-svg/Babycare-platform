import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const FamilyContext = createContext();

export const FamilyProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [family, setFamily] = useState(null);
    const [childrenList, setChildrenList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFamily = async () => {
        try {
            if (!user || user.role === 'doctor') {
                setLoading(false);
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get('/api/family', config);
            setFamily(data);
            if (data) {
                // Fetch children? Family object has children populated usually?
                // familyController.js's getFamily does .populate('children')
                if (data.children) {
                    setChildrenList(data.children);
                }
            }
        } catch (error) {
            console.error('Error fetching family:', error);
            // If 404, user has no family
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFamily();
    }, [user]);

    const createFamily = async (name) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post('/api/family', { name }, config);
            setFamily(data);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to create family' };
        }
    };

    const addChild = async (childData) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            // We need familyId to add child. 
            // API expects familyId in body.
            const payload = { ...childData, familyId: family._id };

            const { data } = await axios.post('/api/children', payload, config);
            setChildrenList([...childrenList, data]);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to add child' };
        }
    };

    return (
        <FamilyContext.Provider value={{ family, childrenList, createFamily, addChild, loading, fetchFamily }}>
            {children}
        </FamilyContext.Provider>
    );
};
