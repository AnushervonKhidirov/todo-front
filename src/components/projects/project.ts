import { createElement, navigate } from '../../utils/hooks.js'
import { EDIT_EVENT, DELETE_EVENT, UPDATE_PROJECT_URL, TODO_TAB } from '../../utils/constants.js'

import type { IProject } from '../../utils/types.js'

class Project {
    wrapper: HTMLElement
    projectData: IProject
    projectElem: HTMLLIElement | null
    projectName: HTMLElement | null

    constructor(wrapper: HTMLElement, projectData: IProject) {
        this.wrapper = wrapper
        this.projectData = projectData
        this.projectElem = null
        this.projectName = null
    }

    init() {
        this.renderProject()
        this.renderActionButtons()
    }

    renderProject() {
        this.projectElem = createElement<HTMLLIElement>('li', 'project-item', this.wrapper, {
            'data-project': this.projectData.name,
            id: this.projectData.id,
        })

        this.projectName = createElement('h3', 'project-name', this.projectElem, null, this.projectData.name)
        this.projectName.addEventListener('blur', this.edit.bind(this, false))

        createElement('div', 'project-id', this.projectElem, null, `<b>id:</b> <i>${this.projectData.id}</i>`)
    }

    renderActionButtons() {
        const actionButtons = createElement('div', 'action-buttons', this.projectElem)

        const openBtn = createElement<HTMLButtonElement>('button', 'open-project-btn', actionButtons, null, 'open')

        openBtn.addEventListener('click', () => {
            navigate(`${TODO_TAB}?projectId=${this.projectData.id}&projectName=${this.projectData.name}`)
        })

        const editBtn = createElement<HTMLButtonElement>('button', 'edit-project-btn', actionButtons, null, 'edit')
        editBtn.addEventListener('click', this.edit.bind(this, true))

        const deleteBtn = createElement<HTMLButtonElement>('button', 'delete-project-btn', actionButtons, null, 'delete')
        deleteBtn.addEventListener('click', this.delete.bind(this))
    }

    async edit(isEditable: boolean) {
        if (!this.projectName) return
        this.projectName.setAttribute('contenteditable', isEditable.toString())

        if (isEditable) this.projectName.focus()
        if (isEditable || this.projectData.name === this.projectName.innerHTML) return

        try {
            const response = await this.update({ ...this.projectData, name: this.projectName.innerHTML })

            if (response.ok) {
                this.projectData = await response.json()
                this.projectElem?.dispatchEvent(EDIT_EVENT)
            } else throw new Error("Can't edit project, please try again later")
        } catch (err: any) {
            alert(err.message)
        } finally {
            this.projectName.innerHTML = this.projectData.name
        }
    }

    async delete() {
        try {
            const response = await this.update({ ...this.projectData, deleted: true })

            if (response.ok) {
                this.projectElem?.dispatchEvent(DELETE_EVENT)
                this.projectElem?.remove()
            } else throw new Error("Can't delete project, please try again later")
        } catch (err: any) {
            alert(err.message)
        }
    }

    async update(updatedData: IProject) {
        return await fetch(UPDATE_PROJECT_URL, {
            method: 'POST',
            body: JSON.stringify(updatedData),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}

export default Project
