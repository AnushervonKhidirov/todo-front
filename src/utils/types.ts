export interface IProject {
    id: string
    name: string
    deleted: boolean
}

export interface ITodo {
    id: string
    text: string
    projectId: string
    done: boolean
    deleted: boolean
}

export interface IUrlParams {
    name: string
    value: string
}