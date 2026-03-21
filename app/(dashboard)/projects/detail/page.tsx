'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { AppLayout } from '@/src/components';
import { ProjectDetail } from '@/src/packages/project-detail';
import { setCurrentProjectDetailThunk } from '@/src/store/thunks/projects';

/**
 * Project Detail Page Route
 * Breadcrumbs: Projects / [project name] with dropdown to switch projects.
 */
export default function ProjectDetailPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentProjectId = useAppSelector((state) => state.currentProjectDetail.projectId);
  const projects = useAppSelector((state) => state.projects);

  const project = useMemo(() => {
    if (!currentProjectId) return null;
    return projects[currentProjectId] ?? null;
  }, [currentProjectId, projects]);

  const projectList = useMemo(
    () => Object.values(projects).sort((a, b) => a.name.localeCompare(b.name)),
    [projects],
  );

  const breadcrumbs = useMemo(
    () =>
      project
        ? [
            {
              label: project.name,
              menuItems: projectList.map((p) => ({
                label: p.name,
                onSelect: () => dispatch(setCurrentProjectDetailThunk(p.id)),
                isActive: p.id === currentProjectId,
              })),
            },
          ]
        : [],
    [project, projectList, currentProjectId, dispatch],
  );

  const baseBreadcrumbOverride = useMemo(
    () => ({ label: 'Projects', href: '/projects' }),
    [],
  );

  useEffect(() => {
    if (!currentProjectId) {
      router.replace('/projects');
    }
  }, [currentProjectId, router]);

  return (
    <AppLayout
      baseBreadcrumbOverride={baseBreadcrumbOverride}
      breadcrumbs={breadcrumbs}
    >
      <ProjectDetail />
    </AppLayout>
  );
}
