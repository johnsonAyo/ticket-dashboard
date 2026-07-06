import { useConfirm } from '../components/feedback/ConfirmProvider';

const DELETE_TICKET_REMEMBER_KEY = 'delete-ticket';

export function useConfirmDeleteTicket(): () => Promise<boolean> {
  const confirm = useConfirm();
  return () =>
    confirm({
      title: 'Delete ticket',
      message: 'This permanently removes the ticket and cannot be undone.',
      confirmLabel: 'Delete',
      tone: 'danger',
      rememberKey: DELETE_TICKET_REMEMBER_KEY,
    });
}
