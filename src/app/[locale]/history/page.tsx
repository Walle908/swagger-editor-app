import dynamic from 'next/dynamic';

const HistoryPage = dynamic(() => import('@/views/historyPage/HistoryPage'));

export default function History() {
  return <HistoryPage />;
}
