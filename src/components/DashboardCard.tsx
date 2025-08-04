interface CardProps {
  title: string;
  count: number;
  trend: 'Up' | 'Down';
  percent?: string;
  note: string;
  icon: string;
  iconColor: string
}

export const DashboardCard: React.FC<CardProps> = ({ title, count, trend, percent, note, icon, iconColor }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex justify-between">
      <div>
        <h3 className="text-gray-500 mb-2">{title}</h3>
        <p className="text-3xl font-bold mb-2">{count}</p>
        <div
          className={`flex items-center text-sm ${iconColor}`}
        >
          {trend === 'Up' ? '' : ''} {percent} {note}
        </div>
      </div>
      <div>
        <i className={icon + ' text-3xl ' + iconColor}></i>
      </div>
    </div>
  );
};