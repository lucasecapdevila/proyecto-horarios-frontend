import { Controller, Control, RegisterOptions } from 'react-hook-form';
import { Input, Select, Switch, TimePicker, InputNumber, Form } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface FormFieldProps {
  field: {
    name: string;
    label: string;
    type?: 'text' | 'email' | 'select' | 'multiselect' | 'switch' | 'time' | 'number' | 'textarea' | 'password';
    options?: Array<{ label: string; value: any }>;
    rules?: {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      min?: number;
      max?: number;
      pattern?: RegExp;
    };
    placeholder?: string;
    disabled?: boolean;
    helpText?: string;
  };
  control: Control<any>;
}

const FormField: React.FC<FormFieldProps> = ({ field, control }) => {
  const getValidationRules = (): RegisterOptions => {
    const rules: RegisterOptions = {};

    if (field.rules?.required) {
      rules.required = `${field.label} es requerido`;
    }

    if (field.rules?.minLength) {
      rules.minLength = {
        value: field.rules.minLength,
        message: `Mínimo ${field.rules.minLength} caracteres`,
      };
    }

    if (field.rules?.maxLength) {
      rules.maxLength = {
        value: field.rules.maxLength,
        message: `Máximo ${field.rules.maxLength} caracteres`,
      };
    }

    if (field.type === 'email') {
      rules.pattern = {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Email inválido',
      };
    }

    if (field.rules?.pattern) {
      rules.pattern = {
        value: field.rules.pattern,
        message: 'Formato inválido',
      };
    }

    return rules;
  };

  const renderField = (fieldState: any, fieldProps: any) => {
    const { error } = fieldState;
    const hasError = !!error;
    const isValid = !hasError && fieldProps.value !== undefined && fieldProps.value !== '' && fieldProps.value !== null;

    const commonProps = {
      ...fieldProps,
      status: hasError ? ('error' as const) : undefined,
      disabled: field.disabled,
      placeholder: field.placeholder || field.label,
      className: 'w-full',
    };

    // Sufijo con íconos de validación
    const validationSuffix = field.type !== 'switch' && field.type !== 'select' && field.type !== 'multiselect' ? (
      <span className="flex items-center">
        {hasError && <CloseCircleOutlined className="text-error" />}
        {isValid && <CheckCircleOutlined className="text-success" />}
      </span>
    ) : null;

    switch (field.type) {
      case 'textarea':
        return (
          <TextArea
            {...commonProps}
            rows={4}
            showCount
            maxLength={field.rules?.maxLength}
          />
        );

      case 'email':
        return (
          <Input
            {...commonProps}
            type="email"
            suffix={validationSuffix}
          />
        );

      case 'password':
        return (
          <Input.Password
            {...commonProps}
            suffix={validationSuffix}
          />
        );

      case 'number':
        return (
          <InputNumber
            {...commonProps}
            min={field.rules?.min}
            max={field.rules?.max}
            style={{ width: '100%' }}
          />
        );

      case 'select':
        return (
          <Select
            {...commonProps}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => {
              const label = option?.label;
              if (typeof label === 'string') {
                return label.toLowerCase().includes(input.toLowerCase());
              }
              return false;
            }}
          >
            {field.options?.map((option) => (
              <Option key={option.value} value={option.value} label={option.label}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case 'multiselect':
        return (
          <Select
            {...commonProps}
            mode="multiple"
            showSearch
            optionFilterProp="children"
            maxTagCount="responsive"
            filterOption={(input, option) => {
              const label = option?.label;
              if (typeof label === 'string') {
                return label.toLowerCase().includes(input.toLowerCase());
              }
              return false;
            }}
          >
            {field.options?.map((option) => (
              <Option key={option.value} value={option.value} label={option.label}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case 'time':
        return (
          <TimePicker
            {...commonProps}
            format="HH:mm"
            value={fieldProps.value ? dayjs(fieldProps.value, 'HH:mm') : null}
            onChange={(time) => {
              fieldProps.onChange(time ? time.format('HH:mm') : null);
            }}
            style={{ width: '100%' }}
          />
        );

      case 'switch':
        return (
          <div className="flex items-center gap-2">
            <Switch
              {...fieldProps}
              checked={fieldProps.value || false}
            />
            <span className="text-sm text-gray-600">
              {fieldProps.value ? 'Activado' : 'Desactivado'}
            </span>
          </div>
        );

      default:
        return (
          <Input
            {...commonProps}
            suffix={validationSuffix}
          />
        );
    }
  };

  return (
    <Controller
      name={field.name}
      control={control}
      rules={getValidationRules()}
      render={({ field: fieldProps, fieldState }) => (
        <Form.Item
          label={
            <span className="font-medium text-gray-700">
              {field.label}
              {field.rules?.required && (
                <span className="text-error ml-1">*</span>
              )}
            </span>
          }
          validateStatus={fieldState.error ? 'error' : 'success'}
          help={
            fieldState.error ? (
              <span className="text-error text-xs">
                {fieldState.error.message}
              </span>
            ) : field.helpText ? (
              <span className="text-gray-500 text-xs">{field.helpText}</span>
            ) : null
          }
          className="mb-4"
        >
          {renderField(fieldState, fieldProps)}
        </Form.Item>
      )}
    />
  );
};

export default FormField;