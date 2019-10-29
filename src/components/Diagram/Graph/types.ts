import { Point } from "@/shared/types"

export interface Status {
    activeNode: number,
    activeLink: number
}

export interface Vector {
    x: number,
    y: number
}

export interface Transform {
    x: number,
    y: number,
    k: number,
}

export enum Line {
    Straight,
    Arc,
    Loop
}

export interface Adapter {
    /**
     * A certain node is right clicked (open context menu).
     */
    nodeRightClick: (id: number) => void,

    /**
     * Zoom or pan.
     */
    transformed: (transform: Transform) => void,

    /**
     * Move a certain node.
     */
    stateMoved: (id: number, pos: Point) => void,

    /**
     * A link between nodes is created.
     */
    editLink: (from: number, to: number) => void
}