import { Application }  from "./application"
import { mut }          from "@/shared/app/store"

const app = new Application(mut)

export { app }