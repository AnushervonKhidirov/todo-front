import Todo from './todo.js'

import { createElement, getUrlParams } from '../../utils/hooks.js'
import { GET_ACTIVE_TODO_URL, ADD_TODO_URL, ADD_EVENT } from '../../utils/constants.js'

import type { ITodo, IUrlParams } from '../../utils/types.js'

class Todos {
    wrapper: HTMLElement
    params: IUrlParams
    todos: ITodo[]
    todoList: HTMLUListElement
    formInput: HTMLInputElement | null

    constructor(wrapper: HTMLElement) {
        this.wrapper = wrapper
        this.params = {}
        this.todos = []
        this.todoList = createElement<HTMLUListElement>('ul', 'todo-list')
        this.formInput = null
    }

    async init() {
        this.params = getUrlParams()
        await this.fetchData()
        this.renderTodoList()
        this.renderBackBtn()
        this.renderForm()
    }

    async fetchData() {
        try {
            const response = await fetch(`${GET_ACTIVE_TODO_URL}/${this.params.projectId}`)

            if (response.ok) {
                this.todos = await response.json()
            } else throw new Error("Can't to get projects, try again later")
        } catch (err: any) {
            alert(err.message)
        }
    }

    renderBackBtn() {
        const backBtn = createElement('button', 'go-back', this.wrapper, null, 'Go back')
        backBtn.addEventListener('click', () => window.history.back())
    }

    renderTodoList() {
        const listWrapper = createElement('div', 'todo-list-wrapper', this.wrapper)
        createElement('h2', 'todo-project-name', listWrapper, null, this.params.projectName)

        listWrapper.appendChild(this.todoList)

        this.todos.forEach(todoData => {
            this.renderTodo(this.todoList, todoData)
        })
    }

    renderTodo(wrapper: HTMLUListElement, data: ITodo, prepend: boolean = false) {
        const todo = new Todo(wrapper, data, prepend)
        todo.init()

        if (todo.todoElem) this.addTodoEvents(todo)
        return todo.todoElem
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
                body: JSON.stringify({ text: this.formInput.value, projectId: this.params.projectId }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const todoData: ITodo = await response.json()
                const todoElem = this.renderTodo(this.todoList, todoData, true)
                todoElem?.dispatchEvent(ADD_EVENT)
                this.formInput.value = ''
            } else throw new Error("Can't to add todo, try again later")
        } catch (err: any) {
            alert(err.message)
        }
    }

    addTodoEvents(todo: Todo) {
        const { todoElem, todoData } = todo

        todoElem?.addEventListener('add', () => {
            this.todos.unshift(todo.todoData)
        })
        todoElem?.addEventListener('edit', () => {
            this.todos = this.todos.map(todo => (todo.id === todoData.id ? todoData : todo))
        })
        todoElem?.addEventListener('delete', () => {
            this.todos = this.todos.filter(todo => todo.id !== todoData.id)
        })
    }
}

export default Todos
