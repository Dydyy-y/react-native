import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
  ReactNode,
} from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface UIState {
  toasts: Toast[];
}

type UIAction =
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string };

interface UIContextType {
  state: UIState;
  showToast: (message: string, type: ToastType) => void;
  hideToast: (id: string) => void;
}

const UIContext = createContext<UIContextType>(null!);

const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };
    default:
      return state;
  }
};

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(uiReducer, { toasts: [] });

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
    // Auto-suppression après 4 secondes
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 4000);
  }, []);

  const hideToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  return (
    <UIContext.Provider value={{ state, showToast, hideToast }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
