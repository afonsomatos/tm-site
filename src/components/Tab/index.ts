import { VueConstructor } from "vue"

import Edit      from "./Edit"
import Run       from "./Run"

export default interface Tab {
    tabIcon: string,
    sideBar: VueConstructor
    bottomFloat?: VueConstructor,
}

export const ALL_TABS : Tab[] = [ Run, Edit ]
export const Tabs = { Run, Edit }