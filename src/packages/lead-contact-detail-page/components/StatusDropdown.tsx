'use client';

import { ChevronDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { LeadContactBuilderActions } from '@/src/store/builders';
import { updateLeadContactStatusThunk } from '@/src/store/thunks/lead-contacts';
import type { LeadContactStatus } from '@/src/model/lead-contact';

const CONTACT_STATUSES: { value: LeadContactStatus; label: string }[] = [
  { value: 'not_contacted', label: 'Not contacted' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'responded', label: 'Responded' },
  { value: 'not_responded', label: 'No response' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

const badgeFor = (status: LeadContactStatus) => {
  switch (status) {
    case 'not_contacted':
      return 'bg-gray-100 text-gray-800';
    case 'contacted':
      return 'bg-blue-100 text-blue-800';
    case 'responded':
      return 'bg-violet-100 text-violet-800';
    case 'not_responded':
      return 'bg-amber-100 text-amber-900';
    case 'won':
      return 'bg-emerald-100 text-emerald-800';
    case 'lost':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const StatusDropdown = () => {
  const dispatch = useAppDispatch();
  const { isStatusMenuOpen, isUpdatingStatus } = useAppSelector(
    (s) => s.leadContactBuilder
  );
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);

  const handleChange = async (next: LeadContactStatus) => {
    dispatch(LeadContactBuilderActions.setStatusMenuOpen(false));
    if (next === currentLeadContact.status) return;
    await dispatch(updateLeadContactStatusThunk(currentLeadContact.id, next));
  };

  const label =
    CONTACT_STATUSES.find((s) => s.value === currentLeadContact.status)
      ?.label ?? currentLeadContact.status;

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        onClick={() =>
          dispatch(
            LeadContactBuilderActions.setStatusMenuOpen(!isStatusMenuOpen)
          )
        }
        disabled={isUpdatingStatus}
        className={`${styles.trigger} ${badgeFor(currentLeadContact.status)}`}
      >
        {isUpdatingStatus ? '…' : label}
        <ChevronDown className={styles.chev} />
      </button>
      {isStatusMenuOpen && (
        <>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Close menu"
            onClick={() =>
              dispatch(LeadContactBuilderActions.setStatusMenuOpen(false))
            }
          />
          <div className={styles.menu}>
            {CONTACT_STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => handleChange(s.value)}
                className={`${styles.item} ${
                  currentLeadContact.status === s.value ? styles.itemOn : ''
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  wrap: `relative`,
  trigger: `
    inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium
    border border-transparent hover:opacity-90 transition-opacity cursor-pointer
  `,
  chev: `h-3.5 w-3.5 opacity-70`,
  backdrop: `fixed inset-0 z-10 cursor-default border-none bg-transparent p-0`,
  menu: `
    absolute left-0 top-full mt-1 z-20 min-w-[11rem] py-1 rounded-lg border border-gray-200
    bg-white shadow-lg
  `,
  item: `
    w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border-none bg-transparent cursor-pointer
  `,
  itemOn: `bg-gray-50 font-medium`,
};
