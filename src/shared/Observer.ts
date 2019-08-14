export interface Subject<T> {

    attach(observer: Observer<T>): void
    
    dettach(observer: Observer<T>): void
    
    notify(data: T): void

}

export interface Observer<T> {

    update(subject: Subject<T>, data: T): void

}

export abstract class SubjectAdapter<T> implements Subject<T> {

    private observers = new Set< Observer<T> >()

    public attach(observer: Observer<T>): void {
        this.observers.add(observer)
    }

    public dettach(observer: Observer<T>): void {
        this.observers.delete(observer)
    }

    notify(data: T): void {
        this.observers.forEach(o => o.update(this, data))
    }

}