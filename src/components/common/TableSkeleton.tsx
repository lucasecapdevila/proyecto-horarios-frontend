import { Card, Skeleton } from 'antd';

interface TableSkeletonProps {
  rows?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5 }) => {
  return (
    <Card className="border-gray-200">
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <Skeleton.Input active size="small" style={{ width: 200 }} />
          <Skeleton.Button active size="small" style={{ width: 120 }} />
        </div>

        {/* Rows skeleton */}
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 py-3 border-b border-gray-100"
          >
            <Skeleton.Avatar active size="small" />
            <div className="flex-1 space-y-2">
              <Skeleton.Input
                active
                size="small"
                style={{ width: `${Math.random() * 40 + 60}%` }}
              />
            </div>
            <Skeleton.Button active size="small" style={{ width: 80 }} />
          </div>
        ))}

        {/* Pagination skeleton */}
        <div className="flex justify-end pt-4">
          <Skeleton.Button active size="small" style={{ width: 200 }} />
        </div>
      </div>
    </Card>
  );
};

export default TableSkeleton;