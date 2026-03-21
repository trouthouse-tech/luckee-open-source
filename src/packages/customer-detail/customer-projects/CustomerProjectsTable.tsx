'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/src/store/hooks';
import { ProjectRow } from './ProjectRow';

type CustomerProjectsTableProps = {
  customerId: string;
};

export const CustomerProjectsTable = (props: CustomerProjectsTableProps) => {
  const { customerId } = props;
  const projects = useAppSelector((state) => state.projects);

  const customerProjects = useMemo(() => {
    return Object.values(projects)
      .filter((p) => p.customer_id === customerId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [customerId, projects]);

  return (
    <div className={styles.tabContent}>
      <div className={styles.tableWrapper}>
        {customerProjects.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No projects for this customer.</p>
          </div>
        ) : (
          <div className={styles.tableScrollContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Color</th>
                  <th className={styles.th}>Active</th>
                  <th className={styles.th}>Created</th>
                </tr>
              </thead>
              <tbody>
                {customerProjects.map((project) => (
                  <ProjectRow key={project.id} project={project} />
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
  tabContent: `
    space-y-3
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
    text-gray-600 text-lg
  `,
  table: `
    w-full border-collapse text-xs
  `,
  th: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
  `,
};
