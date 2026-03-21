'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { saveCurrentLeadThunk } from '@/src/store/thunks/leads';
import { BusinessNameInput } from '../inputs/BusinessNameInput';
import { StatusInput } from '../inputs/StatusInput';
import { QualityScoreInput } from '../inputs/QualityScoreInput';
import { WebsiteInput } from '../inputs/WebsiteInput';
import { NameInput } from '../inputs/NameInput';
import { EmailInput } from '../inputs/EmailInput';
import { PhoneInput } from '../inputs/PhoneInput';
import { AddressInput } from '../inputs/AddressInput';
import { NotesInput } from '../inputs/NotesInput';
import type { Lead } from '@/src/model';

type LeadDetailHeaderProps = {
  onDeleteClick: () => void;
};

export const LeadDetailHeader = (props: LeadDetailHeaderProps) => {
  const { onDeleteClick } = props;
  const dispatch = useAppDispatch();
  const currentLead = useAppSelector((state) => state.currentLead);
  const leadsRecord = useAppSelector((state) => state.leads);
  const leadId = currentLead?.id ?? '';
  const leadFromRecord = leadId ? leadsRecord[leadId] ?? null : null;
  const [menuOpen, setMenuOpen] = useState(false);
  const isSaving = useAppSelector((state) => state.leadBuilder.isSavingLeadDetail);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleSave = () => {
    if (!currentLead || isSaving) return;
    dispatch(saveCurrentLeadThunk());
  };

  const handleConvertToCustomer = () => {
    setMenuOpen(false);
    window.alert('Convert to customer is not available yet.');
  };

  const handleDeleteLead = () => {
    setMenuOpen(false);
    onDeleteClick();
  };

  return (
    <div className={styles.headerCard}>
      <div className={styles.headerTop}>
        <h1 className={styles.pageTitle}>Lead Details</h1>
        <div className={styles.headerActions}>
          <div className={styles.menuContainer} ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className={styles.menuButton}
              aria-label="Lead actions"
            >
              ⋯
            </button>
            {menuOpen && (
              <>
                <div
                  className={styles.menuOverlay}
                  onClick={() => setMenuOpen(false)}
                  aria-hidden
                />
                <div className={styles.dropdownMenu}>
                  <button
                    type="button"
                    className={styles.menuItem}
                    onClick={handleConvertToCustomer}
                  >
                    Convert to Customer
                  </button>
                  <button
                    type="button"
                    className={styles.menuItemDanger}
                    onClick={handleDeleteLead}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={styles.saveButton}
          >
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div className={styles.businessSection}>
        <div className={styles.topRow}>
          <BusinessNameInput />
          <StatusInput fallbackStatus={(leadFromRecord?.status ?? 'not_contacted') as Lead['status']} />
          <QualityScoreInput />
        </div>

        <div className={styles.middleRow}>
          <WebsiteInput />
          <NameInput />
          <EmailInput />
          <PhoneInput />
        </div>

        <div className={styles.thirdRow}>
          <AddressInput />
          <NotesInput />
        </div>
      </div>
    </div>
  );
};

const styles = {
  headerCard: `
    bg-white rounded border border-gray-300 p-6 mb-4
  `,
  headerTop: `flex justify-between items-center mb-4`,
  pageTitle: `text-xl font-semibold text-gray-900`,
  headerActions: `flex items-center gap-2`,
  saveButton: `
    px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded
    hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer
  `,
  menuContainer: `relative inline-flex`,
  menuButton: `
    w-8 h-8 flex items-center justify-center text-gray-600 text-xl
    hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
    rounded cursor-pointer border-none bg-transparent
  `,
  menuOverlay: `fixed inset-0 z-40`,
  dropdownMenu: `
    absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded shadow-lg min-w-48 py-1
  `,
  menuItem: `
    w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors
    border-none bg-transparent cursor-pointer
  `,
  menuItemDanger: `
    w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors
    border-none bg-transparent cursor-pointer
  `,
  businessSection: `space-y-4`,
  topRow: `grid grid-cols-1 sm:grid-cols-3 gap-3`,
  middleRow: `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3`,
  thirdRow: `grid grid-cols-1 gap-3`,
};
