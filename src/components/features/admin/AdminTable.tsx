import { useState, useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
  Button,
  Modal,
  Popconfirm,
  Table,
  Alert,
  TableProps,
  Card,
} from 'antd';
import { CheckOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';

import toast from 'react-hot-toast';
import { AdminTableProps, CascadeModalData, ApiEndpoint } from '@/types';
import {
  useAdminTable,
  useBulkSelection,
  useFormValidation,
} from '@/hooks/features';
import {
  CascadeDeleteModal,
  EmptyState,
  TableSkeleton,
  ValidationAlert,
} from '@/components/common';
import AdminTableHeader from './AdminTableHeader';
import FilterPanel from './FilterPanel';
import { BulkActionBar, QuickFilters } from './BulkActions';
import { FormField } from '@/components/common/FormField';
import { colors } from '@/config';

const AdminTable: React.FC<AdminTableProps> = ({
  title,
  endpoint,
  columns,
  formFields,
}) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [cascadeModal, setCascadeModal] = useState<CascadeModalData | null>(
    null,
  );
  const [localFilters, setLocalFilters] = useState<Record<string, any>>({});

  const {
    data,
    loading,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleBulkDelete,
    paginationConfig,
    refetch,
  } = useAdminTable(endpoint as ApiEndpoint);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    validationAlert,
    isValid,
    validateBeforeSubmit,
    clearValidation,
  } = useFormValidation(endpoint);

  const {
    selectedRowKeys,
    setSelectedRowKeys,
    handleQuickSelect,
    getUniqueLines,
    getUniqueRoutes,
    clearSelection,
    selectedCount,
  } = useBulkSelection(data);

  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Filtrado local
  const filteredData = useMemo(() => {
    let result = [...data];

    // Búsqueda por texto
    if (localFilters.search) {
      const searchLower = localFilters.search.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchLower),
        ),
      );
    }

    // Filtro de solo activos
    if (localFilters.onlyActive) {
      result = result.filter((item) => item.isActive === true);
    }

    // Filtros personalizados
    if (localFilters.companyId) {
      result = result.filter(
        (item) => item.companyId === localFilters.companyId,
      );
    }

    if (localFilters.routeId) {
      result = result.filter((item) => item.routeId === localFilters.routeId);
    }

    if (localFilters.role) {
      result = result.filter((item) => item.role === localFilters.role);
    }

    if (localFilters.hasLocation) {
      result = result.filter(
        (item) => item.locationId !== null && item.locationId !== undefined,
      );
    }

    if (localFilters.hasCoordinates) {
      result = result.filter((item) => item.latitude && item.longitude);
    }

    return result;
  }, [data, localFilters]);

  const handleOpen = async (record: any = null) => {
    if (record) {
      setEditing(record);
      formFields.forEach((field) => {
        setValue(field.name, record[field.name]);
      });
    } else {
      setEditing(null);
      reset();
    }
    clearValidation();
    setOpen(true);
  };

  const onSubmit = async (values: any) => {
    const validation = validateBeforeSubmit();

    if (!validation.valid) {
      toast.error(validation.message || 'Error de validación');
      return;
    }

    const result = editing
      ? await handleUpdate(editing.id, values)
      : await handleCreate(values);

    if (result.success) {
      setOpen(false);
      reset();
      clearValidation();
    }
  };

  const handleDeleteClick = async (id: number) => {
    const result = await handleDelete(id, false);

    if (result.conflict) {
      const entityTypeMap: Record<string, CascadeModalData['entityType']> = {
        companies: 'company',
        routes: 'route',
        stops: 'stop',
        schedules: 'schedule',
      };

      setCascadeModal({
        id,
        entityType: entityTypeMap[endpoint] || 'company',
        ...result.conflict_data,
      });
    } else if (result.success) {
      clearSelection();
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedCount === 0) {
      toast.error('Seleccione al menos un registro.');
      return;
    }
    setBulkModalOpen(true);
  };

  const handleFilterChange = (filters: Record<string, any>) => {
    setLocalFilters(filters);
  };

  const handleResetFilters = () => {
    setLocalFilters({});
  };

  const tableColumns = [
    ...columns.map((col) => ({
      ...col,
      align: col.align as 'left' | 'right' | 'center' | undefined,
    })),
    {
      title: 'Acciones',
      align: 'center' as const,
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <div className="flex justify-center gap-1">
          <Button
            type="link"
            onClick={() => handleOpen(record)}
            icon={<EditOutlined />}
            className="text-brand hover:text-brand-600"
          />
          <Popconfirm
            title={`¿Eliminar este ${title.toLowerCase()}?`}
            description={
              endpoint === 'lineas'
                ? 'Si contiene recorridos/horarios, estos se perderán.'
                : endpoint === 'recorridos'
                  ? 'Si contiene horarios, estos se perderán.'
                  : endpoint === 'users'
                    ? 'No se puede eliminar el último administrador'
                    : 'Esta acción no se puede deshacer'
            }
            onConfirm={() => handleDeleteClick(record.id)}
            okText="Sí, eliminar"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const rowSelection: TableProps<any>['rowSelection'] =
    endpoint === 'horarios'
      ? {
          selectedRowKeys,
          onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys as number[]);
          },
          selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
          ],
        }
      : undefined;

  const emptyMessages = {
    companies: {
      title: 'No hay empresas registradas',
      description: 'Comienza agregando la primera empresa de transporte',
    },
    stops: {
      title: 'No hay paradas registradas',
      description: 'Agrega la primera parada para comenzar',
    },
    routes: {
      title: 'No hay rutas configuradas',
      description: 'Crea la primera ruta de transporte',
    },
    schedules: {
      title: 'No hay horarios definidos',
      description: 'Configura el primer horario',
    },
    users: {
      title: 'No hay usuarios registrados',
      description: 'Agrega el primer usuario al sistema',
    },
  };

  if (loading && data.length === 0) {
    return <TableSkeleton rows={8} />;
  }

  const getCustomFilters = () => {
    const filters: Array<{
      name: string;
      label: string;
      type: 'select' | 'switch';
      options?: Array<{ label: string; value: any }>;
    }> = [];

    switch (endpoint) {
      case 'companies':
        filters.push({
          name: 'hasLocation',
          label: 'Con ubicación',
          type: 'switch',
        });
        break;

      case 'routes':
        // Buscar opciones de empresa si existen
        const companyField = formFields.find((f) => f.name === 'companyId');
        if (companyField?.options && companyField.options.length > 0) {
          filters.push({
            name: 'companyId',
            label: 'Filtrar por empresa',
            type: 'select',
            options: companyField.options,
          });
        }
        break;

      case 'stops':
        filters.push({
          name: 'hasCoordinates',
          label: 'Con coordenadas GPS',
          type: 'switch',
        });
        break;

      case 'schedules':
        const routeField = formFields.find((f) => f.name === 'routeId');
        if (routeField?.options && routeField.options.length > 0) {
          filters.push({
            name: 'routeId',
            label: 'Filtrar por ruta',
            type: 'select',
            options: routeField.options,
          });
        }
        break;

      case 'users':
        const roleField = formFields.find((f) => f.name === 'role');
        if (roleField?.options && roleField.options.length > 0) {
          filters.push({
            name: 'role',
            label: 'Filtrar por rol',
            type: 'select',
            options: roleField.options,
          });
        }
        break;
    }

    return filters;
  };

  return (
    <div className="space-y-4">
      <AdminTableHeader
        title={title}
        onNew={() => handleOpen()}
        onRefresh={refetch}
        showRefresh
      />

      {/* Panel de filtros */}
      <FilterPanel
        config={{
          search: true,
          status: true,
          customFilters: getCustomFilters(),
        }}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {endpoint === 'horarios' && (
        <>
          <BulkActionBar
            selectedCount={selectedCount}
            onBulkDelete={handleBulkDeleteClick}
            onClearSelection={clearSelection}
          />

          <QuickFilters
            uniqueLines={getUniqueLines()}
            uniqueRoutes={getUniqueRoutes()}
            onQuickSelect={handleQuickSelect as any}
          />
        </>
      )}

      {/* Tabla o estado vacío */}
      {filteredData.length === 0 && !loading ? (
        <EmptyState
          title={
            localFilters.search || localFilters.onlyActive
              ? 'No se encontraron resultados'
              : emptyMessages[endpoint as keyof typeof emptyMessages]?.title ||
                'No hay datos'
          }
          description={
            localFilters.search || localFilters.onlyActive
              ? 'Intenta ajustar los filtros de búsqueda'
              : emptyMessages[endpoint as keyof typeof emptyMessages]
                  ?.description
          }
          action={{
            label: `Crear ${title}`,
            onClick: () => handleOpen(),
          }}
        />
      ) : isMobile && endpoint === 'horarios' ? (
        <div className="space-y-2">
          {filteredData.map((item) => (
            <Card
              key={item.id}
              className="shadow-sm hover:shadow-md transition-shadow"
              size="small"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-gray-800">
                    {item.origen} → {item.destino}
                  </p>
                  <span className="text-xs text-gray-500">#{item.id}</span>
                </div>

                <p className="text-gray-600">
                  {item.hora_salida} — {item.hora_llegada}
                </p>
                <p className="text-sm text-gray-500">{item.tipo_dia}</p>
                <p className="text-xs text-gray-400">
                  Línea: {item.linea_nombre || '-'}
                </p>

                <div className="flex justify-end gap-2 pt-2">
                  <Button size="small" onClick={() => handleOpen(item)}>
                    Editar
                  </Button>
                  <Popconfirm
                    title="¿Eliminar este registro?"
                    description="Esta acción no se puede deshacer."
                    okText="Sí, eliminar"
                    cancelText="Cancelar"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => handleDeleteClick(item.id)}
                  >
                    <Button size="small" danger>
                      Eliminar
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-sm border-gray-200">
          <Table
            rowSelection={rowSelection}
            columns={tableColumns}
            dataSource={filteredData}
            rowKey="id"
            loading={loading}
            pagination={paginationConfig}
            size="middle"
            scroll={{ x: 'max-content' }}
            className="w-full"
          />
        </Card>
      )}

      {/* Modal de formulario */}
      <Modal
  title={
    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${colors.brand[500]}15` }}
      >
        {editing ? (
          <EditOutlined style={{ color: colors.brand[500], fontSize: '20px' }} />
        ) : (
          <PlusOutlined style={{ color: colors.brand[500], fontSize: '20px' }} />
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-900 m-0">
          {editing ? `Editar ${title}` : `Nuevo ${title}`}
        </h2>
        <p className="text-sm text-gray-500 m-0">
          {editing
            ? 'Modifica la información del registro'
            : 'Complete los campos para crear un nuevo registro'}
        </p>
      </div>
    </div>
  }
  open={open}
  onCancel={() => {
    setOpen(false);
    clearValidation();
  }}
  footer={
    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
      <div className="text-xs text-gray-500">
        {formFields.filter(f => f.rules?.required).length > 0 && (
          <span>
            <span className="text-error">*</span> Campos obligatorios
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            setOpen(false);
            clearValidation();
          }}
          size="large"
        >
          Cancelar
        </Button>
        <Button
          type="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
          size="large"
          icon={editing ? <CheckOutlined /> : <PlusOutlined />}
        >
          {editing ? 'Guardar cambios' : 'Crear'}
        </Button>
      </div>
    </div>
  }
  width={700}
  destroyOnHidden
  centered
  className="modal-form-enhanced"
>
  <form onSubmit={handleSubmit(onSubmit)} className="py-4">
    {validationAlert && (
      <ValidationAlert
        type={validationAlert.type}
        message={validationAlert.message}
        closable
        onClose={clearValidation}
      />
    )}

    <div className="space-y-1">
      {formFields.map((field) => (
        <FormField key={field.name} field={field} control={control} />
      ))}
    </div>

    {/* Info adicional para horarios */}
    {endpoint === 'schedules' && (
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-2">
          <InfoCircleOutlined className="text-brand mt-0.5" />
          <div className="text-xs text-gray-600">
            <p className="font-medium text-gray-700 mb-1">Nota sobre horarios:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>La duración del viaje debe estar entre 5 minutos y 10 horas</li>
              <li>Se permite paso de medianoche (ej: 23:00 - 01:00)</li>
              <li>Debes seleccionar al menos un día de operación</li>
            </ul>
          </div>
        </div>
      </div>
    )}
  </form>
</Modal>

      {/* Modal de eliminación masiva */}
      <Modal
        open={bulkModalOpen}
        onCancel={() => setBulkModalOpen(false)}
        footer={null}
        width={500}
        title={`Eliminar ${selectedRowKeys.length} ${title.toLowerCase()}?`}
      >
        <div className="space-y-4 mt-3">
          <Alert
            type="warning"
            showIcon
            message={`Total: ${selectedCount} registros seleccionados`}
          />

          <p className="text-red-600 font-semibold">
            Esta acción no se puede deshacer.
          </p>

          <div className="flex justify-end gap-2 mt-5">
            <Button onClick={() => setBulkModalOpen(false)}>Cancelar</Button>

            <Button
              danger
              type="primary"
              size="middle"
              onClick={async () => {
                const result = await handleBulkDelete(selectedRowKeys);

                if (result.success) {
                  clearSelection();
                  setBulkModalOpen(false);
                }
              }}
            >
              Sí, eliminar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de eliminación en cascada */}
      {cascadeModal && (
        <CascadeDeleteModal
          data={cascadeModal}
          onConfirm={async () => {
            const result = await handleDelete(cascadeModal.id, true);

            if (result.success) {
              clearSelection();
            }
            setCascadeModal(null);
          }}
          onCancel={() => setCascadeModal(null)}
        />
      )}
    </div>
  );
};

export default AdminTable;
