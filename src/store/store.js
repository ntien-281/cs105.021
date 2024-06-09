import { metalness } from "three/examples/jsm/nodes/Nodes.js";
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
        score: 0,
        textureUrl: null,
        gridLayers: [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
        ], // INFO: 12 layers, each layers is a 1d array, add blocks to these  planes as they've fallen, layers having 6x6 = 36 blocks (full) will be dropped and scored
        currentBlock: {
            color: "",
            typeid: null,
        },
        nextBlock: {
            typeid: null,
            color: "",
            xInit: 0,
            zInit: 0,
        },
        materialSettings: {
            roughness: 0,
            metalness: 0,
        },
        gameOver: false,
        setGameOver: (value) =>
            set((state) => {
                state.gameOver = value;
            }),
        setMaterialSettings: (value) =>
            set((state) => {
                state.materialSettings = value;
            }),
        setTextureUrl: (value) =>
            set((state) => {
                state.textureUrl = value;
            }),
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
        removeFullLayers: () =>
            set((state) => {
                let newLayers = state.gridLayers;

                for (let i = 0; i < newLayers.length; i++) {
                    if (newLayers[i].length === 36) {
                        newLayers.splice(i, 1);
                        newLayers.push([]);
                        state.score += 10;
                    }
                }

                state.gridLayers = newLayers;
            }),
        setCurrentBlock: (block) =>
            set((state) => {
                state.currentBlock = block;
            }),
        setNextBlock: (block) =>
            set((state) => {
                state.nextBlock = block;
            }),
        resetGame: () =>
            set((state) => {
                state.isPause = false;
                state.isGame = false;
                state.gridLayers = [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                ];
                state.currentBlock = {
                    block: null,
                    color: "",
                };
                state.score = 0;
                state.gameOver = false;
            }),
    }))
);
