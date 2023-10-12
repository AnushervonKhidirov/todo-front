import { ICON_DONE, ICON_EDIT, ICON_BIN } from './icons.js'
import { UPDATE_TODO_URL } from './constans.js'

class Todo {
    constructor(todoList, todoItem) {
        this.todoData = todoItem
        this.todoList = todoList
        this.iconsType = ['done', 'edit', 'moveToBin']
    }
    create(appendToStart) {
        const todoItemClass = this.todoData.isDone ? 'todo todo_done' : 'todo'

        this.todoElem = this.createElement('li', todoItemClass, this.todoList, {
            id: this.todoData.id,
        }, appendToStart)
        this.todoText = this.createElement('div', 'todo_text', this.todoElem)
        this.todoIcons = this.createElement('div', 'todo_icons', this.todoElem)

        this.todoText.innerHTML = this.todoData.text

        this.createIcons(this.iconsType)

        this.todoText.addEventListener('blur', () => this.editHandler(false))
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
                callback: () => this.editHandler(true),
            },
            moveToBin: {
                className: 'icon move_to_bin',
                title: 'move to bin',
                icon: ICON_BIN,
                callback: () => this.removeHandler(),
            },
            restore: {
                className: 'icon restore',
                title: 'restore',
                icon: ICON_BIN,
                callback: () => this.removeHandler(),
            },
            remove: {
                className: 'icon remove',
                title: 'remove',
                icon: ICON_BIN,
                callback: () => this.removeHandler(),
            },
        }

        icons.forEach((icon) => {
            const iconElem = this.createElement('div', iconsList[icon].className, this.todoIcons, { title: iconsList[icon].className })
            iconElem.innerHTML = iconsList[icon].icon
            iconElem.addEventListener('click', () => iconsList[icon].callback())
        })
    }

    async doneHandler() {
        this.todoData.isDone = !this.todoData.isDone

        const updatedData = await this.updateTodo()

        updatedData.isDone
            ? this.todoElem.classList.add('todo_done')
            : this.todoElem.classList.remove('todo_done')
    }

    async editHandler(isEditable) {
        this.todoText.setAttribute('contenteditable', isEditable)

        if (!isEditable) {
            if (this.todoData.text === this.todoText.innerHTML) return
            this.todoData.text = this.todoText.innerHTML
            this.updateTodo()
        }

        if (isEditable) this.todoText.focus()
    }

    async removeHandler() {
        this.todoData.isOnTrash = !this.todoData.isOnTrash

        const updatedData = await this.updateTodo()

        if (updatedData.isOnTrash) {
            this.todoElem.classList.add('removed')
            this.todoElem.addEventListener('transitionend', this.removeItemFromList)
        }
    }

    async updateTodo() {
        const response = await fetch(`${UPDATE_TODO_URL}/${this.todoData.id}`, {
            method: 'POST',
            body: JSON.stringify(this.todoData),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return await response.json()
    }

    removeItemFromList(e) {
        if (e.propertyName !== 'height') return
        e.target.removeEventListener('transitionend', this.removeItemFromList)
        e.target.remove()
    }

    createElement(tagName, className, parent, options, appendToStart) {
        const tag = document.createElement(tagName)
        if (className) tag.classList.add(...className.split(' '))
        if (parent) {
            if (appendToStart) {
                parent.prepend(tag)
            } else {
                parent.append(tag)
            }
        }
        if (options) {
            for (let key in options) {
                tag.setAttribute(key, options[key])
            }
        }

        return tag
    }
}

export default Todo
