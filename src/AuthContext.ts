import React, {createContext, SetStateAction} from 'react';

const initialContextState = {
    data: false,
    date: new Date(),
    setDate: () => {},
};


export interface AuthContextType {
    data: boolean, // Replace 'any' with the actual data type
    date: Date,
    setDate: React.Dispatch<SetStateAction<Date>>
}

export const AuthContext = createContext<AuthContextType | null>(initialContextState);


