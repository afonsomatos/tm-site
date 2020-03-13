import * as ModelType from "@/shared/model"
import { Direction } from "@/shared/types"

namespace JSONType {
	
	export type State = ModelType.State
	
	export interface Link {
		// State index
		from: number,
		to: number
	}
	
	export type Transition = Link & {
		direction: Direction[],
		read: string[],
		write: string[],
		undefined?: boolean
	}
	
	export interface Model {
		name: string,
		tapes: number,
		states: Record<number, State>,
		transitions: Transition[],
		start: number,
		reject: number[],
		accept: number[]
	}
}

export default JSONType