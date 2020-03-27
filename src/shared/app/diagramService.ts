import Graph from "@/components/Diagram/Graph"
import { IDiagramStore } from "./store"
import { Vector } from "../types"

export interface IDiagramService {
	setContextMenuPosition(position: Vector): void
	setContextMenu(menu: string | null): void
	setGraph(graph: Graph): void
	update(): void
}

export class DiagramService implements IDiagramService {

	private graph: Graph

	constructor(
		private diagramStore: IDiagramStore
	) {

	}

	setGraph(graph: Graph) {
		this.graph = graph
	}
	
	update() {
		this.graph?.update()
	}

	setContextMenuPosition(position: Vector) {
		this.diagramStore.contextMenuPosition = position
	}

	setContextMenu(menu: string | null) {
		this.diagramStore.menu = menu
	}
}