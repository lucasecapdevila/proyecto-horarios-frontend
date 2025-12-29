import { Button, Space } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { AdminTableHeaderProps } from '@/types';

interface ExtendedAdminTableHeaderProps extends AdminTableHeaderProps {
  onRefresh?: () => void;
  showRefresh?: boolean;
}

const AdminTableHeader: React.FC<ExtendedAdminTableHeaderProps> = ({
  title,
  onNew,
  onRefresh,
  showRefresh = false,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona y administra {title.toLowerCase()}
        </p>
      </div>
      <Space>
        {showRefresh && onRefresh && (
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            Actualizar
          </Button>
        )}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onNew}
          size="large"
        >
          Nuevo
        </Button>
      </Space>
    </div>
  );
};

export default AdminTableHeader;