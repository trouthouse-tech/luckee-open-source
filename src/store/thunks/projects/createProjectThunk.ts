import type { AppThunk } from '../../store';
import { createProject } from '@/src/api/projects';
import type { Project } from '@/src/model';
import { ProjectsActions } from '../../dumps/projects';
import { CurrentProjectActions } from '../../current/currentProject';
import { ProjectBuilderActions } from '../../builders/projectBuilder';

type ResponseType = Promise<200 | 400 | 500>;

export const createProjectThunk = (
  payload: Omit<Project, 'id' | 'created_at' | 'updated_at'>
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      dispatch(ProjectBuilderActions.setIsSaving(true));
      dispatch(ProjectBuilderActions.setErrorMessage(null));

      const response = await createProject(payload);

      if (response.success && response.data) {
        dispatch(ProjectsActions.addProject(response.data));
        dispatch(CurrentProjectActions.setCurrentProject(response.data));
        dispatch(ProjectBuilderActions.setIsSaving(false));
        dispatch(ProjectBuilderActions.closeCreateModal());
        return 200;
      }

      dispatch(
        ProjectBuilderActions.setErrorMessage(
          response.error || 'Failed to create project'
        )
      );
      dispatch(ProjectBuilderActions.setIsSaving(false));
      return 400;
    } catch (error: unknown) {
      console.error('❌ createProjectThunk error:', error);
      dispatch(
        ProjectBuilderActions.setErrorMessage(
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
      dispatch(ProjectBuilderActions.setIsSaving(false));
      return 500;
    }
  };
};
