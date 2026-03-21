'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { LeadBuilderActions } from '@/src/store/builders';
import { LeadsActions } from '@/src/store/dumps/leads';
import { LEAD_DETAIL_PATH } from '@/src/config';
import {
  setCurrentLeadThunk,
  updateLeadThunk,
  deleteLeadThunk,
} from '@/src/store/thunks/leads';
import type { Lead } from '@/src/model';
import { LEAD_OPPORTUNITY_OPTIONS } from '@/src/model';
import { formatDateShort } from '@/src/utils/date-time';
import { LeadRowMenu } from './LeadRowMenu';

type LeadRowProps = {
  lead: Lead;
  index: number;
};

const getQualityScoreColor = (score: number | undefined | null): string => {
  if (score === undefined || score === null) return 'text-gray-400';
  if (score >= 80) return 'text-green-600 font-semibold';
  if (score >= 60) return 'text-yellow-600 font-semibold';
  return 'text-red-600 font-semibold';
};

const qualityScoreOptions = [
  { value: '', label: '—' },
  ...Array.from({ length: 10 }, (_, i) => {
    const score = (i + 1) * 10;
    return { value: score.toString(), label: score.toString() };
  }),
];

export const LeadRow = (props: LeadRowProps) => {
  const { lead, index } = props;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const leadCategories = useAppSelector((state) => state.leadCategories);
  const selectedLeadIds = useAppSelector(
    (state) => state.leadBuilder.selectedLeadIds
  );
  const menuOpenId = useAppSelector(
    (state) => state.leadBuilder.leadsTableMenuOpenId
  );

  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const [opportunitiesOpen, setOpportunitiesOpen] = useState(false);
  const opportunitiesRef = useRef<HTMLDivElement | null>(null);

  const isSelected = selectedLeadIds.includes(lead.id);
  const isMenuOpen = menuOpenId === lead.id;

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(e.target as Node)
      ) {
        dispatch(LeadBuilderActions.setLeadsTableMenuOpenId(null));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, dispatch]);

  useEffect(() => {
    if (!opportunitiesOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        opportunitiesRef.current &&
        !opportunitiesRef.current.contains(e.target as Node)
      ) {
        setOpportunitiesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [opportunitiesOpen]);

  const handleToggleLead = () => {
    dispatch(LeadBuilderActions.toggleLeadSelection(lead.id));
  };

  const handleRowClick = () => {
    dispatch(setCurrentLeadThunk(lead.id));
    router.push(LEAD_DETAIL_PATH);
  };

  const handleWebsiteClick = (e: React.MouseEvent, website: string) => {
    e.stopPropagation();
    const url = website.startsWith('http') ? website : `https://${website}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value || null;
    const selectedCategory = categoryId
      ? leadCategories.find((c) => c.id === categoryId)
      : null;
    await dispatch(
      updateLeadThunk(lead.id, {
        category_id: categoryId || undefined,
        category_name: selectedCategory?.name ?? undefined,
      })
    );
  };

  const handleQualityScoreChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newScore =
      e.target.value === '' ? undefined : parseInt(e.target.value, 10);
    await dispatch(updateLeadThunk(lead.id, { quality_score: newScore }));
  };

  const handleOpportunityToggle = async (opportunityId: string) => {
    const current = lead.opportunities ?? [];
    const next = current.includes(opportunityId)
      ? current.filter((id) => id !== opportunityId)
      : [...current, opportunityId];
    await dispatch(updateLeadThunk(lead.id, { opportunities: next }));
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      LeadBuilderActions.setLeadsTableMenuOpenId(isMenuOpen ? null : lead.id)
    );
  };

  const handleViewLead = () => {
    dispatch(LeadBuilderActions.setLeadsTableMenuOpenId(null));
    dispatch(setCurrentLeadThunk(lead.id));
    router.push(LEAD_DETAIL_PATH);
  };

  const handleEditLead = () => {
    dispatch(LeadBuilderActions.setLeadsTableMenuOpenId(null));
    dispatch(setCurrentLeadThunk(lead.id));
    router.push(LEAD_DETAIL_PATH);
  };

  const handleArchiveLead = async () => {
    if (
      confirm(
        `Are you sure you want to archive "${lead.business_name || lead.name || 'this lead'}"? This will hide the lead from the main list.`
      )
    ) {
      dispatch(LeadBuilderActions.setLeadsTableMenuOpenId(null));
      const status = await dispatch(
        updateLeadThunk(lead.id, { status: 'archived' })
      );
      if (status === 200) {
        dispatch(LeadsActions.deleteLead(lead.id));
      }
    }
  };

  const handleDeleteLead = async () => {
    if (
      confirm(
        `Are you sure you want to delete "${lead.business_name || lead.name || 'this lead'}"?`
      )
    ) {
      dispatch(LeadBuilderActions.setLeadsTableMenuOpenId(null));
      await dispatch(deleteLeadThunk(lead.id));
    }
  };

  const qualityClass =
    lead.quality_score != null
      ? getQualityScoreColor(lead.quality_score)
      : styles.emptyValue;

  return (
    <tr
      className={`${styles.tableRow} ${isSelected ? styles.selectedRow : ''}`}
      onClick={handleRowClick}
    >
      <td className={styles.checkboxCell} onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleToggleLead}
          className={styles.checkbox}
          title="Select lead"
        />
      </td>
      <td className={styles.rowNumberCell}>{index + 1}</td>
      <td className={styles.clickableCell}>
        <div className={styles.businessName}>
          {lead.business_name || 'Unnamed Business'}
        </div>
        {lead.website && (
          <button
            type="button"
            onClick={(e) => handleWebsiteClick(e, lead.website!)}
            className={styles.websiteLink}
          >
            {lead.website}
          </button>
        )}
      </td>
      <td className={styles.tableCellCenter} onClick={(e) => e.stopPropagation()}>
        <select
          value={lead.category_id ?? ''}
          onChange={handleCategoryChange}
          className={styles.categorySelect}
        >
          <option value="">—</option>
          {leadCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </td>
      <td className={styles.tableCellCenter}>
        <span className={styles.emptyValue}>—</span>
      </td>
      <td className={styles.tableCellCenter} onClick={(e) => e.stopPropagation()}>
        <div className={styles.opportunitiesWrapper} ref={opportunitiesRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpportunitiesOpen((prev) => !prev);
            }}
            className={styles.opportunitiesTrigger}
            aria-label="Edit opportunities"
            title="Click to edit opportunities"
          >
            <span className={styles.opportunitiesCount}>
              {lead.opportunities?.length ? lead.opportunities.length : '—'}
            </span>
            <span className={styles.opportunitiesCaret}>▾</span>
          </button>
          {opportunitiesOpen && (
            <div className={styles.opportunitiesDropdown}>
              <div className={styles.opportunitiesDropdownTitle}>
                Opportunities
              </div>
              {LEAD_OPPORTUNITY_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={styles.opportunitiesDropdownOption}
                >
                  <input
                    type="checkbox"
                    checked={(lead.opportunities ?? []).includes(option.id)}
                    onChange={() => handleOpportunityToggle(option.id)}
                    className={styles.opportunityCheckbox}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </td>
      <td className={styles.tableCellCenter} onClick={(e) => e.stopPropagation()}>
        <select
          value={
            lead.quality_score !== undefined && lead.quality_score !== null
              ? lead.quality_score.toString()
              : ''
          }
          onChange={handleQualityScoreChange}
          className={`${styles.qualityScoreSelect} ${qualityClass}`}
          onClick={(e) => e.stopPropagation()}
        >
          {qualityScoreOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </td>
      <td className={styles.tableCellCenter}>
        <span className={styles.emptyValue}>—</span>
      </td>
      <td className={styles.tableCell}>
        <div className={styles.date}>{formatDateShort(lead.updated_at)}</div>
      </td>
      <td className={styles.actionsCell} onClick={(e) => e.stopPropagation()}>
        <div className={styles.menuContainer} ref={menuContainerRef}>
          <button
            type="button"
            onClick={handleMenuToggle}
            className={styles.menuButton}
            aria-label="Lead actions"
          >
            ⋯
          </button>
          {isMenuOpen && (
            <LeadRowMenu
              lead={lead}
              onClose={() =>
                dispatch(LeadBuilderActions.setLeadsTableMenuOpenId(null))
              }
              onView={handleViewLead}
              onEdit={handleEditLead}
              onArchive={handleArchiveLead}
              onDelete={handleDeleteLead}
            />
          )}
        </div>
      </td>
    </tr>
  );
};

const styles = {
  tableRow: `
    hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0
    relative cursor-pointer
  `,
  selectedRow: `bg-blue-50`,
  checkboxCell: `px-2 text-center`,
  checkbox: `cursor-pointer`,
  rowNumberCell: `
    px-2 py-2 text-sm text-gray-500 font-mono
  `,
  clickableCell: `px-3 py-2 text-sm`,
  businessName: `
    font-semibold text-gray-900 hover:text-blue-700
  `,
  websiteLink: `
    text-blue-600 text-xs truncate max-w-xs
    hover:text-blue-800 hover:underline cursor-pointer
    border-none bg-transparent p-0 text-left transition-colors
  `,
  tableCell: `px-3 py-2 text-sm text-gray-900`,
  tableCellCenter: `px-3 py-2 text-sm text-center`,
  qualityScoreSelect: `
    font-mono px-2 py-1 text-sm border border-gray-300 rounded bg-white
    focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
    cursor-pointer hover:border-gray-400 transition-colors
  `,
  emptyValue: `text-gray-400`,
  categorySelect: `
    px-2 py-1 text-sm border border-gray-300 rounded bg-white
    focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
    cursor-pointer hover:border-gray-400 transition-colors max-w-xs w-full
  `,
  date: `text-gray-600`,
  actionsCell: `px-3 py-2 text-sm text-center relative`,
  menuContainer: `relative inline-flex`,
  menuButton: `
    w-8 h-8 flex items-center justify-center text-gray-600 text-xl
    hover:text-gray-900 hover:bg-gray-100 transition-colors
    focus:outline-none focus:ring-2 focus:ring-blue-500 rounded cursor-pointer
    border-none bg-transparent
  `,
  opportunitiesWrapper: `relative inline-block`,
  opportunitiesTrigger: `
    flex items-center gap-0.5 px-2 py-1 rounded text-sm font-medium
    text-orange-600 hover:text-orange-700 hover:bg-orange-50
    border border-transparent hover:border-orange-200 cursor-pointer transition-colors
    bg-transparent
  `,
  opportunitiesCount: `font-mono`,
  opportunitiesCaret: `text-gray-400 text-[10px]`,
  opportunitiesDropdown: `
    absolute left-1/2 -translate-x-1/2 top-full mt-1 z-50
    bg-white border border-gray-200 rounded shadow-lg min-w-52 py-2 px-2
  `,
  opportunitiesDropdownTitle: `
    text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 pb-1.5 mb-1 border-b border-gray-100
  `,
  opportunitiesDropdownOption: `
    flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 rounded
  `,
  opportunityCheckbox: `rounded border-gray-300 text-blue-600 focus:ring-blue-500`,
};
