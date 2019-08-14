import { SubjectAdapter } from "../Observer"
import Event, { Type } from "./Event"

export default class Runner extends SubjectAdapter<Event> {

    public do(): void {

        setInterval(() => {
            let x = {
                type: Type.Transition,
                payload: { from: 3, direction: 1, write:'a' }
            }
            this.notify(x)
        }, 1000)
    }

}