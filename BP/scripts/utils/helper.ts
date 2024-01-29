export function randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle<T>(array: T[]): T[] {
    const newArray: T[] = []
    const remainingElements = Array.from(array)
    while (remainingElements.length > 0) {
        const idx = Math.floor(Math.random() * remainingElements.length)
        newArray.push(remainingElements[idx])

        remainingElements.splice(idx, 1)
    }

    return newArray
}

// export function shuffle<T>(array: T[]): T[] {
//     let newArray = array
//     for (var i = newArray.length - 1; i > 0; i--) {
//         var j = Math.floor(Math.random() * (i + 1))
//         var temp = newArray[i]
//         newArray[i] = array[j]
//         newArray[j] = temp
//     }
//     return newArray
// }