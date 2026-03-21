import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const LEAD_DETAIL_PAGE_TABS = [
  'Overview',
  'Contacts',
  'Notes',
  'Website Scrapes',
] as const;

export type LeadDetailTab = (typeof LEAD_DETAIL_PAGE_TABS)[number];

type LeadBuilderState = {
  selectedCategoryIds: string[];
  selectedStatus: string | null;
  searchFilter: string;
  qualityFilter: 'all' | 'unscored' | '<30' | '30-50' | '51-70' | '71+';
  selectedLeadIds: string[];
  leadsTableMenuOpenId: string | null;
  activeLeadDetailTab: LeadDetailTab;
  isSavingLeadDetail: boolean;
};

const initialState: LeadBuilderState = {
  selectedCategoryIds: [],
  selectedStatus: null,
  searchFilter: '',
  qualityFilter: 'all',
  selectedLeadIds: [],
  leadsTableMenuOpenId: null,
  activeLeadDetailTab: 'Overview',
  isSavingLeadDetail: false,
};

export const leadBuilderSlice = createSlice({
  name: 'leadBuilder',
  initialState,
  reducers: {
    setSelectedCategoryIds: (state, action: PayloadAction<string[]>) => {
      state.selectedCategoryIds = action.payload;
    },
    setSelectedStatus: (state, action: PayloadAction<string | null>) => {
      state.selectedStatus = action.payload;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.searchFilter = action.payload;
    },
    setQualityFilter: (
      state,
      action: PayloadAction<LeadBuilderState['qualityFilter']>
    ) => {
      state.qualityFilter = action.payload;
    },
    toggleCategorySelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const idx = state.selectedCategoryIds.indexOf(id);
      if (idx === -1) {
        state.selectedCategoryIds.push(id);
      } else {
        state.selectedCategoryIds.splice(idx, 1);
      }
    },
    clearLeadSelection: (state) => {
      state.selectedLeadIds = [];
    },
    selectAllLeads: (state, action: PayloadAction<string[]>) => {
      state.selectedLeadIds = action.payload;
    },
    toggleLeadSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const idx = state.selectedLeadIds.indexOf(id);
      if (idx === -1) {
        state.selectedLeadIds.push(id);
      } else {
        state.selectedLeadIds.splice(idx, 1);
      }
    },
    clearFilters: (state) => {
      state.selectedCategoryIds = [];
      state.selectedStatus = null;
      state.searchFilter = '';
      state.qualityFilter = 'all';
    },
    setLeadsTableMenuOpenId: (state, action: PayloadAction<string | null>) => {
      state.leadsTableMenuOpenId = action.payload;
    },
    setActiveLeadDetailTab: (state, action: PayloadAction<LeadDetailTab>) => {
      state.activeLeadDetailTab = action.payload;
    },
    setIsSavingLeadDetail: (state, action: PayloadAction<boolean>) => {
      state.isSavingLeadDetail = action.payload;
    },
    reset: () => initialState,
  },
});

export const LeadBuilderActions = leadBuilderSlice.actions;
export default leadBuilderSlice.reducer;
