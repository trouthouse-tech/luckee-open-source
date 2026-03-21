import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Project } from '@/src/model';

type ProjectsState = {
  [key: string]: Project;
};

const initialState: ProjectsState = {};

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (_state, action: PayloadAction<Project[]>) => {
      const normalized: ProjectsState = {};
      action.payload.forEach((project) => {
        normalized[project.id] = project;
      });
      return normalized;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state[action.payload.id] = action.payload;
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      if (state[action.payload.id]) {
        state[action.payload.id] = action.payload;
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const ProjectsActions = projectsSlice.actions;
export default projectsSlice.reducer;
