import { cookies } from 'next/headers';
import { AuthGuard } from '@/components/providers/AuthGuard';
import HistoryDetailPage from '@/views/historyPage/HistoryDetailPage/HistoryDetailPage';

export default async function HistoryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const uid = cookieStore.get('uid')?.value;

  return <AuthGuard serverUid={uid}>{uid ? <HistoryDetailPage id={id} /> : null};</AuthGuard>;
}
