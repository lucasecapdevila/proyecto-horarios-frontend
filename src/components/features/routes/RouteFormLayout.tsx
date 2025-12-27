import { Row, Col } from 'antd';
import { Control, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { StopSelector, RouteStopsBuilder, RoutePreviewMap } from '.';
import { useCrud } from '@/hooks/useCrud';
import { Stop } from '@/types';
import { FormField } from '@/components/common/FormField';

interface RouteFormLayoutProps {
  formFields: any[];
  control: Control<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

const RouteFormLayout: React.FC<RouteFormLayoutProps> = ({
  formFields,
  control,
  watch,
  setValue,
}) => {
  const [allStops, setAllStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(false);

  const { getAll: getAllStops } = useCrud<Stop>('stops');

  const stopIds = watch('stopIds') || [];

  useEffect(() => {
    const loadStops = async () => {
      setLoading(true);
      try {
        const stops = await getAllStops();
        setAllStops(stops.filter(s => s.isActive));
      } catch (error) {
        console.error('Error al cargar paradas:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStops();
  }, [getAllStops]);

  const handleAddStop = (stopId: string) => {
    const newStopIds = [...stopIds, stopId];
    setValue('stopIds', newStopIds, { shouldValidate: true });
  };

  const handleRemoveStop = (stopId: string) => {
    const newStopIds = stopIds.filter((id: string) => id !== stopId);
    setValue('stopIds', newStopIds, { shouldValidate: true });
  };

  const handleReorderStops = (newOrder: string[]) => {
    setValue('stopIds', newOrder, { shouldValidate: true });
  };

  // Filtrar campos que no son stopIds
  const basicFields = formFields.filter(f => f.name !== 'stopIds');

  return (
    <div className="space-y-4">
      {/* Campos básicos */}
      <div className="space-y-1">
        {basicFields.map((field) => (
          <FormField key={field.name} field={field} control={control} />
        ))}
      </div>

      {/* Constructor de paradas */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Configuración de Paradas
        </h3>
        
        <Row gutter={16} style={{ minHeight: '500px' }}>
          {/* Columna izquierda: Paradas seleccionadas */}
          <Col xs={24} lg={10}>
            <RouteStopsBuilder
              stops={allStops}
              stopIds={stopIds}
              onReorder={handleReorderStops}
              onRemove={handleRemoveStop}
            />
          </Col>

          {/* Columna derecha: Paradas disponibles */}
          <Col xs={24} lg={14}>
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex-1" style={{ minHeight: '300px' }}>
                <StopSelector
                  availableStops={allStops}
                  selectedStopIds={stopIds}
                  onAddStop={handleAddStop}
                  loading={loading}
                />
              </div>
              
              {/* Vista previa */}
              <RoutePreviewMap stops={allStops} stopIds={stopIds} />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default RouteFormLayout;