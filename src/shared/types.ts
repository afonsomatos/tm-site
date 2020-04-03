export enum Direction {
    Left = "L",
    Right = "R",
    Stay = "S"
}

export interface Vector {
    x: number,
    y: number
}

export interface SimpleTransition {
    read: string,
    write: string,
    direction: Direction
}

export type Point = [number, number]