interface CardProps {
  title: string;
  count: number;
  trend: 'Up' | 'Down';
  percent?: string;
  note: string;
}

export const Card: React.FC<CardProps> = ({ title, count, trend, percent, note }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-gray-500 mb-2">{title}</h3>
      <p className="text-3xl font-bold mb-2">{count}</p>
      <div
        className={`flex items-center text-sm ${trend === 'Up' ? 'text-green-600' : 'text-red-600'
          }`}
      >
        {trend === 'Up' ? '' : ''} {percent} {note}
      </div>
    </div>
  );
};