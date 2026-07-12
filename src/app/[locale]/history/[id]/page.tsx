import HistoryDetailPage from '@/views/historyPage/HistoryDetailPage/HistoryDetailPage';

export default async function HistoryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <HistoryDetailPage id={id} />;
}
