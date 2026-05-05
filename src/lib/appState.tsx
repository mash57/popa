import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { AppState, AppScreen, Photo, Product, EditorAdjustments, Address, Order } from '../types'

const defaultAdjustments: EditorAdjustments = {
  crop: 0, brightness: 0, contrast: 0, warmth: 0, text: '',
}

const initialState: AppState = {
  screen: 'home',
  selectedProduct: null,
  selectedPhoto: null,
  permissionGranted: false,
  photos: [],
  editorAdjustments: defaultAdjustments,
  bundleProduct: null,
  address: null,
  order: null,
  currency: 'USD',
}

type Action =
  | { type: 'NAVIGATE'; screen: AppScreen }
  | { type: 'SELECT_PRODUCT'; product: Product }
  | { type: 'SELECT_PHOTO'; photo: Photo }
  | { type: 'SET_PERMISSION'; granted: boolean }
  | { type: 'SET_PHOTOS'; photos: Photo[] }
  | { type: 'UPDATE_ADJUSTMENT'; key: keyof EditorAdjustments; value: number | string }
  | { type: 'SET_BUNDLE_PRODUCT'; product: Product | null }
  | { type: 'SET_ADDRESS'; address: Address }
  | { type: 'SET_ORDER'; order: Order }
  | { type: 'SET_CURRENCY'; currency: string }

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
      return { ...state, editorAdjustments: { ...state.editorAdjustments, [action.key]: action.value } }
    case 'SET_BUNDLE_PRODUCT':
      return { ...state, bundleProduct: action.product }
    case 'SET_ADDRESS':
      return { ...state, address: action.address }
    case 'SET_ORDER':
      return { ...state, order: action.order }
    case 'SET_CURRENCY':
      return { ...state, currency: action.currency }
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
