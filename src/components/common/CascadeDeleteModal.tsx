import { Alert, List, Modal, Tag } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { CascadeDeleteModalProps } from "@/types";

const CascadeDeleteModal: React.FC<CascadeDeleteModalProps> = ({ data, onConfirm, onCancel }) => {
  const { entityType, routesCount, schedulesCount, routes, schedulesPreview } = data;

  const entityNames = {
    company: { singular: 'empresa', plural: 'empresas' },
    route: { singular: 'ruta', plural: 'rutas' },
    stop: { singular: 'parada', plural: 'paradas' },
    schedule: { singular: 'horario', plural: 'horarios' },
  };

  const currentEntity = entityNames[entityType];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg">
          <WarningOutlined className="text-warning" />
          <span>Confirmar Eliminación en Cascada</span>
        </div>
      }
      open={true}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Sí, eliminar todo"
      cancelText="Cancelar"
      okButtonProps={{ danger: true }}
      width={600}
    >
      <div className="space-y-4 mt-4">
        <Alert
          type="warning"
          showIcon
          message="Esta operación eliminará elementos relacionados"
          description={`Al eliminar esta ${currentEntity.singular}, se eliminarán permanentemente los elementos asociados.`}
        />

        {/* Mostrar rutas afectadas */}
        {routesCount !== undefined && routesCount > 0 && (
          <div>
            <p className="font-semibold text-gray-900 mb-2">
              Rutas que se eliminarán: {routesCount}
            </p>
            {routes && routes.length > 0 && (
              <List
                size="small"
                bordered
                dataSource={routes}
                renderItem={(route: any) => (
                  <List.Item>
                    <span className="text-gray-700">{route.name || `Ruta #${route.id}`}</span>
                    <Tag color="orange">Ruta</Tag>
                  </List.Item>
                )}
                style={{ maxHeight: '200px', overflow: 'auto' }}
              />
            )}
          </div>
        )}

        {/* Mostrar horarios afectados */}
        {schedulesCount !== undefined && schedulesCount > 0 && (
          <div>
            <p className="font-semibold text-gray-900 mb-2">
              Horarios que se eliminarán: {schedulesCount}
            </p>
            {schedulesPreview && schedulesPreview.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {schedulesPreview.map((scheduleId) => (
                  <Tag key={scheduleId} color="red">
                    Horario #{scheduleId}
                  </Tag>
                ))}
                {schedulesCount > schedulesPreview.length && (
                  <Tag>+{schedulesCount - schedulesPreview.length} más</Tag>
                )}
              </div>
            )}
          </div>
        )}

        {/* Advertencia final */}
        <Alert
          type="error"
          showIcon
          message="Esta acción no se puede deshacer"
          description="Una vez confirmada la eliminación, todos los datos asociados se perderán permanentemente."
        />

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>Resumen:</strong>
          </p>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li>• Se eliminará 1 {currentEntity.singular}</li>
            {routesCount ? <li>• Se eliminarán {routesCount} {routesCount === 1 ? 'ruta' : 'rutas'}</li> : null}
            {schedulesCount ? <li>• Se eliminarán {schedulesCount} {schedulesCount === 1 ? 'horario' : 'horarios'}</li> : null}
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default CascadeDeleteModal;
