const box_size = 2;
export const groupsOfBlocks = [
    {
        lowestY: 0,
        coords: [
            [1, 1, 1],
            [1, 1, 1 + box_size],
            [1, 1 + box_size, 1],
            [1 + box_size, 1, 1],
        ],
    },
    {
        lowestY: 0,
        coords: [
            [1, 1, 1],
            [1 + box_size, 1 + box_size, 1],
            [1, 1 + box_size, 1],
            [1 + box_size, 1, 1],
        ],
    },
    {
        lowestY: 0,
        coords: [
            [1, 1, 1],
            [1, 1, 1 + box_size],
            [1, 1 + box_size, 1],
            [1, 1, 1 + 2 * box_size],
        ],
    },
    {
        lowestY: 0,
        coords: [
            [1, 1, 1],
            [1, 1, 1 + box_size],
            [1, 1 + box_size, 1 + box_size],
            [1, 1, 1 + 2 * box_size],
        ],
    },
    {
        lowestY: 2 * box_size,
        coords: [
            [1, 1, 1],
            [1, 1, 1 + box_size],
            [1, 1 - box_size, 1 + box_size],
            [1, 1, 1 + 2 * box_size],
            [1, 1 - 2 * box_size, 1 + box_size],
        ],
    },
];

export const getRandomPosition = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};

export const getRandomColor = () => {
    let colors = ["#D6EAF8", "#839192", "#FFC300", "#FF5733", "#33FF57"];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const generateRandomGroup = () => {
    const randomIndex = Math.floor(Math.random() * groupsOfBlocks.length);
    const colorInit = getRandomColor();
    let xInit = getRandomPosition(0, 3) * box_size;
    let zInit = getRandomPosition(0, 3) * box_size;

    return {
        typeid: randomIndex,
        color: colorInit,
        xInit,
        zInit,
        lowestY: groupsOfBlocks[randomIndex].lowestY,
    };
};
