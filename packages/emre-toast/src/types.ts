export type ToastType = "default" | "success" | "error" | "warning" | "info" | "loading";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
export type ToastTheme = "light" | "dark" | "system";
export type ToastAnimation = "slide" | "bounce" | "scale" | "flip" | "elastic";

export interface ToastAction {
  label: string;
  onClick: () => void;
  successLabel?: string;
}

export interface ToastTiming {
  displayDuration?: number;
}

export interface ToastClassNames {
  wrapper?: string;
  content?: string;
  header?: string;
  title?: string;
  icon?: string;
  description?: string;
  actionWrapper?: string;
  actionButton?: string;
  progressBar?: string;
}

export interface ToastOptions {
  description?: React.ReactNode;
  action?: ToastAction;
  icon?: React.ReactNode;
  duration?: number;
  id?: string | number;
  classNames?: ToastClassNames;
  fillColor?: string;
  borderColor?: string;
  borderWidth?: number;
  timing?: ToastTiming;
  spring?: boolean;
  bounce?: number;
  animation?: ToastAnimation;
  groupKey?: string;
  progress?: number;
  confetti?: boolean;
  avatar?: string;
}

export interface PromiseToastOptions {
  loading: string;
  success: string | ((data: unknown) => string);
  error: string | ((err: unknown) => string);
  description?: {
    loading?: React.ReactNode;
    success?: React.ReactNode;
    error?: React.ReactNode;
  };
  action?: {
    success?: ToastAction;
    error?: ToastAction;
  };
}

export interface StreamToastOptions {
  onStream?: (update: (text: string) => void) => void;
  description?: React.ReactNode;
  duration?: number;
}

export interface UndoToastOptions {
  onUndo: () => void;
  countdown?: number;
}

export interface ToastState {
  id: string;
  type: ToastType;
  title: string;
  description?: React.ReactNode;
  action?: ToastAction;
  icon?: React.ReactNode;
  avatar?: string;
  createdAt: number;
  duration: number;
  pausedAt?: number;
  progress?: number;
  groupKey?: string;
  groupCount?: number;
  undoCountdown?: number;
  onUndo?: () => void;
  options: ToastOptions;
  status: "visible" | "dismissing" | "dismissed";
}

export interface ToasterProps {
  position?: ToastPosition;
  theme?: ToastTheme;
  maxVisible?: number;
  sounds?: boolean;
  animation?: ToastAnimation;
  history?: boolean;
  duration?: number;
  gap?: number;
  offset?: number | string;
  expand?: boolean;
  closeButton?: boolean;
  movable?: boolean;
}
