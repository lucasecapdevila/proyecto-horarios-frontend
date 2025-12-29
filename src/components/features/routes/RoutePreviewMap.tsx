import { Card, Empty } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Stop } from '@/types';

interface RoutePreviewMapProps {
  stops: Stop[];
  stopIds: string[];
}

const RoutePreviewMap: React.FC<RoutePreviewMapProps> = ({ stops, stopIds }) => {
  const orderedStops = stopIds
    .map((id) => stops.find((s) => s.id === id))
    .filter((stop): stop is Stop => stop !== undefined);

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <EnvironmentOutlined className="text-brand" />
          <span className="text-base font-semibold">Vista Previa del Recorrido</span>
        </div>
      }
      className="border-gray-200"
      styles={{ body: { padding: '16px' } }}
    >
      {orderedStops.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Agrega paradas para ver el recorrido"
          styles={{ image: { height: 60 } }}
        />
      ) : (
        <div className="space-y-3">
          {/* Visualización simple por ahora */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-wrap gap-2 items-center">
              {orderedStops.map((stop, index) => (
                <div key={stop.id} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {stop.name}
                    </span>
                  </div>
                  {index < orderedStops.length - 1 && (
                    <span className="text-gray-400">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-gray-600 text-xs mb-1">Total de paradas</p>
              <p className="text-brand font-semibold text-lg">{orderedStops.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-gray-600 text-xs mb-1">Distancia estimada</p>
              <p className="text-success font-semibold text-lg">
                {(orderedStops.length * 1.2).toFixed(1)} km
              </p>
            </div>
          </div>

          {/* Nota sobre mapa */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
            <p className="font-medium mb-1">💡 Próximamente:</p>
            <p>Vista de mapa interactivo con el recorrido completo de la ruta</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default RoutePreviewMap;