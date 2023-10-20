import { ActiveTodoList, BinTodoList } from './todo-list.js'

import { createElement } from './utils/hooks.js'
import { GET_ALL_TODO_URL, ADD_TODO_URL, REMOVE_EVENT } from './utils/constans.js'

class Todo {
    constructor(wrapper, projectTitle) {
        this.wrapper = wrapper
        this.projectTitle = projectTitle
        this.todos = {
            all: [],
        }
    }

    async init() {
        await this.fetchAllTodos()

        const projectTitle = createElement('h1', 'project-title', this.wrapper)
        projectTitle.innerHTML = this.projectTitle

        this.createActiveList()
        this.createBinList()
        this.createForm()
    }

    createActiveList() {
        const activeListWrapper = createElement('div', 'active-list-wrapper', this.wrapper)
        this.activeList = new ActiveTodoList(activeListWrapper, this.todos.active, this.updateList.bind(this))
        this.activeList.init()
    }

    createBinList() {
        const binListWrapper = createElement('div', 'bin-list-wrapper', this.wrapper)
        this.binList = new BinTodoList(binListWrapper, this.todos.onTrash, this.updateList.bind(this))
        this.binList.init()
    }

    createForm() {
        this.form = createElement('form', 'add-todo-form', this.wrapper)
        this.addTodoInput = createElement('input', 'add-todo-input', this.form)
        this.addTodoBtn = createElement('button', 'add-todo-btn', this.form, {
            attribute: { type: 'submit' },
        })

        this.addTodoBtn.innerHTML = 'Add Todo'

        this.form.addEventListener('submit', this.addTodo.bind(this))
    }

    updateList(updatedTodo, event) {
        this.todos.all =
            event === REMOVE_EVENT
                ? this.todos.all.filter(todo => todo.id !== updatedTodo.id)
                : this.todos.all.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo))

        this.updateTodos()
    }

    async addTodo(e) {
        e.preventDefault()

        if (!this.addTodoInput.value) return

        const response = await fetch(ADD_TODO_URL, {
            method: 'POST',
            body: JSON.stringify({ text: this.addTodoInput.value }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (response.ok) {
            const addedTodo = await response.json()
            this.todos.all.unshift(addedTodo)
            this.addTodoInput.value = ''
            this.updateTodos()
        }
    }

    async fetchAllTodos() {
        const response = await fetch(GET_ALL_TODO_URL)

        if (response.ok) {
            const result = await response.json()

            this.todos.all = result
            this.updateTodos()
        }
    }

    updateTodos() {
        this.todos.active = this.todos.all.filter(todo => !todo.isOnTrash)
        this.todos.onTrash = this.todos.all.filter(todo => todo.isOnTrash)

        if (this.activeList) this.activeList.update(this.todos.active)
        if (this.binList) this.binList.update(this.todos.onTrash)
    }
}

export default Todo
