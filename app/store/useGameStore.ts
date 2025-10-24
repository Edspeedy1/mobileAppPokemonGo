import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface Creature {
  id: string
  name: string
  size: number
  weight: number
}

interface GameState {
  creatures: Creature[]
  caughtList: number[] // <-- list of caught creature IDs
  catchCreature: (c: Creature) => void
  updateCreature: (id: string, updates: Partial<Creature>) => void
  resetGame: () => void
}

const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      creatures: [],
      caughtList: [],

      catchCreature: (c) =>
        set((state) => {
          const idNum = parseInt(c.id, 10)
          const alreadyCaught = state.caughtList.includes(idNum)

          return {
            creatures: [...state.creatures, c],
            caughtList: alreadyCaught
              ? state.caughtList
              : [...state.caughtList, idNum],
          }
        }),

      updateCreature: (id, updates) =>
        set((state) => ({
          creatures: state.creatures.map((cr) =>
            cr.id === id ? { ...cr, ...updates } : cr
          ),
        })),

      resetGame: () => set({ creatures: [], caughtList: [] }),
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

export default useGameStore
