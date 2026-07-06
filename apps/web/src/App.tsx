import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ROUTES } from './lib/constants';
import { CreateTicketPage } from './pages/CreateTicketPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { TicketBoardPage } from './pages/TicketBoardPage';
import { TicketDetailPage } from './pages/TicketDetailPage';
import { TicketListPage } from './pages/TicketListPage';

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to={ROUTES.tickets} replace />} />
        <Route path={ROUTES.tickets} element={<TicketListPage />} />
        <Route path={ROUTES.newTicket} element={<CreateTicketPage />} />
        <Route path={ROUTES.board} element={<TicketBoardPage />} />
        <Route path={ROUTES.ticketDetail} element={<TicketDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
