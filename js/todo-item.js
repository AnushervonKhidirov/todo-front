import { createElement } from './utils/hooks.js'
import { ICON_DONE, ICON_EDIT, ICON_BIN, ICON_RESTORE, ICON_REMOVE } from './utils/icons.js'

class TodoItem {
    constructor(todoWrapper, todo, updateList) {
        this.wrapper = todoWrapper
        this.todo = todo
        this.updateList = updateList
    }

    init(appendToStart) {
        const todoItemClass = this.todo.isDone ? 'todo todo_done' : 'todo'

        this.todoElem = createElement('li', todoItemClass, this.wrapper, { id: this.todo.id }, appendToStart)
        this.todoText = createElement('div', 'todo_text', this.todoElem)
        this.todoIcons = createElement('div', 'todo_icons', this.todoElem)

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
            console.log(iconsList[icon]);
            const iconElem = createElement('div', iconsList[icon].className, this.todoIcons, {
                title: iconsList[icon].className,
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
        this.updateList(this.todo)
    }

    async editTextHandler(isEditable) {
        this.todoText.setAttribute('contenteditable', isEditable)

        if (!isEditable) {
            if (this.todo.text === this.todoText.innerHTML) return
            this.todo.text = this.todoText.innerHTML
            this.updateList(this.todo)
        }

        if (isEditable) this.todoText.focus()
    }

    async moveToBin() {
        this.todo.isOnTrash = true
        this.updateList(this.todo)
    }
}

export class BinTodoItem extends TodoItem {
    constructor(...args) {
        super(...args)
        this.iconsType = ['restore', 'remove']
    }

    async restore() {
        this.todo.isOnTrash = false
        this.updateList(this.todo)
    }

    async remove() {}
}
