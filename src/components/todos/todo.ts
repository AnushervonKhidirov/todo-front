import { createElement } from '../../utils/hooks.js'
import { EDIT_EVENT, DELETE_EVENT, UPDATE_TODO_URL } from '../../utils/constans.js'

import type { ITodo } from '../../utils/types.js'

class Todo {
    wrapper: HTMLElement
    todoData: ITodo
    openProjects: () => void
    updateList: (e: CustomEvent, data: ITodo) => void
    todo: HTMLElement | null
    todoText: HTMLElement | null
    prepend: boolean

    constructor(
        wrapper: HTMLElement,
        todoData: ITodo,
        openProjects: () => void,
        updateList: (e: CustomEvent, data: ITodo) => void,
        prepend: boolean
    ) {
        this.wrapper = wrapper
        this.todoData = todoData
        this.openProjects = openProjects
        this.updateList = updateList
        this.todo = null
        this.todoText = null
        this.prepend = prepend
    }

    init() {
        this.renderTodo()
        this.renderActionButtons()
    }

    renderTodo() {
        const todoClassName = this.todoData.done ? 'todo-item done' : 'todo-item'

        this.todo = createElement('li', todoClassName, this.wrapper, {
            id: this.todoData.id,
        }, null, this.prepend)

        this.todoData.done ? this.todo?.classList.add('done') : this.todo?.classList.remove('done')

        this.todoText = createElement('div', 'todo-text', this.todo, null, this.todoData.text)
        this.todoText.addEventListener('blur', this.edit.bind(this, false))
    }

    renderActionButtons() {
        const actionButtons = createElement('div', 'action-buttons', this.todo)

        const doneBtn = createElement('button', 'done-todo-btn', actionButtons, null, 'done')
        doneBtn.addEventListener('click', this.done.bind(this))

        const editBtn = createElement('button', 'edit-todo-btn', actionButtons, null, 'edit')
        editBtn.addEventListener('click', this.edit.bind(this, true))

        const deleteBtn = createElement('button', 'delete-todo-btn', actionButtons, null, 'delete')
        deleteBtn.addEventListener('click', this.delete.bind(this))
    }

    async done() {
        try {
            const response = await this.update({ ...this.todoData, done: !this.todoData.done })

            if (response.ok) {
                this.todoData = await response.json()
                this.todoData.done ? this.todo?.classList.add('done') : this.todo?.classList.remove('done')
                this.updateList(EDIT_EVENT, this.todoData)
            } else throw new Error("Can't done todo, please try again later")
        } catch (err: any) {
            alert(err.message)
        }
    }

    async edit(isEditable: boolean) {
        if (!this.todoText) return
        this.todoText.setAttribute('contenteditable', isEditable.toString())

        if (isEditable) this.todoText.focus()
        if (isEditable || this.todoData.text === this.todoText.innerHTML) return

        try {
            const response = await this.update({ ...this.todoData, text: this.todoText.innerHTML })

            if (response.ok) {
                this.todoData = await response.json()
                this.updateList(EDIT_EVENT, this.todoData)
            } else throw new Error("Can't edit todo, please try again later")
        } catch (err: any) {
            alert(err.message)
        } finally {
            this.todoText.innerHTML = this.todoData.text
        }
    }

    async delete() {
        try {
            const response = await this.update({ ...this.todoData, deleted: true })

            if (response.ok) {
                this.todo?.remove()
                this.updateList(DELETE_EVENT, this.todoData)
            } else throw new Error("Can't delete todo, please try again later")
        } catch (err: any) {
            alert(err.message)
        }
    }

    async update(updatedData: ITodo) {
        return await fetch(UPDATE_TODO_URL, {
            method: 'POST',
            body: JSON.stringify(updatedData),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}

export default Todo
