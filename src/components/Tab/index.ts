import { VueConstructor } from "vue"

export default interface Tab {
    name: string,
    tabIcon: string,
    sideBar: VueConstructor
    bottomFloat?: VueConstructor,
    canEdit?: boolean,
}