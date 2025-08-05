import type { ReactElement } from 'react';
import { DashboardCard } from '../cards/DashboardCard';

interface DashboardStatsProps {
  total: number;
  done: number;
  incomplete: number;
  overdue: number;
  donePercent: string;
  incompletePercent: string;
  overduePercent: string;
}

export default function DashboardStats({
  total,
  done,
  incomplete,
  overdue,
  donePercent,
  incompletePercent,
  overduePercent,
}: DashboardStatsProps): ReactElement {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      <DashboardCard
        icon="fas fa-tasks"
        title="Total Tasks"
        count={total}
        trend="Up"
        note="All assigned tasks"
        iconColor="text-blue-700"
      />
      <DashboardCard
        icon="fas fa-hourglass-half"
        title="Incomplete"
        count={incomplete}
        trend="Up"
        percent={`${incompletePercent}%`}
        note="Pending tasks"
        iconColor="text-yellow-500"
      />
      <DashboardCard
        icon="fas fa-check-circle"
        title="Done"
        count={done}
        trend="Up"
        percent={`${donePercent}%`}
        note="Marked complete"
        iconColor="text-green-600"
      />
      <DashboardCard
        icon="fas fa-exclamation-triangle"
        title="Overdue"
        count={overdue}
        trend="Down"
        percent={`${overduePercent}%`}
        note="Past due date"
        iconColor="text-red-600"
      />
    </div>
  );
}