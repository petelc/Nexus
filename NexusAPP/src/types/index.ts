// Re-export all types for convenient importing
export * from './api.types';

// Additional UI-specific types
export interface ThemeMode {
  mode: 'light' | 'dark';
}

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ComponentType;
  path?: string;
  children?: NavItem[];
  badge?: string | number;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface FormErrors {
  [key: string]: string | undefined;
}
