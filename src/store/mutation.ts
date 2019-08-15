enum Mutation
{
    SET_TAB = "setTab",
    SET_MODEL = "setModel",

    ADD_STATE = "addState",
    ADD_CHAR = "addChar",

    SET_STATE_NAME = "setStateName",
    REPLACE_CHAR = "replaceChar",

    SET_EDITING_TRANSITION = "setEditingTransition",
    SET_EDITING_STATE = "setEditingState",
    SET_EDITING_CHAR = "setEditingChar",

    SET_NO_EDITING = "setNoEditing",

    SET_ACCEPT_STATE = "setAcceptState",
    DELETE_CHAR_COLUMN = "deleteCharColumn",

    REPLACE_READ_CHAR = "replaceReadChar",

    SET_READ_CHAR = "setReadChar",

    DELETE_READ_CHAR = "deleteReadChar",
    ADD_READ_CHAR = "addReadChar",

    DELETE_STATE = "deleteState",

    LOAD = "load",

    SET_STATUS = "setStatus",

    CLEAR_INTERVAL = "clearInterval",
    SET_INTERVAL = "setInterval",
    SET_TRANSITION = "setTransition"
}

export default Mutation