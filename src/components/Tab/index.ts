import { VueConstructor } from "vue"

export default interface Tab {
    tabIcon: string,
    sideBar: VueConstructor
    bottomFloat?: VueConstructor,
    canEdit?: boolean,
}