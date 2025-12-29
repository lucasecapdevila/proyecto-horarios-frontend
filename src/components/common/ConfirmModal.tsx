import { Modal } from 'antd';
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  type?: 'warning' | 'error' | 'success' | 'info';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
  loading?: boolean;
  extraContent?: React.ReactNode;
}

const iconMap = {
  warning: <ExclamationCircleOutlined className="text-warning text-2xl" />,
  error: <CloseCircleOutlined className="text-error text-2xl" />,
  success: <CheckCircleOutlined className="text-success text-2xl" />,
  info: <InfoCircleOutlined className="text-brand text-2xl" />,
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  type = 'warning',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  danger = false,
  loading = false,
  extraContent,
}) => {
  return (
    <Modal
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={confirmText}
      cancelText={cancelText}
      okButtonProps={{
        danger,
        loading,
      }}
      width={450}
      centered
    >
      <div className="flex gap-4 py-4">
        <div className="shrink-0">{iconMap[type]}</div>
        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          {extraContent && <div className="mt-4">{extraContent}</div>}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;