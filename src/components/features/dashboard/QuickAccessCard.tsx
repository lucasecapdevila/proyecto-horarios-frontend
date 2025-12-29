import { Card } from 'antd';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface QuickAccessCardProps {
  title: string;
  icon: ReactNode;
  to: string;
  color: string;
  description?: string;
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({
  title,
  icon,
  to,
  color,
  description,
}) => {
  return (
    <Link to={to}>
      <Card
        hoverable
        className="text-center h-full transition-all duration-200 border-gray-200 hover:border-brand"
        styles={{ body: {padding: '24px'} }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-xl mb-2"
            style={{ backgroundColor: `${color}15` }}
          >
            <span style={{ color, fontSize: '32px' }}>{icon}</span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default QuickAccessCard;