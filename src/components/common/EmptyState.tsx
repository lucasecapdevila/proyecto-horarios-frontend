import { Empty, Button } from 'antd';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        imageStyle={{
          height: 80,
        }}
        description={
          <div className="space-y-3 mt-4">
            {icon && (
              <div className="flex justify-center text-5xl text-gray-400 mb-4">
                {icon}
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="text-sm text-gray-500 max-w-md">{description}</p>
            )}
          </div>
        }
      >
        {action && (
          <Button
            type="primary"
            size="large"
            onClick={action.onClick}
            className="mt-4"
          >
            {action.label}
          </Button>
        )}
      </Empty>
    </div>
  );
};

export default EmptyState;