import { cookies } from 'next/headers';
import dynamic from 'next/dynamic';
import { AuthGuard } from '@/components/providers/AuthGuard';

const HistoryPage = dynamic(() => import('@/views/historyPage/HistoryPage'), {
  loading: () => null,
});

export default async function History() {
  const cookieStore = await cookies();
  const uid = cookieStore.get('uid')?.value;

  return <AuthGuard serverUid={uid}>{uid ? <HistoryPage uid={uid} /> : null}</AuthGuard>;
}
