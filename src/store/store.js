import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// INFO: Here holds all global state
// To use:
// import useCountStore at component file, 
// state = useCountStore(state => state.count)
// increment = useCountStore(state => state.increment)


export const useCountStore = create(
  immer((set) => ({
    count: 0, // state
    increment: () => //state changer
      set((state) => {
        state.count += 1
      }),
    decrement: () =>
      set((state) => {
        state.count -= 1
      }),
  }))
)

export const useLevelStore = create(
  immer((set) => ({
    level: 1,
    maxLevel: 3,
    advance: () => set((state) => state.level += 1),
  }))
)