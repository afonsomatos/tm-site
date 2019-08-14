import { SubjectAdapter } from "../Observer"
import Event, { TransitionEvent, Tag } from "./Event"

export default class Runner extends SubjectAdapter<Event> {

    public load(input: string): void {
        
    }

    public do(): void {
        setInterval(() => {

            let event: TransitionEvent = {
                tag: Tag.Transition,
                direction: 1,
                write: 'a',
            }
            this.notify(event)
        }, 1000)
    }

}