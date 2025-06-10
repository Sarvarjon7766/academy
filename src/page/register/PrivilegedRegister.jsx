import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrivilegedRegister = ({ subjects, additionalSubjects }) => {
    const [formData, setFormData] = useState({
        mainSubject1: '',
        mainSubject1Payment: 0,
        mainSubject2: '',
        mainSubject2Payment: 0,
        additionalSubjects: [],
    });
    const [privilegedSubjects, setPrivilegedSubjects] = useState([]);
    const [selectedPrivilegedSubjects, setSelectedPrivilegedSubjects] = useState([]);
    const [privilegedSubTotal, setPrivilegedSubTotal] = useState(0);

    useEffect(() => {
        const fetchPrivilegedSubjects = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/privilegedsubjects`);
                setPrivilegedSubjects(res.data.privilegedSubjects);
            } catch (error) {
                console.error('Error fetching privileged subjects:', error);
            }
        };
        fetchPrivilegedSubjects();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePaymentChange = (e, subjectName) => {
        const { value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [`${subjectName}Payment`]: parseFloat(value) || 0,
        }));
    };

    const handlePrivilegedSubjectsChange = (e, price, subjectName) => {
        const { checked, value } = e.target;
        setFormData((prevData) => {
            const updatedSubjects = checked
                ? [...prevData.additionalSubjects, { name: value, price }]
                : prevData.additionalSubjects.filter((subj) => subj.name !== value);
            return { ...prevData, additionalSubjects: updatedSubjects };
        });
    };

    useEffect(() => {
        const total = selectedPrivilegedSubjects.reduce((sum, subj) => sum + subj.price, 0);
        setPrivilegedSubTotal(total);
    }, [selectedPrivilegedSubjects]);

    // To handle form submission and create a final object
    const handleSubmit = () => {
        const finalData = {
            ...formData,
            totalPayment: formData.mainSubject1Payment + formData.mainSubject2Payment + privilegedSubTotal,
        };
        console.log("Form Data: ", finalData);
    };

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="w-full">
                    <label className="flex text-lg text-indigo-700 pt-4 font-semibold">Asosiy fan 1</label>
                    <select
                        name="mainSubject1"
                        value={formData.mainSubject1}
                        onChange={handleChange}
                        className="w-full p-2 outline-indigo-700 border rounded mt-2"
                    >
                        <option value="">Fanni tanlang</option>
                        {subjects?.length > 0 ? (
                            subjects.map((subject, index) => (
                                <option key={index} value={subject.subjectName}>
                                    {subject.subjectName}
                                </option>
                            ))
                        ) : (
                            <option disabled>Fanlar yuklanmoqda...</option>
                        )}
                    </select>
                    {formData.mainSubject1 && (
                        <div className="mt-2">
                            <label className="text-indigo-700">To'lov summasi</label>
                            <input
                                type="number"
                                name="mainSubject1Payment"
                                value={formData.mainSubject1Payment}
                                onChange={(e) => handlePaymentChange(e, 'mainSubject1')}
                                className="w-full p-2 outline-indigo-700 border rounded mt-2"
                            />
                        </div>
                    )}
                </div>

                <div className="w-full">
                    <label className="flex text-lg text-indigo-700 pt-4 font-semibold">Asosiy fan 2</label>
                    <select
                        name="mainSubject2"
                        value={formData.mainSubject2}
                        onChange={handleChange}
                        className="w-full p-2 outline-indigo-700 border rounded mt-2"
                    >
                        <option value="">Fanni tanlang</option>
                        {subjects?.length > 0 ? (
                            subjects.map((subject, index) => (
                                <option key={index} value={subject.subjectName}>
                                    {subject.subjectName}
                                </option>
                            ))
                        ) : (
                            <option disabled>Fanlar yuklanmoqda...</option>
                        )}
                    </select>
                    {formData.mainSubject2 && (
                        <div className="mt-2">
                            <label className="text-indigo-700">To'lov summasi</label>
                            <input
                                type="number"
                                name="mainSubject2Payment"
                                value={formData.mainSubject2Payment}
                                onChange={(e) => handlePaymentChange(e, 'mainSubject2')}
                                className="w-full p-2 outline-indigo-700 border rounded mt-2"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4">
                <label className="block text-lg text-indigo-700 font-semibold">Qo'shincha fanlar</label>
                <div className="flex gap-4 flex-wrap">
                    {additionalSubjects.map((subject, index) => (
                        <label key={index} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="additionalSubjects"
                                value={subject.name}
                                onChange={(e) => handlePrivilegedSubjectsChange(e, subject.price, subject.name)}
                            />
                            {subject.name}
                            {formData.additionalSubjects.some((subj) => subj.name === subject.name) && (
                                <input
                                    type="number"
                                    value={formData.additionalSubjects.find((subj) => subj.name === subject.name)?.price || 0}
                                    onChange={(e) => handlePaymentChange(e, subject.name)}
                                    className="w-24 p-2 outline-indigo-700 border rounded mt-2"
                                />
                            )}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PrivilegedRegister;
