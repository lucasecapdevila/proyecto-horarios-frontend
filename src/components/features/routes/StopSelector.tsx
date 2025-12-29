import { useState } from 'react';
import { Card, Input, List, Button, Empty } from 'antd';
import { SearchOutlined, PlusOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Stop } from '@/types';

interface StopSelectorProps {
  availableStops: Stop[];
  selectedStopIds: string[];
  onAddStop: (stopId: string) => void;
  loading?: boolean;
}

const StopSelector: React.FC<StopSelectorProps> = ({
  availableStops,
  selectedStopIds,
  onAddStop,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStops = availableStops.filter((stop) => {
    const isNotSelected = !selectedStopIds.includes(stop.id);
    const matchesSearch = stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          stop.address?.toLowerCase().includes(searchTerm.toLowerCase());
    return isNotSelected && matchesSearch && stop.isActive;
  });

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <EnvironmentOutlined className="text-brand" />
          <span className="text-base font-semibold">Paradas Disponibles</span>
        </div>
      }
      className="h-full border-gray-200"
      styles={{ body: { padding: '16px', height: 'calc(100% - 57px)' } }}
    >
      <div className="flex flex-col h-full gap-3">
        {/* Buscador */}
        <Input
          placeholder="Buscar parada..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />

        {/* Lista de paradas */}
        <div className="flex-1 overflow-y-auto">
          {filteredStops.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                searchTerm
                  ? 'No se encontraron paradas'
                  : 'Todas las paradas ya están agregadas'
              }
              styles={{ image: { height: 60 } }}
            />
          ) : (
            <List
              dataSource={filteredStops}
              loading={loading}
              renderItem={(stop) => (
                <List.Item
                  className="hover:bg-gray-50 transition-colors rounded-lg px-2 cursor-pointer"
                  onClick={() => onAddStop(stop.id)}
                >
                  <List.Item.Meta
                    avatar={
                      <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center">
                        <EnvironmentOutlined className="text-brand" />
                      </div>
                    }
                    title={
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{stop.name}</span>
                        <Button
                          type="primary"
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddStop(stop.id);
                          }}
                        />
                      </div>
                    }
                    description={
                      <span className="text-xs text-gray-500">{stop.address || 'Sin dirección'}</span>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>

        {/* Contador */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Disponibles: {filteredStops.length}</span>
            <span>Seleccionadas: {selectedStopIds.length}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StopSelector;