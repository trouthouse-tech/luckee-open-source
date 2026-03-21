'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/src/store/hooks';
import { setCurrentProjectDetailThunk } from '@/src/store/thunks/projects';
import { formatDateMedium } from '@/src/utils/date-time';
import type { Project } from '@/src/model/project/Project';

type ProjectRowProps = {
  project: Project;
};

export const ProjectRow = (props: ProjectRowProps) => {
  const { project } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handlePress = () => {
    dispatch(setCurrentProjectDetailThunk(project.id));
    router.push('/projects/detail');
  };

  return (
    <tr className={styles.row} onClick={handlePress}>
      <td className={styles.cell}>
        <span className={styles.nameText}>{project.name}</span>
      </td>
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
      <td className={styles.cell}>{formatDateMedium(project.created_at)}</td>
    </tr>
  );
};

const styles = {
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
    inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium
  `,
  activeBadge: `
    bg-green-100 text-green-800
  `,
  inactiveBadge: `
    bg-gray-100 text-gray-600
  `,
};
