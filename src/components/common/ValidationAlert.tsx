import { Alert } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

interface ValidationAlertProps {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  description?: string;
  closable?: boolean;
  onClose?: () => void;
  showIcon?: boolean;
}

const iconMap = {
  success: <CheckCircleOutlined />,
  info: <InfoCircleOutlined />,
  warning: <ExclamationCircleOutlined />,
  error: <CloseCircleOutlined />,
};

const ValidationAlert: React.FC<ValidationAlertProps> = ({
  type,
  message,
  description,
  closable = false,
  onClose,
  showIcon = true,
}) => {
  return (
    <Alert
      type={type}
      message={<span className="font-medium">{message}</span>}
      description={description}
      showIcon={showIcon}
      icon={iconMap[type]}
      closable={closable}
      onClose={onClose}
      className="mb-4"
      style={{
        borderRadius: '8px',
      }}
    />
  );
};

export default ValidationAlert;