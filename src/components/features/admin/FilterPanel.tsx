import { Card, Input, Select, Switch, Button, Space } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Option } = Select;

interface FilterConfig {
  search?: boolean;
  status?: boolean;
  customFilters?: Array<{
    name: string;
    label: string;
    type: 'select' | 'switch';
    options?: Array<{ label: string; value: any }>;
  }>;
}

interface FilterPanelProps {
  config: FilterConfig;
  onFilterChange: (filters: Record<string, any>) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  config,
  onFilterChange,
  onReset,
}) => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters({});
    onReset();
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) => filters[key] !== undefined && filters[key] !== ''
  );

  return (
    <Card className="mb-4 border-gray-200" bodyStyle={{ padding: '16px' }}>
      <div className="space-y-4">
        {/* Barra principal de búsqueda */}
        <div className="flex flex-wrap gap-3 items-center">
          {config.search && (
            <Input
              placeholder="Buscar..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="flex-1 min-w-[200px]"
              allowClear
            />
          )}

          {config.status && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Solo activos:</span>
              <Switch
                checked={filters.onlyActive || false}
                onChange={(checked) =>
                  handleFilterChange('onlyActive', checked)
                }
              />
            </div>
          )}

          {/* Botón para expandir filtros adicionales */}
          {config.customFilters && config.customFilters.length > 0 && (
            <Button
              icon={<FilterOutlined />}
              onClick={() => setIsExpanded(!isExpanded)}
              type={isExpanded ? 'primary' : 'default'}
            >
              Más filtros
            </Button>
          )}

          {hasActiveFilters && (
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReset}
              type="text"
              danger
            >
              Limpiar
            </Button>
          )}
        </div>

        {/* Filtros adicionales expandibles */}
        {isExpanded && config.customFilters && (
          <div className="pt-3 border-t border-gray-200">
            <Space wrap size="middle">
              {config.customFilters.map((filter) => (
                <div key={filter.name} className="min-w-[200px]">
                  {filter.type === 'select' && (
                    <Select
                      placeholder={filter.label}
                      value={filters[filter.name]}
                      onChange={(value) =>
                        handleFilterChange(filter.name, value)
                      }
                      style={{ width: '100%' }}
                      allowClear
                    >
                      {filter.options?.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  )}
                  {filter.type === 'switch' && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {filter.label}:
                      </span>
                      <Switch
                        checked={filters[filter.name] || false}
                        onChange={(checked) =>
                          handleFilterChange(filter.name, checked)
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </Space>
          </div>
        )}

        {/* Indicador de filtros activos */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-500">Filtros activos:</span>
              {Object.entries(filters).map(
                ([key, value]) =>
                  value !== undefined &&
                  value !== '' && (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-brand-50 text-brand text-xs rounded-md"
                    >
                      {key}: {String(value)}
                    </span>
                  )
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FilterPanel;