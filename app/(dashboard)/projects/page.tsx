'use client';

import { ProjectsList } from '@/src/packages/projects';
import { AppLayout } from '@/src/components';

export default function ProjectsPage() {
  return (
    <AppLayout>
      <ProjectsList />
    </AppLayout>
  );
}
