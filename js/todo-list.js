import Todo from './todo.js'
import { GET_ACTIVE_TODO_URL, GET_REMOVED_TODO_URL, ADD_TODO_URL } from './constans.js'

class TodoList {
    constructor(list, addTodoInput, addTodoBtn) {
        this.list = list
        this.addInput = addTodoInput
        this.addBtn = addTodoBtn
        this.todos = []
    }

    async init() {
        await this.fetchTodos()
        this.loadAllTodos()
        this.addBtn.addEventListener('click', () => this.addTodo())
    }

    async fetchTodos() {
        const response = await fetch(GET_ACTIVE_TODO_URL)
        this.todos = await response.json()
    }

    async addTodo() {
        if (!this.addInput.value) return

        const response = await fetch(ADD_TODO_URL, {
            method: 'POST',
            body: JSON.stringify({ text: this.addInput.value }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        this.loadTodo(await response.json(), true)
    }

    async loadAllTodos() {
        await this.fetchTodos()

        this.list.innerHTML = ''

        this.todos.forEach(todo => this.loadTodo(todo))
    }

    loadTodo(todo, appendToStart) {
        const todoItem = new Todo(this.list, todo)
        todoItem.create(appendToStart)
    }

    async updateBinList() {}

    async updateActiveList() {}
}

class ActiveTodoList extends TodoList {}

class BinTodoList extends TodoList {}

export default TodoList
