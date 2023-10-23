import Todo from './todo.js'

import { createElement } from '../../utils/hooks.js'
import { GET_ACTIVE_TODO_URL, ADD_TODO_URL, ADD_EVENT } from '../../utils/constans.js'

import type { ITodo } from '../../utils/types.js'

interface IProjectData {
    id: string
    name: string
}

class Todos {
    wrapper: HTMLElement
    project: IProjectData
    openProjects: () => void
    todos: ITodo[]
    todoList: HTMLUListElement
    formInput: HTMLInputElement | null

    constructor(wrapper: HTMLElement, project: IProjectData, openProjects: () => void) {
        this.wrapper = wrapper
        this.project = project
        this.openProjects = openProjects
        this.todos = []
        this.todoList = createElement<HTMLUListElement>('ul', 'todo-list', this.wrapper)
        this.formInput = null
    }

    async init() {
        await this.fetchData()
        this.renderBackBtn()
        this.renderTodoList()
        this.renderForm()
    }

    async fetchData() {
        try {
            const response = await fetch(`${GET_ACTIVE_TODO_URL}/${this.project.id}`)

            if (response.ok) {
                this.todos = await response.json()
            } else throw new Error("Can't to get projects, try again later")
        } catch (err: any) {
            alert(err.message)
        }
    }

    renderBackBtn() {
        const backBtn = createElement('button', 'go-back', this.wrapper, null, 'Go back')
        backBtn.addEventListener('click', this.openProjects)
    }

    renderTodoList() {
        createElement('h2', 'todo-project-name', this.todoList, null, this.project.name)

        this.todos.forEach(todoData => {
            this.renderTodo(this.todoList, todoData)
        })
    }

    renderTodo(wrapper: HTMLUListElement, data: ITodo, prepend: boolean = false) {
        const todo = new Todo(wrapper, data, this.openProjects, this.updateData.bind(this), prepend)
        todo.init()
    }

    renderForm() {
        const form = createElement<HTMLFormElement>('form', 'add-project-form', this.wrapper)
        this.formInput = createElement<HTMLInputElement>('input', 'input-project', form, {
            type: 'text',
            placeholder: 'Todo',
        })

        createElement('button', 'submit-project', form, { type: 'submit' }, 'Add todo')
        form.addEventListener('submit', this.addProject.bind(this))
    }

    async addProject(e: SubmitEvent) {
        e.preventDefault()

        if (!this.formInput?.value) return

        try {
            const response = await fetch(ADD_TODO_URL, {
                method: 'POST',
                body: JSON.stringify({ text: this.formInput.value, projectId: this.project.id }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const projectData: ITodo = await response.json()
                this.renderTodo(this.todoList, projectData, true)
                this.updateData(ADD_EVENT, projectData)
                this.formInput.value = ''
            } else throw new Error("Can't to add todo, try again later")
        } catch (err: any) {
            alert(err.message)
        }
    }

    updateData(e: CustomEvent, data: ITodo) {
        if (e.type === 'add') this.todos.unshift(data)
        if (e.type === 'edit') this.todos = this.todos.map(todo => (todo.id === data.id ? data : todo))
        if (e.type === 'delete') this.todos = this.todos.filter(todo => todo.id !== data.id)
    }
}

export default Todos
