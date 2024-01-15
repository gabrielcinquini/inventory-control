import { UseMeType } from '@/validations/validations'
import { create } from 'zustand'

export type State = {
  user: UseMeType | null
  pending: boolean
}

export type Actions = {
  setUser: (user: UseMeType) => void
  setPending: (pending: boolean) => void
}

const initialState: State = {
  user: null,
  pending: false,
}

export const useStore = create<State & Actions>((set) => {
  return {
    ...initialState,
    setUser: (user) => set({ user }),
    setPending: (pending) => set({ pending }),
  }
})
