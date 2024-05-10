import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const useGridStore = create(
  immer((set) => ({
    count: 0,
    setCount: () => set((state) => {
        state.count++;
      })
  }))
);