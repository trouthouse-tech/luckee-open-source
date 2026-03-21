'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { setCurrentProjectDetailThunk } from '@/src/store/thunks/projects';
import type { Project } from '@/src/model';

export const ProjectsList = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects);
  const customers = useAppSelector((state) => state.customers);
  const projectsArray = useMemo(() => Object.values(projects), [projects]);

  const handleRowClick = (project: Project) => {
    dispatch(setCurrentProjectDetailThunk(project.id));
    router.push('/projects/detail');
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getCustomerName = (customerId: string | null) => {
    if (!customerId) return '—';
    return customers[customerId]?.name ?? customerId;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.tableTitle}>
          {projectsArray.length > 0
            ? `${projectsArray.length} project${projectsArray.length === 1 ? '' : 's'}`
            : 'Projects'}
        </h3>
      </div>
      <div className={styles.tableWrapper}>
        {projectsArray.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No projects yet.</p>
          </div>
        ) : (
          <div className={styles.tableScrollContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Customer</th>
                  <th className={styles.th}>Color</th>
                  <th className={styles.th}>Active</th>
                  <th className={styles.th}>Created</th>
                </tr>
              </thead>
              <tbody>
                {projectsArray.map((project) => (
                  <tr
                    key={project.id}
                    className={styles.row}
                    onClick={() => handleRowClick(project)}
                  >
                    <td className={styles.cell}>
                      <span className={styles.nameText}>{project.name}</span>
                    </td>
                    <td className={styles.cell}>{getCustomerName(project.customer_id)}</td>
                    <td className={styles.cell}>
                      <span
                        className={styles.colorSwatch}
                        style={{ backgroundColor: project.color }}
                        title={project.color}
                      />
                      <span className={styles.colorText}>{project.color}</span>
                    </td>
                    <td className={styles.cell}>
                      <span className={`${styles.badge} ${project.is_active ? styles.activeBadge : styles.inactiveBadge}`}>
                        {project.is_active ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className={styles.cell}>{formatDate(project.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: `
    space-y-3
  `,
  header: `
    flex items-center justify-between mb-4
  `,
  tableTitle: `
    text-lg font-semibold text-gray-900
  `,
  tableWrapper: `
    bg-white rounded border border-gray-300 overflow-hidden
  `,
  tableScrollContainer: `
    overflow-x-auto
  `,
  emptyState: `
    text-center py-12
  `,
  emptyText: `
    text-gray-500 text-sm
  `,
  table: `
    w-full border-collapse text-xs
  `,
  th: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
  `,
  row: `
    hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0 cursor-pointer
  `,
  cell: `
    px-3 py-2 text-xs text-gray-700
  `,
  nameText: `
    font-medium text-gray-900
  `,
  colorSwatch: `
    inline-block w-4 h-4 rounded border border-gray-300 align-middle mr-2
  `,
  colorText: `
    text-gray-600
  `,
  badge: `
    inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium
  `,
  activeBadge: `
    bg-green-100 text-green-800
  `,
  inactiveBadge: `
    bg-gray-100 text-gray-600
  `,
};
