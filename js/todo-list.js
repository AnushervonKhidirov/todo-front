import { ActiveTodoItem, BinTodoItem } from './todo-item.js'

import { createElement } from './utils/hooks.js'

class TodoList {
    constructor(listWrapper, todos, updateList) {
        this.listWrapper = listWrapper
        this.todos = todos
        this.updateList = updateList
    }

    init() {
        this.list = createElement('ul', this.listClassName, this.listWrapper)
        this.renderTodos()
    }

    update(todos) {
        this.todos = todos
        this.list.innerHTML = ''
        this.renderTodos()
    }
}

export class ActiveTodoList extends TodoList {
    constructor(...args) {
        super(...args)
        this.listClassName = 'active-list'
    }

    renderTodos() {
        if (!this.list) return
        this.todos.forEach(todoItem => {
            const todo = new ActiveTodoItem(this.list, todoItem, this.updateList.bind(this))
            todo.init()
        })
    }
}

export class BinTodoList extends TodoList {
    constructor(...args) {
        super(...args)
        this.listClassName = 'bin-list'
    }

    renderTodos() {
        if (!this.list) return
        this.todos.forEach(todoItem => {
            const todo = new BinTodoItem(this.list, todoItem, this.updateList.bind(this))
            todo.init()
        })
    }
}
