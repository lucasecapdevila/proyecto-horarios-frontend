import { ThemeConfig } from 'antd';
import { colors, shadows, typography } from './designTokens';

export const antdTheme: ThemeConfig = {
  token: {
    // Colores principales
    colorPrimary: colors.brand[500],
    colorSuccess: colors.success[500],
    colorWarning: colors.warning[500],
    colorError: colors.error[500],
    colorInfo: colors.info[500],
    
    // Tipografía
    fontFamily: typography.fontFamily.base,
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 28,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 18,
    
    // Border radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    
    // Espaciado
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    
    // Sombras
    boxShadow: shadows.md,
    boxShadowSecondary: shadows.sm,
    
    // Colores de fondo
    colorBgContainer: colors.white,
    colorBgLayout: colors.background,
    colorBgElevated: colors.white,
  },
  
  components: {
    Button: {
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      borderRadius: 8,
      fontWeight: 500,
      primaryShadow: '0 2px 4px rgba(12, 83, 146, 0.15)',
    },
    
    Table: {
      headerBg: colors.gray[50],
      headerColor: colors.gray[700],
      borderColor: colors.gray[200],
      rowHoverBg: colors.gray[50],
      fontSize: 14,
      cellPaddingBlock: 16,
    },
    
    Modal: {
      borderRadiusLG: 12,
      contentBg: colors.white,
      headerBg: colors.white,
      titleFontSize: 24,
      titleLineHeight: 1.3,
    },
    
    Tabs: {
      itemColor: colors.gray[600],
      itemSelectedColor: colors.brand[500],
      itemHoverColor: colors.brand[400],
      inkBarColor: colors.brand[500],
      cardBg: colors.white,
    },
    
    Input: {
      controlHeight: 40,
      borderRadius: 8,
      activeBorderColor: colors.brand[500],
      hoverBorderColor: colors.brand[400],
    },
    
    Select: {
      controlHeight: 40,
      borderRadius: 8,
    },
  },
};