'use client';

import { useState, useEffect } from 'react';
import type { Ticket, TicketStatus, TicketPriority } from '@/src/model';

type TicketFormProps = {
  initialValues?: Partial<Ticket>;
  onSubmit: (ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

/**
 * Shared form component for creating and editing tickets
 */
export const TicketForm = (props: TicketFormProps) => {
  const { initialValues, onSubmit, onCancel, isLoading } = props;
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [status, setStatus] = useState<TicketStatus>(initialValues?.status || 'todo');
  const [priority, setPriority] = useState<TicketPriority>(initialValues?.priority || 'medium');
  const [tags, setTags] = useState(initialValues?.tags?.join(', ') || '');
  const [labels, setLabels] = useState(initialValues?.labels?.join(', ') || '');

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || '');
      setDescription(initialValues.description || '');
      setStatus(initialValues.status || 'todo');
      setPriority(initialValues.priority || 'medium');
      setTags(initialValues.tags?.join(', ') || '');
      setLabels(initialValues.labels?.join(', ') || '');
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const labelsArray = labels.split(',').map(l => l.trim()).filter(l => l.length > 0);

    onSubmit({
      user_id: initialValues?.user_id || '',
      project_id: initialValues?.project_id ?? null,
      customer_id: initialValues?.customer_id ?? null,
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      tags: tagsArray,
      labels: labelsArray,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="title" className={styles.label}>
          Title <span className={styles.required}>*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={styles.input}
          disabled={isLoading}
          placeholder="Enter ticket title"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
          disabled={isLoading}
          placeholder="Enter ticket description"
          rows={4}
        />
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label htmlFor="status" className={styles.label}>
            Status <span className={styles.required}>*</span>
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TicketStatus)}
            required
            className={styles.select}
            disabled={isLoading}
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="priority" className={styles.label}>
            Priority <span className={styles.required}>*</span>
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TicketPriority)}
            required
            className={styles.select}
            disabled={isLoading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label htmlFor="tags" className={styles.label}>
            Tags
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={styles.input}
            disabled={isLoading}
            placeholder="Comma-separated tags"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="labels" className={styles.label}>
            Labels
          </label>
          <input
            id="labels"
            type="text"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            className={styles.input}
            disabled={isLoading}
            placeholder="Comma-separated labels"
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className={styles.submitButton}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

const styles = {
  form: `
    space-y-4
  `,
  field: `
    flex flex-col
  `,
  fieldRow: `
    grid grid-cols-2 gap-4
  `,
  label: `
    text-sm font-medium text-gray-700 mb-1
  `,
  required: `
    text-red-500
  `,
  input: `
    px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:bg-gray-100 disabled:cursor-not-allowed
  `,
  textarea: `
    px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:bg-gray-100 disabled:cursor-not-allowed
    resize-vertical
  `,
  select: `
    px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:bg-gray-100 disabled:cursor-not-allowed
  `,
  actions: `
    flex items-center justify-end gap-3 pt-4 border-t border-gray-200
  `,
  cancelButton: `
    px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded
    hover:bg-gray-50 transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  submitButton: `
    px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded
    hover:bg-blue-700 transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
};
