import { createElement } from '../../utils/hooks.js'
import { EDIT_EVENT, DELETE_EVENT, UPDATE_TODO_URL } from '../../utils/constans.js'

import type { ITodo } from '../../utils/types.js'

class Todo {
    wrapper: HTMLElement
    todoData: ITodo
    openProjects: () => void
    updateList: (e: CustomEvent, data: ITodo) => void
    project: HTMLElement | null
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
        this.project = null
        this.todoText = null
        this.prepend = prepend
    }

    init() {
        this.project = createElement('li', 'todo-item', this.wrapper, {
            id: this.todoData.id,
        }, null, this.prepend)

        this.renderProjectData()
        this.renderActionButtons()
    }

    renderProjectData() {
        this.todoText = createElement('div', 'todo-text', this.project)
        this.todoText.addEventListener('blur', this.edit.bind(this, false))
        this.todoText.innerHTML = this.todoData.text
    }

    renderActionButtons() {
        const actionButtons = createElement('div', 'action-buttons', this.project)

        const editBtn = createElement('button', 'edit-todo-btn', actionButtons, null, 'edit')
        editBtn.addEventListener('click', this.edit.bind(this, true))

        const deleteBtn = createElement('button', 'delete-todo-btn', actionButtons, null, 'delete')
        deleteBtn.addEventListener('click', this.delete.bind(this))
    }

    async edit(isEditable: boolean) {
        if (!this.todoText) return
        this.todoText.setAttribute('contenteditable', isEditable.toString())

        if (isEditable) this.todoText.focus()
        if (isEditable || this.todoData.text === this.todoText.innerHTML) return

        try {
            const response = await fetch(UPDATE_TODO_URL, {
                method: 'POST',
                body: JSON.stringify({ ...this.todoData, text: this.todoText.innerHTML }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

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
            const response = await fetch(UPDATE_TODO_URL, {
                method: 'POST',
                body: JSON.stringify({ ...this.todoData, deleted: true }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                this.project?.remove()
                this.updateList(DELETE_EVENT, this.todoData)
            } else throw new Error("Can't delete todo, please try again later")
        } catch (err: any) {
            alert(err.message)
        }
    }
}

export default Todo
