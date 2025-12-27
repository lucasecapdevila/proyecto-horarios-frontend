import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

interface ValidationAlert {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface UseFormValidationReturn {
  control: any;
  handleSubmit: any;
  reset: any;
  setValue: any;
  watch: any;
  formState: any;
  validationAlert: ValidationAlert | null;
  isValid: boolean;
  validateBeforeSubmit: () => { valid: boolean; message?: string };
  clearValidation: () => void;
  setCustomError: (message: string) => void;
  setCustomSuccess: (message: string) => void;
}

const useFormValidation = (entityType: string): UseFormValidationReturn => {
  const [validationAlert, setValidationAlert] = useState<ValidationAlert | null>(null);
  
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState,
  } = useForm({
    mode: 'onChange', // Validación en tiempo real
  });

  const { errors, isValid, isDirty } = formState;

  // Validar horarios (ejemplo de validación personalizada)
  const validateScheduleTimes = (departureTime: string, arrivalTime: string): boolean => {
    if (!departureTime || !arrivalTime) return true;
    
    const [depHour, depMin] = departureTime.split(':').map(Number);
    const [arrHour, arrMin] = arrivalTime.split(':').map(Number);
    
    const depMinutes = depHour * 60 + depMin;
    const arrMinutes = arrHour * 60 + arrMin;
    
    // Permitir paso de medianoche
    if (arrMinutes < depMinutes) {
      const duration = (24 * 60 - depMinutes) + arrMinutes;
      if (duration < 5 || duration > 600) { // 5 min - 10 horas
        return false;
      }
    } else {
      const duration = arrMinutes - depMinutes;
      if (duration < 5 || duration > 600) {
        return false;
      }
    }
    
    return true;
  };

  // Monitorear cambios en los campos
  useEffect(() => {
    const subscription = watch((value) => {
      // Limpiar alertas cuando el usuario empiece a corregir
      if (validationAlert && isDirty) {
        setValidationAlert(null);
      }

      // Validación específica para horarios
      if (entityType === 'schedules' && value.departureTime && value.arrivalTime) {
        if (!validateScheduleTimes(value.departureTime, value.arrivalTime)) {
          setValidationAlert({
            type: 'warning',
            message: 'La duración del viaje debe estar entre 5 minutos y 10 horas',
          });
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [watch, validationAlert, isDirty, entityType]);

  const validateBeforeSubmit = (): { valid: boolean; message?: string } => {
    // Verificar errores de React Hook Form
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0] as any;
      return {
        valid: false,
        message: firstError?.message || 'Por favor completa todos los campos requeridos',
      };
    }

    // Validaciones personalizadas según entidad
    const values = watch();
    
    if (entityType === 'schedules') {
      if (values.departureTime && values.arrivalTime) {
        if (!validateScheduleTimes(values.departureTime, values.arrivalTime)) {
          return {
            valid: false,
            message: 'La duración del viaje no es válida',
          };
        }
      }

      if (!values.daysOfWeek || values.daysOfWeek.length === 0) {
        return {
          valid: false,
          message: 'Debes seleccionar al menos un día de la semana',
        };
      }
    }

    if (entityType === 'routes') {
      if (!values.stopIds || values.stopIds.length < 2) {
        return {
          valid: false,
          message: 'Una ruta debe tener al menos 2 paradas',
        };
      }
    }

    if (entityType === 'users') {
      if (values.password && values.password.length < 8) {
        return {
          valid: false,
          message: 'La contraseña debe tener al menos 8 caracteres',
        };
      }
    }

    return { valid: true };
  };

  const clearValidation = () => {
    setValidationAlert(null);
  };

  const setCustomError = (message: string) => {
    setValidationAlert({
      type: 'error',
      message,
    });
  };

  const setCustomSuccess = (message: string) => {
    setValidationAlert({
      type: 'success',
      message,
    });
  };

  return {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState,
    validationAlert,
    isValid: isValid && Object.keys(errors).length === 0,
    validateBeforeSubmit,
    clearValidation,
    setCustomError,
    setCustomSuccess,
  };
};

export default useFormValidation;