'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/src/store/hooks';
import { formatDateMedium } from '@/src/utils/date-time/formatDateMedium';
import { getCustomerName } from '@/src/utils/customer';
import type { Project } from '@/src/model/project';

/**
 * Card displaying project name, customer, color, active, and timestamps.
 * Reads current project from Redux (currentProjectDetail.projectId + projects, customers).
 */
export const ProjectDetailsCard = () => {
  const currentProjectId = useAppSelector((state) => state.currentProjectDetail.projectId);
  const projects = useAppSelector((state) => state.projects);
  const customers = useAppSelector((state) => state.customers);

  const project = useMemo((): Project | null => {
    if (!currentProjectId) return null;
    return projects[currentProjectId] ?? null;
  }, [currentProjectId, projects]);

  if (!project) {
    return null;
  }

  const customerName = getCustomerName(customers, project.customer_id);

  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <div className={styles.cell}>
          <span className={styles.label}>Name</span>
          <span className={styles.value}>{project.name}</span>
        </div>
        <div className={styles.cell}>
          <span className={styles.label}>Customer</span>
          <span className={styles.value}>{customerName}</span>
        </div>
        <div className={styles.cell}>
          <span className={styles.label}>Color</span>
          <span
            className={styles.colorSwatch}
            style={{ backgroundColor: project.color }}
            title={project.color}
          />
          <span className={styles.colorText}>{project.color}</span>
        </div>
        <div className={styles.cell}>
          <span className={styles.label}>Active</span>
          <span className={`${styles.badge} ${project.is_active ? styles.activeBadge : styles.inactiveBadge}`}>
            {project.is_active ? 'Yes' : 'No'}
          </span>
        </div>
        <div className={styles.cell}>
          <span className={styles.label}>Created</span>
          <span className={styles.value}>{formatDateMedium(project.created_at)}</span>
        </div>
        <div className={styles.cell}>
          <span className={styles.label}>Updated</span>
          <span className={styles.value}>{formatDateMedium(project.updated_at)}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: `
    bg-white border border-gray-200 rounded p-4
  `,
  row: `
    flex flex-wrap items-center gap-x-8 gap-y-3
  `,
  cell: `
    flex items-center gap-2
  `,
  label: `
    text-xs font-medium text-gray-500
  `,
  value: `
    text-sm font-medium text-gray-900
  `,
  colorSwatch: `
    inline-block w-4 h-4 rounded border border-gray-300 align-middle mr-2
  `,
  colorText: `
    text-gray-600
  `,
  badge: `
    inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium
  `,
  activeBadge: `
    bg-green-100 text-green-800
  `,
  inactiveBadge: `
    bg-gray-100 text-gray-600
  `,
};
