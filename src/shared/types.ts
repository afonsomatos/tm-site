export enum Direction {
    Left = "L",
    Right = "R"
}

export interface Transition {
    read: string,
    write: string,
    direction: Direction
}

export interface Vector {
    x: number,
    y: number
}

export type Point = [number, number]