import { Card, Button, Empty, Tag, Tooltip } from 'antd';
import {
  HolderOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Stop } from '@/types';

interface RouteStopsBuilderProps {
  stops: Stop[];
  stopIds: string[];
  onReorder: (newOrder: string[]) => void;
  onRemove: (stopId: string) => void;
}

const RouteStopsBuilder: React.FC<RouteStopsBuilderProps> = ({
  stops,
  stopIds,
  onReorder,
  onRemove,
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(stopIds);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  const orderedStops = stopIds
    .map((id) => stops.find((s) => s.id === id))
    .filter((stop): stop is Stop => stop !== undefined);

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EnvironmentOutlined className="text-brand" />
            <span className="text-base font-semibold">Orden de Paradas</span>
          </div>
          <Tag color={stopIds.length >= 2 ? 'success' : 'warning'}>
            {stopIds.length} paradas
          </Tag>
        </div>
      }
      className="h-full border-gray-200"
      styles={{ body: { padding: '16px', height: 'calc(100% - 57px)' } }}
      extra={
        <Tooltip title="Arrastra las paradas para reordenarlas">
          <InfoCircleOutlined className="text-gray-400" />
        </Tooltip>
      }
    >
      <div className="flex flex-col h-full">
        {orderedStops.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Agrega al menos 2 paradas para crear la ruta"
              styles={{ image: { height: 80 } }}
            />
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="stops-list">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 overflow-y-auto space-y-2 ${
                    snapshot.isDraggingOver ? 'bg-brand-50 rounded-lg p-2' : ''
                  }`}
                >
                  {orderedStops.map((stop, index) => (
                    <Draggable key={stop.id} draggableId={stop.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-white border rounded-lg transition-all ${
                            snapshot.isDragging
                              ? 'shadow-lg border-brand scale-105'
                              : 'border-gray-200 hover:border-brand'
                          }`}
                        >
                          <div className="flex items-center gap-3 p-3">
                            {/* Drag Handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing"
                            >
                              <HolderOutlined className="text-gray-400 text-lg" />
                            </div>

                            {/* Número de orden */}
                            <div className="shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-semibold text-sm">
                              {index + 1}
                            </div>

                            {/* Información de la parada */}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {stop.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {stop.address || 'Sin dirección'}
                              </p>
                            </div>

                            {/* Botón eliminar */}
                            <Button
                              type="text"
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={() => onRemove(stop.id)}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {/* Indicador de ruta válida */}
        {stopIds.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            {stopIds.length < 2 ? (
              <div className="flex items-center gap-2 text-warning text-xs">
                <InfoCircleOutlined />
                <span>Se requieren al menos 2 paradas para crear una ruta</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-success text-xs">
                <InfoCircleOutlined />
                <span>Ruta válida con {stopIds.length} paradas</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default RouteStopsBuilder;