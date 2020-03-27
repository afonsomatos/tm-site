import Graph from "@/components/Diagram/Graph"
import { IDiagramStore } from "./store"
import { Vector } from "../types"
import { Link, State, Type, Transition } from "../model"
import { IModelService, Command as ModelCommand} from "./modelService"

export interface IDiagramService {
	createLink(link: Link): Transition
	createTransition(): void
	addState(): void,
	setGraphPosition(pos: Vector): void,
	setContextMenuPosition(position: Vector): void
	setContextMenu(menu: string | null): void
	setEditLink(link: Link): void
	setEditTransition(transition: Transition): void
	setEditState(state: State): void
	setGraph(graph: Graph): void
	update(): void
}

export class DiagramService implements IDiagramService {

	// refactor this
	public modelService: IModelService

	private graph: Graph
	private state: State

	private graphPosition: Vector

	constructor(
		private diagramStore: IDiagramStore
	) {

	}

	setEditTransition(transition: Transition) {
		this.diagramStore.transition = transition
	}

	createLink(link: Link): Transition {
		// refactor
		return this.graph.createTransition(link.from, link.to)
	}

	createTransition() {
		this.graph.newTransition(this.state)
	}

	addState() {
        let { x, y } = this.graphPosition
        let transform = this.graph.transform
        
        let statePosition = {
            x: (x - transform.x) / transform.k,
            y: (y - transform.y) / transform.k
        }
        
        this.modelService.execute(
            ModelCommand.addState({
                position: statePosition,
                label: "X"
            })
        )
	}

	setGraphPosition(pos: Vector) {
		this.graphPosition = pos
	}

	setEditLink(link: Link) {
		this.diagramStore.link = link
	}

	setGraph(graph: Graph) {
		this.graph = graph
	}
	
	update() {
		if (this.state) {
			this.diagramStore.type = this.graph.model.getType(this.state)
		}
		this.graph?.update()
	}

	setContextMenuPosition(position: Vector) {
		this.diagramStore.contextMenuPosition = position
	}

	setContextMenu(menu: string | null) {
		this.diagramStore.menu = menu
	}

	setEditState(state: State) {
		this.state = state
		this.diagramStore.state = state
		// refactor this
		this.diagramStore.type = this.graph.model.getType(state)
	}
	
}