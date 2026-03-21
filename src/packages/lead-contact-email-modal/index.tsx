'use client';

import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { LeadContactEmailBuilderActions } from '@/src/store/builders';
import { CurrentLeadContactEmailActions } from '@/src/store/current';
import { LeadContactInfoPanel } from './LeadContactInfoPanel';
import { EmailEditorPanel } from './EmailEditorPanel';
import { SentEmailsPanel } from './SentEmailsPanel';
import { SaveToast } from './components/SaveToast';

export const LeadContactEmailModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (s) => s.leadContactEmailBuilder.isEmailModalOpen
  );

  const handleClose = useCallback(() => {
    dispatch(LeadContactEmailBuilderActions.closeEmailModal());
    dispatch(CurrentLeadContactEmailActions.reset());
  }, [dispatch]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h1 className={styles.title}>Compose email</h1>
          <button
            type="button"
            onClick={handleClose}
            className={styles.close}
            aria-label="Close"
          >
            <X className={styles.closeIcon} />
          </button>
        </div>
        <div className={styles.body}>
          <LeadContactInfoPanel />
          <EmailEditorPanel />
          <SentEmailsPanel />
        </div>
      </div>
      <SaveToast />
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 z-50 flex items-center justify-center p-4
    bg-black/40 backdrop-blur-[2px]
  `,
  modal: `
    bg-white rounded-2xl shadow-2xl border border-gray-200
    w-full max-w-[1400px] max-h-[92vh] flex flex-col overflow-hidden
  `,
  header: `
    flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0
  `,
  title: `text-lg font-semibold text-gray-900`,
  close: `
    p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100
    border-none bg-transparent cursor-pointer
  `,
  closeIcon: `h-5 w-5`,
  body: `
    flex-1 min-h-0 overflow-hidden
    grid grid-cols-1 lg:grid-cols-[minmax(200px,1fr)_2.2fr_minmax(200px,1fr)] gap-0
  `,
};
