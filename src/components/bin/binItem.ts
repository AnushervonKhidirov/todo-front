import { DELETE_PROJECT_URL, DELETE_TODO_URL, UPDATE_PROJECT_URL, UPDATE_TODO_URL } from '../../utils/constants.js'
import { createElement } from '../../utils/hooks.js'
import type { IProject, ITodo } from '../../utils/types.js'

export class BinProjectItem {
    wrapper: HTMLElement
    data: IProject
    binItem: HTMLLIElement

    constructor(wrapper: HTMLElement, data: IProject) {
        this.wrapper = wrapper
        this.data = data
        this.binItem = createElement<HTMLLIElement>('li', `bin-item project-bin-item`, this.wrapper, {
            'project-id': this.data.id,
        })
    }

    init() {
        this.renderBinItem()
        if (this.data.deleted) this.renderActionButtons()
    }

    renderBinItem() {
        createElement('h2', 'bin-type', this.binItem, null, 'Project')
        createElement('h3', 'bin-item-text', this.binItem, null, this.data.name)
    }

    renderActionButtons() {
        const actionButtons = createElement('div', 'action-buttons bin-action-buttons', this.binItem)
        const restoreBtn = createElement<HTMLButtonElement>('button', 'edit-todo-btn', actionButtons, null, 'restore')
        const deleteBtn = createElement<HTMLButtonElement>('button', 'delete-todo-btn', actionButtons, null, 'delete')

        restoreBtn.addEventListener('click', this.restoreItem.bind(this))
        deleteBtn.addEventListener('click', this.deleteItem.bind(this))
    }

    async restoreItem() {
        console.log(this);
        
        try {
            const response = await fetch(UPDATE_PROJECT_URL, {
                method: 'POST',
                body: JSON.stringify({ ...this.data, deleted: false }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) this.binItem?.remove()
        } catch (err: any) {
            alert(err.message)
        }
    }

    async deleteItem() {
        try {
            const response = await fetch(DELETE_PROJECT_URL, {
                method: 'DELETE',
                body: JSON.stringify(this.data),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) this.binItem?.remove()
        } catch (err: any) {
            alert(err.message)
        }
    }
}

export class BinTodoItem {
    wrapper: HTMLElement
    data: ITodo
    binItem: HTMLLIElement | null

    constructor(wrapper: HTMLElement, data: ITodo) {
        this.wrapper = wrapper
        this.data = data
        this.binItem = null
    }

    init() {
        this.renderBinItem()
        this.renderActionButtons()
    }

    renderBinItem() {
        this.binItem = createElement<HTMLLIElement>('li', `bin-item todo-bin-item`, this.wrapper, {
            'todo-id': this.data.id,
        })

        createElement('h3', 'bin-type', this.binItem, null, 'Todo')
        createElement('div', 'bin-item-text', this.binItem, null, this.data.text)
    }

    renderActionButtons() {
        const actionButtons = createElement('div', 'action-buttons bin-action-buttons', this.binItem)
        const restoreBtn = createElement<HTMLButtonElement>('button', 'edit-todo-btn', actionButtons, null, 'restore')
        const deleteBtn = createElement<HTMLButtonElement>('button', 'delete-todo-btn', actionButtons, null, 'delete')

        restoreBtn.addEventListener('click', this.restoreItem.bind(this))
        deleteBtn.addEventListener('click', this.deleteItem.bind(this))
    }

    async restoreItem() {
        try {
            const response = await fetch(UPDATE_TODO_URL, {
                method: 'POST',
                body: JSON.stringify({ ...this.data, deleted: false }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) this.binItem?.remove()
        } catch (err: any) {
            alert(err.message)
        }
    }

    async deleteItem() {
        try {
            const response = await fetch(DELETE_TODO_URL, {
                method: 'DELETE',
                body: JSON.stringify(this.data),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) this.binItem?.remove()
        } catch (err: any) {
            alert(err.message)
        }
    }
}
