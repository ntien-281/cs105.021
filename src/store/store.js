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
        lowest: 0,
        color: "",
        typeid: 0,
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
        newLayers[layer] = [...oldLayer, block.position];
        state.gridLayers = newLayers;
      }),
    setCurrentBlock: (block) =>
      set((state) => {
        state.currentBlock.block = block;
      }),
    setLowestPointOfCurrentBlock: (val) =>
      set((state) => {
        state.currentBlock.lowest = val;
      }),
    setCurrentBlockColor: (val) =>
      set((state) => {
        state.currentBlock.color = val;
      }),
    setCurrentBlockType: (val) =>
      set((state) => {
        state.currentBlock.typeid = val;
      }),
    resetGame: () =>
      set((state) => {
        state.isPause = false;
        state.isGame = false;
        state.fallenBlock = [];
        state.currentBlock = {
            block: null,
            lowest: 0,
            color: "",
        };
      }),
  }))
);
