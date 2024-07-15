"use client"
import { createContext, useContext, useState } from "react";

const DurandContext = createContext();

export const DurandProvider = ({ children }) => {
    const [durandData, setDurandData] = useState([]);

    const setData = (data) => {
        setDurandData(data);
    };

    const appendData = (append) => {
        setDurandData(prevData => [...(Array.isArray(prevData) ? prevData : []), append]);
    }

    return (
        <DurandContext.Provider value={{ durandData, setData, appendData }}>
            {children}
        </DurandContext.Provider>
    );
};

export const useDurand = () => useContext(DurandContext);