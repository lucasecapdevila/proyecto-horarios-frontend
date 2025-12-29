import { Avatar, Dropdown, Badge, MenuProps } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  BellOutlined 
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { colors } from '@/config/designTokens';

const UserHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div className="px-2 py-2 border-b border-gray-200">
          <p className="font-semibold text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-brand-50 text-brand text-xs rounded-full font-medium">
            {user?.role}
          </span>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Configuración',
      onClick: () => {
        // TODO: Implementar ruta de configuración
        console.log('Ir a configuración');
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar sesión',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Título o breadcrumb placeholder */}
        <div className="flex-1">
          {/* Aquí irá el breadcrumb o título de página */}
        </div>

        {/* Acciones del usuario */}
        <div className="flex items-center gap-4">
          {/* Notificaciones */}
          <Badge count={0} showZero={false}>
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notificaciones"
            >
              <BellOutlined className="text-lg text-gray-600" />
            </button>
          </Badge>

          {/* Usuario */}
          <Dropdown 
            menu={{ items: menuItems }} 
            trigger={['click']}
            placement="bottomRight"
          >
            <button className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors">
              <Avatar 
                icon={<UserOutlined />}
                style={{ 
                  backgroundColor: colors.brand[500],
                  cursor: 'pointer'
                }}
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;