export function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

export function shuffleInnerArrays(nestedList) {
    if (!Array.isArray(nestedList)) {
        throw new Error("Input must be an array.");
    }
    for (const innerArray of nestedList) {
        if (Array.isArray(innerArray)) {
            shuffle(innerArray);
        }
    }

    return nestedList;
}