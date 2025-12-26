import { Card, List, Avatar, Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.locale('es');

interface Activity {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  description: string;
  user: string;
  timestamp: Date;
}

interface RecentActivityProps {
  activities?: Activity[];
  loading?: boolean;
}

const activityColors = {
  create: 'success',
  update: 'warning',
  delete: 'error',
} as const;

const activityLabels = {
  create: 'Creado',
  update: 'Actualizado',
  delete: 'Eliminado',
} as const;

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities = [],
  loading = false,
}) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-brand" />
          <span>Actividad Reciente</span>
        </div>
      }
      className="border-gray-200"
      styles={{ body: { padding: 0 } }}
    >
      <List
        loading={loading}
        dataSource={activities}
        locale={{ emptyText: 'No hay actividad reciente' }}
        renderItem={(activity) => (
          <List.Item
            className="px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <List.Item.Meta
              avatar={
                <Avatar style={{ backgroundColor: '#0c5392' }}>
                  {activity.user.charAt(0).toUpperCase()}
                </Avatar>
              }
              title={
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900">
                    {activity.user}
                  </span>
                  <Tag color={activityColors[activity.type]} className="m-0">
                    {activityLabels[activity.type]}
                  </Tag>
                  <span className="text-gray-600">{activity.entity}</span>
                </div>
              }
              description={
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    {dayjs(activity.timestamp).fromNow()}
                  </p>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentActivity;