import { ItemStack, RawMessage, RawText } from '@minecraft/server'

export function randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * @param {T[]} array Original array
 * @returns New shuffled array
 */
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

/**
 * @param {T} find Value to find
 * @param {{}} obj Object literal to find value in
 * @returns Key of value
 */
export function keyOf<T>(find: T, obj: {}): string {
    for (const entry of Object.entries<T>(obj)) {
        const key = entry[0]
        const value = entry[1]

        if (value === find)
            return key
    }

    return undefined
}

/**
 * @returns names put in \<name\>, \<name\>, and \<name\> format
 */
export function stringNames(names: string[]): string {
    let str = ''
    for (let i = 0; i < names.length - 2; i++)
        str += names[i] + ',\n'

    str += `${names[names.length - 2]},\n and ${names[names.length - 1]}`
    return str
}

export function parseBoolean(str: string): boolean {
    if (str === 'true') return true
    return false
}

export function equalStacks(one: ItemStack, two: ItemStack) {
    return one.amount === two.amount
        && one.typeId === two.typeId
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