import { VueConstructor } from "vue"

import Edit      from "./Edit"
import Run       from "./Run"
import Notebook  from "./Notebook"

export default interface Tab {
    tabIcon: string,
    sideBar: VueConstructor
    bottomFloat?: VueConstructor,
}

export const ALL_TABS : Tab[] = [ Run, Edit, Notebook ]
export const Tabs = { Run, Edit, Notebook }