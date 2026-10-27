'use client';

import { useEffect, useRef, useState } from 'react';
import { Category, Priority } from '@/lib/types';
import { CheckCircleIcon, CloseIcon } from './icons';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewTicketData) => void;
}

export interface NewTicketData {
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  category: Category;
  priority: Priority;
}

const categories: Category[] = ['billing', 'technical', 'shipping', 'returns', 'general'];
const priorities: Priority[] = ['low', 'medium', 'high', 'urgent'];

const FORM_ID = 'new-ticket-form';

const baseInput =
  'w-full rounded-lg border bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted/80 transition-colors hover:border-slate-300 focus:outline-none focus:ring-2';
const validInput = `${baseInput} border-line focus:border-primary focus:ring-primary/20`;
const invalidInput = `${baseInput} border-red-500 focus:border-red-500 focus:ring-red-500/20`;

const labelClass = 'mb-1.5 block text-sm font-medium text-ink';
const errorClass = 'mt-1.5 text-xs text-red-700';

export function NewTicketModal({ isOpen, onClose, onSubmit }: NewTicketModalProps) {
  const [formData, setFormData] = useState<NewTicketData>({
    customerName: '',
    customerEmail: '',
    subject: '',
    message: '',
    category: 'general',
    priority: 'medium',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const firstFieldRef = useRef<HTMLInputElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // On open, focus the first field. On close, return focus to the element that opened the dialog.
  useEffect(() => {
    if (!isOpen) return;

    const trigger = document.activeElement as HTMLElement | null;
    firstFieldRef.current?.focus();
    return () => trigger?.focus();
  }, [isOpen]);

  // The success timer must not close a dialog that has since been reopened.
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      setSubmitted(true);
      closeTimerRef.current = setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const inputClass = (name: string) => (errors[name] ? invalidInput : validInput);

  // Links an error message to its field, so screen readers announce it with the field.
  const errorProps = (name: string) =>
    errors[name]
      ? { 'aria-invalid': true, 'aria-describedby': `${name}-error` }
      : { 'aria-invalid': false as const };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-ticket-title"
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id="new-ticket-title" className="text-base font-semibold text-ink">
            Create New Ticket
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-page hover:text-ink"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div role="status" className="px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <CheckCircleIcon className="size-6" />
            </div>
            <h3 className="text-base font-semibold text-ink">Ticket Created</h3>
            <p className="mt-1 text-sm text-muted">Your support ticket has been added to the queue.</p>
          </div>
        ) : (
          <form id={FORM_ID} onSubmit={handleSubmit} noValidate className="space-y-4 overflow-y-auto px-6 py-5">
            {/* Customer Name */}
            <div>
              <label htmlFor="customerName" className={labelClass}>
                Customer Name <span className="text-red-700">*</span>
              </label>
              <input
                ref={firstFieldRef}
                id="customerName"
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className={inputClass('customerName')}
                placeholder="John Doe"
                autoComplete="off"
                {...errorProps('customerName')}
              />
              {errors.customerName && (
                <p id="customerName-error" className={errorClass}>
                  {errors.customerName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="customerEmail" className={labelClass}>
                Email Address <span className="text-red-700">*</span>
              </label>
              <input
                id="customerEmail"
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                className={inputClass('customerEmail')}
                placeholder="john@example.com"
                autoComplete="off"
                {...errorProps('customerEmail')}
              />
              {errors.customerEmail && (
                <p id="customerEmail-error" className={errorClass}>
                  {errors.customerEmail}
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className={labelClass}>
                Subject <span className="text-red-700">*</span>
              </label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={inputClass('subject')}
                placeholder="Brief description of the issue"
                {...errorProps('subject')}
              />
              {errors.subject && (
                <p id="subject-error" className={errorClass}>
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Category & Priority */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className={labelClass}>
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={validInput}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="priority" className={labelClass}>
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className={validInput}
                >
                  {priorities.map((pri) => (
                    <option key={pri} value={pri}>
                      {pri.charAt(0).toUpperCase() + pri.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className={labelClass}>
                Message <span className="text-red-700">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className={`${inputClass('message')} resize-none`}
                placeholder="Describe the issue in detail"
                rows={4}
                {...errorProps('message')}
              />
              {errors.message && (
                <p id="message-error" className={errorClass}>
                  {errors.message}
                </p>
              )}
            </div>
          </form>
        )}

        {/* Footer */}
        {!submitted && (
          <div className="flex justify-end gap-3 border-t border-line px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-page"
            >
              Cancel
            </button>
            <button
              type="submit"
              form={FORM_ID}
              className="rounded-lg bg-primary-strong px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-strong/90"
            >
              Create Ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
