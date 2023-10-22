export interface IProject {
    id: string
    name: string
    todos: ITodo[]
    deleted: boolean
}

export interface ITodo {
    id: string
    text: string
    done: boolean
    deleted: boolean
}
