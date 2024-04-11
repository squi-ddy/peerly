export function preciseFloor(x: number, div: number) {
    return Math.round((x - x % div) / div)
}