export interface Diagram {
    nodes: {
        [id: number]: Node
    },
    links: {
        [id: number]: Link
    },

    nodeIds: number[],
    linkIds: number[]
}

export interface Status {
    activeNode: number,
    activeLink: number
}

export interface Vector {
    x: number,
    y: number
}

export type Node = Vector & {
    label: string
}

export interface Link {
    from: number,
    to: number,
    label: string
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

export interface State {

}

export interface Adapter {
    nodeRightClick: (id: number) => void,
}