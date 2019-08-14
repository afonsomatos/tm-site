export enum Tag {
    Reset,
    Transition,
    Created,
    Pause,
    Stop,
    Play,
    Forward,
    Backwards,
    Load,
    Other
}

export default interface Event {
    tag: Tag
}

export interface TransitionEvent extends Event {
    tag: Tag.Transition
    from: number
    direction: number
    write: string
}

export interface LoadEvent extends Event {
    tag: Tag.Load
    input: string
}

