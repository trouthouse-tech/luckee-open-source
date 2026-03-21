import type { AppThunk } from '../../store';
import { CurrentProjectDetailActions } from '../../current/currentProjectDetail';

/**
 * Set current project for detail view.
 * Detail page reads the full project from state.projects by this id.
 */
export const setCurrentProjectDetailThunk = (projectId: string): AppThunk<void> => {
  return (dispatch): void => {
    dispatch(CurrentProjectDetailActions.setCurrentProjectDetail(projectId));
  };
};
