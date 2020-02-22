import { Vector } from "./types"

export function mul(vector: Vector, scalar: number): Vector {
    return {
        x: vector.x * scalar,
        y: vector.y * scalar
    }
}

export function add(v1: Vector, v2: Vector): Vector {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y
    }
}

export function neg(vector: Vector): Vector {
    return {
        x: -vector.x,
        y: -vector.y
    }
}

export function sub(v1: Vector, v2: Vector): Vector {
    return add(v1, neg(v2))
}

export function norm(vector: Vector): number {
    return Math.sqrt(vector.x ** 2 + vector.y ** 2)
}

export function unit(vector: Vector): Vector {
    if (norm(vector) === 0) {
        return { x: 0, y: 0 }
    }
    return mul(vector, 1 / norm(vector))
}

export function vec(norm: number, angle: number): Vector {
    return {
        x: Math.cos(angle) * norm,
        y: Math.sin(angle) * norm
    }
}

export function ang(vector: Vector): number {
    return Math.atan2(vector.y, vector.x)
}