import { combineReducers } from '@reduxjs/toolkit';

// Dumps
import {
  users,
  tickets,
  timeEntries,
  projects,
  customers,
  leads,
  leadCategories,
  leadContacts,
  leadSentEmails,
  leadContactEmailQueue,
  leadContactEmails,
  leadContactEmailAttachments,
  leadNotes,
  websiteScrapeRuns,
  googleMapsScrapeRuns,
} from './dumps';

// Current
import {
  currentUser,
  currentTicket,
  currentTimeEntry,
  currentProject,
  currentCustomer,
  currentProjectDetail,
  currentLead,
  currentLeadContact,
  currentLeadContactEmail,
  currentGoogleMapsScrapeRun,
} from './current';

// Builders
import {
  ticketBuilder,
  ticketFiltersBuilder,
  timeEntryBuilder,
  projectBuilder,
  customerBuilder,
  leadBuilder,
  leadSentEmailsBuilder,
  leadContactBuilder,
  leadContactEmailBuilder,
  googleMapsScraperBuilder,
} from './builders';

// Config
import { auth } from './config';

const rootReducer = combineReducers({
  users,
  tickets,
  timeEntries,
  projects,
  customers,
  leads,
  leadCategories,
  leadContacts,
  leadSentEmails,
  leadContactEmailQueue,
  leadContactEmails,
  leadContactEmailAttachments,
  leadNotes,
  websiteScrapeRuns,
  googleMapsScrapeRuns,

  currentUser,
  currentTicket,
  currentTimeEntry,
  currentProject,
  currentCustomer,
  currentProjectDetail,
  currentLead,
  currentLeadContact,
  currentLeadContactEmail,
  currentGoogleMapsScrapeRun,

  ticketBuilder,
  ticketFiltersBuilder,
  timeEntryBuilder,
  projectBuilder,
  customerBuilder,
  leadBuilder,
  leadSentEmailsBuilder,
  leadContactBuilder,
  leadContactEmailBuilder,
  googleMapsScraperBuilder,

  auth,
});

export default rootReducer;
