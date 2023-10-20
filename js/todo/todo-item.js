import { createElement, fetchData } from './utils/hooks.js'
import { ICON_DONE, ICON_EDIT, ICON_BIN, ICON_RESTORE, ICON_REMOVE } from './utils/icons.js'
import { REMOVE_EVENT, UPDATE_TODO_URL, REMOVE_TODO_URL } from './utils/constans.js'

class TodoItem {
    constructor(wrapper, todo, updateList) {
        this.wrapper = wrapper
        this.todo = todo
        this.updateList = updateList
    }

    init(prepend) {
        const todoItemClass = this.todo.isDone ? 'todo todo-done' : 'todo'

        this.todoElem = createElement('li', todoItemClass, this.wrapper, {
            attribute: { id: this.todo.id },
            prepend: prepend,
        })
        this.todoText = createElement('div', 'todo-text', this.todoElem)
        this.todoIcons = createElement('div', 'todo-icons', this.todoElem)

        this.todoText.innerHTML = this.todo.text

        this.createIcons(this.iconsType)
        this.todoText.addEventListener('blur', () => this.editTextHandler(false))
    }

    createIcons(icons) {
        const iconsList = {
            done: {
                className: 'icon done',
                title: 'done',
                icon: ICON_DONE,
                callback: () => this.doneHandler(),
            },
            edit: {
                className: 'icon edit',
                title: 'edit',
                icon: ICON_EDIT,
                callback: () => this.editTextHandler(true),
            },
            moveToBin: {
                className: 'icon move_to_bin',
                title: 'move to bin',
                icon: ICON_BIN,
                callback: () => this.moveToBin(),
            },
            restore: {
                className: 'icon restore',
                title: 'restore',
                icon: ICON_RESTORE,
                callback: () => this.restore(),
            },
            remove: {
                className: 'icon remove',
                title: 'remove',
                icon: ICON_REMOVE,
                callback: () => this.remove(),
            },
        }

        icons.forEach(icon => {
            const iconElem = createElement('div', iconsList[icon].className, this.todoIcons, {
                attribute: { title: iconsList[icon].className },
            })
            iconElem.innerHTML = iconsList[icon].icon
            iconElem.addEventListener('click', () => iconsList[icon].callback())
        })
    }
}

export class ActiveTodoItem extends TodoItem {
    constructor(...args) {
        super(...args)
        this.iconsType = ['done', 'edit', 'moveToBin']
    }

    async doneHandler() {
        this.todo.isDone = !this.todo.isDone

        const response = await fetchData(UPDATE_TODO_URL, {
            method: 'POST',
            body: JSON.stringify(this.todo),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        this.updateList(response)
    }

    async editTextHandler(isEditable) {
        this.todoText.setAttribute('contenteditable', isEditable)

        if (isEditable) this.todoText.focus()
        if (isEditable || this.todo.text === this.todoText.innerHTML) return

        const response = await fetchData(UPDATE_TODO_URL, {
            method: 'POST',
            body: JSON.stringify({ ...this.todo, text: this.todoText.innerHTML }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        this.updateList(response)
    }

    async moveToBin() {
        const response = await fetchData(UPDATE_TODO_URL, {
            method: 'POST',
            body: JSON.stringify({ ...this.todo, isOnTrash: true }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        this.updateList(response)
    }
}

export class BinTodoItem extends TodoItem {
    constructor(...args) {
        super(...args)
        this.iconsType = ['restore', 'remove']
    }

    async restore() {
        const response = await fetchData(UPDATE_TODO_URL, {
            method: 'POST',
            body: JSON.stringify({ ...this.todo, isOnTrash: false }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        this.updateList(response)
    }

    async remove() {
        const response = await fetchData(REMOVE_TODO_URL, {
            method: 'DELETE',
            body: JSON.stringify(this.todo),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        this.updateList(this.todo, REMOVE_EVENT)
    }
}
