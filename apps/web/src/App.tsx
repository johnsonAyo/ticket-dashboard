import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { CreateTicketDrawer } from './components/tickets/CreateTicketDrawer';
import { ROUTES } from './lib/constants';
import { NotFoundPage } from './pages/NotFoundPage';
import { TicketBoardPage } from './pages/TicketBoardPage';
import { TicketDetailPage } from './pages/TicketDetailPage';
import { TicketListPage } from './pages/TicketListPage';

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to={ROUTES.tickets} replace />} />
        <Route path={ROUTES.tickets} element={<TicketListPage />}>
          {/* The create form opens as a drawer overlaying the list. */}
          <Route path="new" element={<CreateTicketDrawer />} />
          <Route path=":id" element={<TicketDetailPage />} />
        </Route>
        <Route path={ROUTES.board} element={<TicketBoardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
