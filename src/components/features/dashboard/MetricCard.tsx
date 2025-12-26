import { ReactNode } from 'react';
import { Card } from 'antd';
import { colors } from '@/config/designTokens';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  loading = false,
}) => {
  return (
    <Card
      loading={loading}
      className="hover:shadow-card-hover transition-all duration-200 border-gray-200"
      styles={{ body: {padding: '24px'} }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? 'text-success' : 'text-error'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500">vs mes anterior</span>
            </div>
          )}
        </div>
        <div
          className="flex items-center justify-center w-12 h-12 rounded-lg"
          style={{ backgroundColor: `${color}15` }}
        >
          <span style={{ color, fontSize: '24px' }}>{icon}</span>
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;