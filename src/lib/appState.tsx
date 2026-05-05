import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { AppState, AppScreen, Photo, Product, EditorAdjustments } from '../types'

const defaultAdjustments: EditorAdjustments = {
  crop: 0,
  brightness: 0,
  contrast: 0,
  warmth: 0,
  text: '',
}

const initialState: AppState = {
  screen: 'home',
  selectedProduct: null,
  selectedPhoto: null,
  permissionGranted: false,
  photos: [],
  editorAdjustments: defaultAdjustments,
}

type Action =
  | { type: 'NAVIGATE'; screen: AppScreen }
  | { type: 'SELECT_PRODUCT'; product: Product }
  | { type: 'SELECT_PHOTO'; photo: Photo }
  | { type: 'SET_PERMISSION'; granted: boolean }
  | { type: 'SET_PHOTOS'; photos: Photo[] }
  | { type: 'UPDATE_ADJUSTMENT'; key: keyof EditorAdjustments; value: number | string }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, screen: action.screen }
    case 'SELECT_PRODUCT':
      return { ...state, selectedProduct: action.product }
    case 'SELECT_PHOTO':
      return { ...state, selectedPhoto: action.photo }
    case 'SET_PERMISSION':
      return { ...state, permissionGranted: action.granted }
    case 'SET_PHOTOS':
      return { ...state, photos: action.photos }
    case 'UPDATE_ADJUSTMENT':
      return {
        ...state,
        editorAdjustments: { ...state.editorAdjustments, [action.key]: action.value },
      }
    default:
      return state
  }
}

const AppStateContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<Action>
} | null>(null)

export function AppStateProvider({
  children,
  initialState: override,
}: {
  children: ReactNode
  initialState?: Partial<AppState>
}) {
  const [state, dispatch] = useReducer(reducer, { ...initialState, ...override })
  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
