import { Breadcrumb as AntBreadcrumb } from 'antd';
import type { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { Link, useLocation } from 'react-router-dom';
import { useMemo } from 'react';

const routeLabels: Record<string, string> = {
  'admin': 'Panel de Administración',
  'companies': 'Empresas',
  'stops': 'Paradas',
  'routes': 'Rutas',
  'schedules': 'Horarios',
  'users': 'Usuarios',
};

const Breadcrumb: React.FC = () => {
  const location = useLocation();

  const breadcrumbItems = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    const items: BreadcrumbItemType[] = [
      {
        title: (
          <Link to="/" className="flex items-center gap-1 hover:text-brand transition-colors">
            <span>Inicio</span>
          </Link>
        ),
      },
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

      if (isLast) {
        items.push({
          title: <span className="text-gray-600">{label}</span>,
        });
      } else {
        items.push({
          title: (
            <Link 
              to={currentPath} 
              className="hover:text-brand transition-colors"
            >
              {label}
            </Link>
          ),
        });
      }
    });

    return items;
  }, [location.pathname]);

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
      <AntBreadcrumb
        items={breadcrumbItems}
        separator="›"
        className="text-sm"
      />
    </div>
  );
};

export default Breadcrumb;