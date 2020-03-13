export enum Direction {
    Left = "L",
    Right = "R",
    Stay = "S"
}

export interface Vector {
    x: number,
    y: number
}

export type Point = [number, number]