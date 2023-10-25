import { BinProjectItem, BinTodoItem } from './binItem.js'
import { createElement } from '../../utils/hooks.js'
import { GET_BIN_DATA } from '../../utils/constants.js'
import type { IProject, ITodo } from '../../utils/types.js'

class Bin {
    wrapper: HTMLElement
    binData: { projects: IProject[]; todos: ITodo[] } | null

    constructor(wrapper: HTMLElement) {
        this.wrapper = wrapper
        this.binData = null
    }

    async init() {
        await this.fetchData()
        this.renderBinList()
    }

    async fetchData() {
        try {
            const response = await fetch(GET_BIN_DATA)
            if (response.ok) {
                this.binData = await response.json()
            } else throw new Error("Can't to get deleted items, try again later")
        } catch (err: any) {
            alert(err.message)
        }
    }

    renderBinList() {
        const projectList = createElement<HTMLUListElement>('ul', 'bin-list', this.wrapper)

        this.binData?.projects.forEach(projectData => {
            const todos = this.binData?.todos.filter(todo => todo.projectId === projectData.id)
            
            if (todos && todos?.length !== 0) {
                const projectWrapper = createElement('div', 'project-wrapper', projectList)

                const binProjectItem = new BinProjectItem(projectWrapper, projectData)
                binProjectItem.init()

                const todoWrapper = createElement('ul', 'todo-wrapper', projectWrapper)
    
                todos.forEach(todo => {
                    const binTodoItem = new BinTodoItem(todoWrapper, todo)
                    binTodoItem.init()
                })
            } else {
                const binProjectItem = new BinProjectItem(projectList, projectData)
                binProjectItem.init()
            }
        })
    }
}

export default Bin
