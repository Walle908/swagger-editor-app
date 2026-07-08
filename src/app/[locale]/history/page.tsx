import HistoryPage from '@/views/historyPage/HistoryPage';
import { AuthGuard } from '@/components/providers/AuthGuard';

export default function History() {
  return (
    <AuthGuard>
      <HistoryPage />
    </AuthGuard>
  );
}
