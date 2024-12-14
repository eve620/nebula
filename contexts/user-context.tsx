'use client'

import React, {createContext, useContext} from 'react';
import {User} from "@/types";

const UserContext = createContext<User | null>(null);

export const UserProvider = ({children, value}: { children: React.ReactNode, value: User | null }) => (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
);

export const useUser = () => useContext(UserContext);

