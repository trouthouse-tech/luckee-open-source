import type { AppThunk } from '../../store';
import { getAllProjects } from '@/src/api/projects';
import { ProjectsActions } from '../../dumps/projects';
import { ProjectBuilderActions } from '../../builders/projectBuilder';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllProjectsThunk = (userId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      dispatch(ProjectBuilderActions.setIsLoading(true));
      dispatch(ProjectBuilderActions.setErrorMessage(null));

      const response = await getAllProjects(userId);

      if (response.success && response.data) {
        dispatch(ProjectsActions.setProjects(response.data));
        dispatch(ProjectBuilderActions.setIsLoading(false));
        return 200;
      }

      if (
        response.error?.includes('not available yet') ||
        response.error?.includes('not found')
      ) {
        dispatch(ProjectsActions.setProjects([]));
        dispatch(ProjectBuilderActions.setIsLoading(false));
        return 200;
      }

      dispatch(
        ProjectBuilderActions.setErrorMessage(
          response.error || 'Failed to get projects'
        )
      );
      dispatch(ProjectBuilderActions.setIsLoading(false));
      return 400;
    } catch (error: unknown) {
      console.error('❌ getAllProjectsThunk error:', error);
      dispatch(
        ProjectBuilderActions.setErrorMessage(
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
      dispatch(ProjectBuilderActions.setIsLoading(false));
      return 500;
    }
  };
};
