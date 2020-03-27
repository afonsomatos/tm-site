import Graph from "@/components/Diagram/Graph"

export interface IDiagramService {
	setGraph(graph: Graph): void
	update(): void
}

export class DiagramService implements IDiagramService {

	private graph: Graph

	constructor(

	) {

	}

	setGraph(graph: Graph) {
		this.graph = graph
	}
	
	update() {
		this.graph?.update()
	}
}