'use client';

import { MoreVertical, Pencil } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { LeadContactBuilderActions } from '@/src/store/builders';
import { CurrentLeadContactActions } from '@/src/store/current';

export const ContactMenu = () => {
  const dispatch = useAppDispatch();
  const { isMenuOpen } = useAppSelector((s) => s.leadContactBuilder);
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);

  const openEdit = () => {
    dispatch(LeadContactBuilderActions.setMenuOpen(false));
    dispatch(CurrentLeadContactActions.setLeadContact(currentLeadContact));
    dispatch(LeadContactBuilderActions.setEditing(true));
  };

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        onClick={() =>
          dispatch(LeadContactBuilderActions.setMenuOpen(!isMenuOpen))
        }
        className={styles.btn}
        aria-label="Contact actions"
      >
        <MoreVertical className={styles.icon} />
      </button>
      {isMenuOpen && (
        <>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Close"
            onClick={() =>
              dispatch(LeadContactBuilderActions.setMenuOpen(false))
            }
          />
          <div className={styles.menu}>
            <button type="button" className={styles.item} onClick={openEdit}>
              <Pencil className={styles.itemIcon} />
              Edit contact
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  wrap: `relative`,
  btn: `
    p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100
    border-none bg-transparent cursor-pointer
  `,
  icon: `h-5 w-5`,
  backdrop: `fixed inset-0 z-10 border-none bg-transparent p-0 cursor-default`,
  menu: `
    absolute right-0 top-full mt-1 z-20 w-44 py-1 rounded-lg border border-gray-200
    bg-white shadow-lg
  `,
  item: `
    w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-700
    hover:bg-gray-50 border-none bg-transparent cursor-pointer
  `,
  itemIcon: `h-4 w-4 text-gray-400`,
};
