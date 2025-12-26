import { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import {
  TeamOutlined,
  BankOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { AdminLayout } from '../layout';
import {
  MetricCard,
  QuickAccessCard,
  RecentActivity,
} from '../features/dashboard';
import { colors } from '@/config/designTokens';
import { useCrud } from '@/hooks/useCrud';
import { Company, Route, Stop, User } from '@/types';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    users: 0,
    companies: 0,
    routes: 0,
    stops: 0,
  });

  const { getAll: getAllUsers } = useCrud<User>('users');
  const { getAll: getAllCompanies } = useCrud<Company>('companies');
  const { getAll: getAllRoutes } = useCrud<Route>('routes');
  const { getAll: getAllStops } = useCrud<Stop>('stops');

  useEffect(() => {
    const loadMetrics = async () => {
      setLoading(true);
      try {
        const [users, companies, routes, stops] = await Promise.all([
          getAllUsers(),
          getAllCompanies(),
          getAllRoutes(),
          getAllStops(),
        ]);

        setMetrics({
          users: users.length,
          companies: companies.filter((c) => c.isActive).length,
          routes: routes.filter((r) => r.isActive).length,
          stops: stops.filter((s) => s.isActive).length,
        });
      } catch (error) {
        console.error('Error al cargar métricas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [getAllUsers, getAllCompanies, getAllRoutes, getAllStops]);

  // Mock de actividad reciente (después conectarás con el backend)
  const recentActivities = [
    {
      id: '1',
      type: 'create' as const,
      entity: 'Ruta',
      description: 'Nueva ruta "Centro-Norte" creada',
      user: 'Admin Usuario',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // hace 5 minutos
    },
    {
      id: '2',
      type: 'update' as const,
      entity: 'Empresa',
      description: 'Información de "Transportes del Norte" actualizada',
      user: 'Operador Juan',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // hace 30 minutos
    },
    {
      id: '3',
      type: 'create' as const,
      entity: 'Parada',
      description: 'Nueva parada "Terminal Central" agregada',
      user: 'Admin Usuario',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // hace 2 horas
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Administración
          </h1>
          <p className="mt-2 text-gray-600">
            Gestión integral del sistema de transporte
          </p>
        </div>

        {/* Métricas */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <MetricCard
              title="Usuarios Activos"
              value={metrics.users}
              icon={<TeamOutlined />}
              color={colors.brand[500]}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <MetricCard
              title="Empresas Activas"
              value={metrics.companies}
              icon={<BankOutlined />}
              color={colors.success[500]}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <MetricCard
              title="Rutas Operativas"
              value={metrics.routes}
              icon={<EnvironmentOutlined />}
              color={colors.info[500]}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <MetricCard
              title="Paradas Registradas"
              value={metrics.stops}
              icon={<EnvironmentOutlined />}
              color={colors.warning[500]}
              loading={loading}
            />
          </Col>
        </Row>

        {/* Accesos Rápidos */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Acceso Rápido
          </h2>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={8} lg={4}>
              <QuickAccessCard
                title="Usuarios"
                icon={<TeamOutlined />}
                to="/admin/manage#users"
                color={colors.brand[500]}
                description="Gestionar usuarios"
              />
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <QuickAccessCard
                title="Empresas"
                icon={<BankOutlined />}
                to="/admin/manage#companies"
                color={colors.success[500]}
                description="Gestionar empresas"
              />
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <QuickAccessCard
                title="Paradas"
                icon={<EnvironmentOutlined />}
                to="/admin/manage#stops"
                color={colors.warning[500]}
                description="Gestionar paradas"
              />
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <QuickAccessCard
                title="Rutas"
                icon={<EnvironmentOutlined />}
                to="/admin/manage#routes"
                color={colors.info[500]}
                description="Gestionar rutas"
              />
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <QuickAccessCard
                title="Horarios"
                icon={<ClockCircleOutlined />}
                to="/admin/manage#schedules"
                color={colors.brand[600]}
                description="Gestionar horarios"
              />
            </Col>
          </Row>
        </div>

        {/* Actividad Reciente */}
        <RecentActivity activities={recentActivities} />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;