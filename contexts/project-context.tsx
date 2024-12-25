'use client'

import React, {createContext, useContext} from 'react';
import {Project} from "@/types";

const ProjectContext = createContext<Project | null>(null);

export const ProjectProvider = ({children, value}: { children: React.ReactNode, value: Project | null }) => (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
);

export const useProject = () => useContext(ProjectContext);

