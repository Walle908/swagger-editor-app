import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AuthGuard } from '@/components/providers/AuthGuard';

const HistoryPage = dynamic(() => import('@/views/historyPage/HistoryPage'), {
  loading: () => null,
});

export default async function History() {
  const cookieStore = await cookies();
  const uid = cookieStore.get('uid')?.value;

  if (!uid) {
    redirect('/');
  }

  return (
    <AuthGuard>
      <HistoryPage uid={uid} />
    </AuthGuard>
  );
}
