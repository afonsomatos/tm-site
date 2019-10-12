export enum Direction {
    Left,
    Right
}

export interface Transition {
    read: string,
    write: string,
    direction: Direction
}

export type Point = [number, number]