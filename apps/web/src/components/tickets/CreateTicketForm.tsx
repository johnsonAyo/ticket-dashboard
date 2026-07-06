import { zodResolver } from '@hookform/resolvers/zod';
import { TICKET_PRIORITIES, type Ticket } from '@ticket/shared';
import { useForm } from 'react-hook-form';
import { useCreateTicket } from '../../hooks/use-create-ticket';
import { getErrorMessage } from '../../lib/errors';
import { PRIORITY_LABELS } from '../../lib/labels';
import {
  createTicketSchema,
  type CreateTicketFormValues,
} from '../../tickets/create-ticket.schema';
import { FORM_CONTROL_CLASSES, FormField } from '../form/FormField';

type CreateTicketFormProps = {
  onCreated: (ticket: Ticket) => void;
  onCancel: () => void;
};

export function CreateTicketForm({ onCreated, onCancel }: CreateTicketFormProps) {
  const createTicket = useCreateTicket();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: { priority: 'medium' },
    mode: 'onChange',
  });

  const formValues = watch();

  const onSubmit = handleSubmit(async (values) => {
    try {
      const created = await createTicket.mutateAsync(values);
      onCreated(created);
    } catch {}
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <p className="text-sm text-slate-500">New tickets start with an open status.</p>

      <FormField
        label="Title"
        htmlFor="title"
        error={errors.title?.message}
        isFilled={!!formValues.title}
      >
        <input id="title" className={FORM_CONTROL_CLASSES} {...register('title')} />
      </FormField>

      <FormField
        label="Description"
        htmlFor="description"
        error={errors.description?.message}
        isFilled={!!formValues.description}
      >
        <textarea
          id="description"
          rows={4}
          className={FORM_CONTROL_CLASSES}
          {...register('description')}
        />
      </FormField>

      <FormField
        label="Customer name"
        htmlFor="customerName"
        error={errors.customerName?.message}
        isFilled={!!formValues.customerName}
      >
        <input id="customerName" className={FORM_CONTROL_CLASSES} {...register('customerName')} />
      </FormField>

      <FormField
        label="Customer email"
        htmlFor="customerEmail"
        error={errors.customerEmail?.message}
        isFilled={!!formValues.customerEmail}
      >
        <input
          id="customerEmail"
          type="email"
          className={FORM_CONTROL_CLASSES}
          {...register('customerEmail')}
        />
      </FormField>

      <FormField
        label="Priority"
        htmlFor="priority"
        error={errors.priority?.message}
        isFilled={!!formValues.priority}
      >
        <select id="priority" className={FORM_CONTROL_CLASSES} {...register('priority')}>
          {TICKET_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </select>
      </FormField>

      {createTicket.isError ? (
        <p role="alert" className="text-sm text-rose-600">
          {getErrorMessage(createTicket.error, 'Could not create the ticket.')}
        </p>
      ) : null}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating…' : 'Create ticket'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
