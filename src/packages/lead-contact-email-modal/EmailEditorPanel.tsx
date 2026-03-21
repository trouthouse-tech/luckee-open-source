'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { CurrentLeadContactEmailActions } from '@/src/store/current';
import { LeadContactEmailBuilderActions } from '@/src/store/builders';
import { LeadContactEmailAttachmentsActions } from '@/src/store/dumps/leadContactEmailAttachments';
import { saveCurrentLeadContactEmailThunk } from '@/src/store/thunks/lead-contact-emails';
import {
  getLeadContactEmailsByContactIdThunk,
} from '@/src/store/thunks/lead-contact-emails';
import { getLeadSentEmailsByContactIdThunk } from '@/src/store/thunks/lead-sent-emails';
import { getAllLeadContactEmailQueueThunk } from '@/src/store/thunks/lead-contact-email-queue';
import { addToQueue } from '@/src/api/lead-contact-email-queue';
import { sendNow } from '@/src/api/lead-contact-emails';
import { uploadAttachment } from '@/src/api/lead-contact-email-attachments';
import {
  EmailSubjectInput,
  EmailBodyInput,
  EmailAttachmentInput,
} from './inputs';

export const EmailEditorPanel = () => {
  const dispatch = useAppDispatch();
  const currentLead = useAppSelector((s) => s.currentLead);
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);
  const currentEmail = useAppSelector((s) => s.currentLeadContactEmail);
  const isSaving = useAppSelector((s) => s.leadContactEmailBuilder.isSaving);

  const leadId = currentLead?.id ?? '';
  const contactId = currentLeadContact.id;
  const contactName = currentLeadContact.name;
  const contactEmailAddr = currentLeadContact.email;

  const [sending, setSending] = useState(false);
  const [queuing, setQueuing] = useState(false);

  useEffect(() => {
    if (!contactId) return;
    void dispatch(getLeadContactEmailsByContactIdThunk(contactId));
    void dispatch(getLeadSentEmailsByContactIdThunk(contactId));
  }, [contactId, dispatch]);

  const close = () => {
    dispatch(LeadContactEmailBuilderActions.closeEmailModal());
    dispatch(CurrentLeadContactEmailActions.reset());
  };

  const handleSave = async () => {
    if (!currentEmail.subject.trim()) {
      alert('Please enter a subject.');
      return;
    }
    if (!leadId || !contactId) return;

    dispatch(LeadContactEmailBuilderActions.setSaving(true));
    const pendingFile = currentEmail.pendingAttachmentFile;

    const result = await dispatch(
      saveCurrentLeadContactEmailThunk({
        id: currentEmail.id || undefined,
        lead_id: leadId,
        lead_contact_id: contactId,
        subject: currentEmail.subject,
        body: currentEmail.body,
        campaign_ids: currentEmail.campaign_ids,
      })
    );

    const ok =
      result && typeof result === 'object' && 'status' in result && result.status === 200;
    const savedEmail =
      ok && 'email' in result && result.email ? result.email : null;
    const emailId = savedEmail?.id ?? currentEmail.id;

    if (ok && savedEmail) {
      let newAttId: string | null = null;
      if (pendingFile && emailId) {
        const up = await uploadAttachment({
          file: pendingFile,
          lead_contact_email_id: emailId,
          lead_id: leadId,
          lead_contact_id: contactId,
        });
        if (up.success && up.data) {
          dispatch(LeadContactEmailAttachmentsActions.addAttachment(up.data));
          newAttId = up.data.id;
        }
        dispatch(CurrentLeadContactEmailActions.setPendingAttachmentFile(null));
      }

      dispatch(LeadContactEmailBuilderActions.showSaveToast('Email saved'));
      setTimeout(() => {
        dispatch(LeadContactEmailBuilderActions.hideSaveToast());
      }, 2800);

      const nextIds = newAttId
        ? [...currentEmail.attachment_ids, newAttId]
        : currentEmail.attachment_ids;
      dispatch(
        CurrentLeadContactEmailActions.updateFields({
          id: savedEmail.id,
          lead_id: savedEmail.lead_id,
          lead_contact_id: savedEmail.lead_contact_id,
          subject: savedEmail.subject,
          body: savedEmail.body,
          campaign_ids: savedEmail.campaign_ids ?? [],
          attachment_ids: nextIds,
          pendingAttachmentFile: null,
        })
      );
    }

    dispatch(LeadContactEmailBuilderActions.setSaving(false));
  };

  const handleSendNow = async () => {
    if (!currentEmail.id) {
      alert('Save the email first.');
      return;
    }
    if (!confirm('Send this email now?')) return;
    setSending(true);
    try {
      const res = await sendNow({ lead_contact_email_id: currentEmail.id });
      if (res.success) {
        alert('Sent.');
        void dispatch(getLeadSentEmailsByContactIdThunk(contactId));
      } else {
        alert(res.error || 'Send failed');
      }
    } finally {
      setSending(false);
    }
  };

  const handleQueue = async () => {
    if (!currentEmail.id) {
      alert('Save the email first.');
      return;
    }
    if (
      !confirm(
        'Add to send queue? Emails are sent during business hours with a short delay.'
      )
    ) {
      return;
    }
    setQueuing(true);
    try {
      const res = await addToQueue({
        lead_contact_id: contactId,
        lead_id: leadId,
        type: 'custom_email',
        lead_contact_email_id: currentEmail.id,
      });
      if (res.success) {
        alert('Added to queue.');
        void dispatch(getAllLeadContactEmailQueueThunk());
      } else {
        alert(res.error || 'Queue failed (API may not support POST yet).');
      }
    } finally {
      setQueuing(false);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.to}>
        <span className={styles.toLabel}>To</span>
        <span className={styles.toVal}>
          {contactName || 'Contact'}
          {contactEmailAddr ? ` · ${contactEmailAddr}` : ''}
        </span>
      </div>
      <div className={styles.fields}>
        <EmailSubjectInput />
        <EmailBodyInput />
        <EmailAttachmentInput />
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={close} className={styles.cancel}>
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSendNow}
          disabled={sending || !currentEmail.id}
          className={styles.send}
        >
          {sending ? 'Sending…' : 'Send now'}
        </button>
        <button
          type="button"
          onClick={handleQueue}
          disabled={queuing || !currentEmail.id}
          className={styles.queue}
        >
          {queuing ? 'Adding…' : 'Add to queue'}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={styles.save}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  panel: `p-5 overflow-y-auto bg-white border-x border-gray-100 min-h-[320px] lg:min-h-0`,
  to: `
    mb-4 px-4 py-3 rounded-xl bg-sky-50 border border-sky-100 text-sm
  `,
  toLabel: `text-xs font-semibold text-sky-700 uppercase mr-2`,
  toVal: `text-sky-950`,
  fields: `space-y-4 mb-6`,
  actions: `
    flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100
  `,
  cancel: `
    px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100
    border-none bg-transparent cursor-pointer
  `,
  send: `
    px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg
    hover:bg-emerald-700 border-none cursor-pointer disabled:opacity-45
  `,
  queue: `
    px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg
    hover:bg-blue-100 border border-blue-100 cursor-pointer disabled:opacity-45
  `,
  save: `
    px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg
    hover:bg-blue-700 border-none cursor-pointer disabled:opacity-45 ml-auto
  `,
};
