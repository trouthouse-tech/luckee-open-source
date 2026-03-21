'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { TicketFiltersBuilderActions } from '@/src/store/builders/ticketFiltersBuilder';

export const TicketFilterProjectDropdown = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects);
  const selectedProjects = useAppSelector((state) => state.ticketFiltersBuilder.selectedProjects);

  const projectOptions = useMemo(() => {
    return Object.values(projects).sort((a, b) => a.name.localeCompare(b.name));
  }, [projects]);

  if (projectOptions.length === 0) return null;

  return (
    <div className={styles.dropdownWrapper}>
      <details className={styles.dropdown}>
        <summary className={styles.dropdownSummary}>
          Projects {selectedProjects.length > 0 && `(${selectedProjects.length})`}
        </summary>
        <div className={styles.dropdownContent}>
          {projectOptions.map((project) => (
            <label key={project.id} className={styles.dropdownItem}>
              <input
                type="checkbox"
                checked={selectedProjects.includes(project.id)}
                onChange={() => dispatch(TicketFiltersBuilderActions.toggleProject(project.id))}
                className={styles.checkbox}
              />
              <span>{project.name}</span>
            </label>
          ))}
        </div>
      </details>
    </div>
  );
};

const styles = {
  dropdownWrapper: `
    relative
  `,
  dropdown: `
    relative
  `,
  dropdownSummary: `
    h-7 px-2 py-1 text-xs border border-gray-300 rounded bg-white
    cursor-pointer hover:bg-gray-50 transition-colors list-none flex items-center
  `,
  dropdownContent: `
    absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto
    bg-white border border-gray-300 rounded shadow-lg z-10 py-1
  `,
  dropdownItem: `
    flex items-start gap-2 px-2 py-1.5
    hover:bg-gray-50 cursor-pointer text-xs
  `,
  checkbox: `
    cursor-pointer mt-0.5 flex-shrink-0
  `,
};
