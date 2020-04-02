import { Link, Transition, State } from "../model";
import { Vector } from "../types";
import Graph from "@/components/Diagram/Graph";

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