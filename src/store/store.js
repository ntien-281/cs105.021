import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// INFO: Here holds all global state
// To use:
// import useCountStore at component file,
// state = useCountStore(state => state.count)
// increment = useCountStore(state => state.increment)


export const useGameStore = create(
  immer((set) => ({
    isPause: false,
    isGame: false,
    gridLayers: [[],[],[],[],[],[],[],[],[],[],[],[]], // INFO: 12 layers, each layers is a 1d array, add blocks to these  planes as they've fallen, layers having 6x6 = 36 blocks (full) will be dropped and scored
    currentBlock: {
        block: null,
        color: "",
        typeid: null,
    },
    setIsGame: () =>
      set((state) => {
        state.isGame = !state.isGame;
      }),
    setIsPause: () =>
      set((state) => {
        state.isPause = !state.isPause;
      }),
    addFallenBlock: (block, layer) =>
      set((state) => {
        let newLayers = state.gridLayers;
        let oldLayer = newLayers[layer];
        newLayers[layer] = [...oldLayer, block];
        state.gridLayers = newLayers;
      }),
    setCurrentBlock: (block) =>
      set((state) => {
        state.currentBlock = block;
      }),
    resetGame: () =>
      set((state) => {
        state.isPause = false;
        state.isGame = false;
        state.gridLayers = [[],[],[],[],[],[],[],[],[],[],[],[]];
        state.currentBlock = {
            block: null,
            color: "",
        };
      }),
  }))
);
