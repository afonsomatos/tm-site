import { VueConstructor } from "vue"

import Code      from "./Code"
import Edit      from "./Edit"
import Run       from "./Run"
import Transform from "./Transform"

export default interface Tab {
    tabIcon: string,
    sideBar: VueConstructor
    bottomFloat?: VueConstructor,
}

export const ALL_TABS : Tab[] = [ Run, Edit, Transform, Code ]
export const START_TAB : Tab = Edit