export const colors = {
  brand: {
    50: '#e6f0f9',
    100: '#cce1f3',
    200: '#99c3e7',
    300: '#66a5db',
    400: '#3387cf',
    500: '#0c5392',  // Color brand principal
    600: '#0a4275',
    700: '#083258',
    800: '#05213a',
    900: '#03111d',
  },
  
  // Semánticos
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#EF4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#F59E0B',
    600: '#d97706',
    700: '#b45309',
  },
  
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#8B5CF6',
    600: '#7c3aed',
    700: '#6d28d9',
  },
  
  // Secundario
  secondary: {
    50: '#fefce8',
    100: '#fef9c3',
    500: '#f9c74e',  // Color secondary existente
    600: '#eab308',
    700: '#ca8a04',
  },
  
  // Grises (neutrales)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Especiales
  background: '#f8f9fa',  // Background existente
  white: '#ffffff',
  black: '#000000',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
} as const;

export const borderRadius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

export const typography = {
  fontFamily: {
    base: "'Montserrat', sans-serif",
  },
  fontSize: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '28px',
    '5xl': '32px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.3,
    normal: 1.5,
    relaxed: 1.6,
  },
} as const;

export const transitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
} as const;

// Tokens específicos para componentes
export const componentTokens = {
  button: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px',
    },
    padding: {
      sm: '0 16px',
      md: '0 24px',
      lg: '0 32px',
    },
  },
  modal: {
    padding: '32px',
    maxHeight: '90vh',
    width: {
      sm: '400px',
      md: '600px',
      lg: '800px',
      xl: '1000px',
    },
  },
  table: {
    headerBg: colors.gray[50],
    rowHoverBg: colors.gray[50],
    borderColor: colors.gray[200],
  },
} as const;