import { createElement } from '../../utils/hooks.js'
import { EDIT_EVENT, DELETE_EVENT, UPDATE_PROJECT_URL } from '../../utils/constans.js'

import type { IProject } from '../../utils/types.js'

class Project {
    wrapper: HTMLElement
    projectData: IProject
    openTodos: (projectId: string) => void
    updateList: (e: CustomEvent, data: IProject) => void
    project: HTMLElement | null
    projectName: HTMLElement | null

    constructor(
        wrapper: HTMLElement,
        projectData: IProject,
        openTodos: (projectId: string) => void,
        updateList: (e: CustomEvent, data: IProject) => void
    ) {
        this.wrapper = wrapper
        this.projectData = projectData
        this.openTodos = openTodos
        this.updateList = updateList
        this.project = null
        this.projectName = null
    }

    init() {
        this.project = createElement('li', 'project-item', this.wrapper, {
            'data-project': this.projectData.name,
            id: this.projectData.id,
        })

        this.renderProjectData()
        this.renderActionButtons()
    }

    renderProjectData() {
        this.projectName = createElement('h3', 'project-name', this.project)
        this.projectName.addEventListener('blur', this.edit.bind(this, false))
        this.projectName.innerHTML = this.projectData.name
        createElement('div', 'project-id', this.project, null, `<b>id:</b> <i>${this.projectData.id}</i>`)
    }

    renderActionButtons() {
        const actionButtons = createElement('div', 'action-buttons', this.project)

        const openBtn = createElement('button', 'open-project-btn', actionButtons, null, 'open')
        openBtn.addEventListener('click', this.openTodos.bind(this, this.projectData.id))

        const editBtn = createElement('button', 'edit-project-btn', actionButtons, null, 'edit')
        editBtn.addEventListener('click', this.edit.bind(this, true))

        const deleteBtn = createElement('button', 'delete-project-btn', actionButtons, null, 'delete')
        deleteBtn.addEventListener('click', this.delete.bind(this))
    }

    async edit(isEditable: boolean) {
        if (!this.projectName) return
        this.projectName.setAttribute('contenteditable', isEditable.toString())

        if (isEditable) this.projectName.focus()
        if (isEditable || this.projectData.name === this.projectName.innerHTML) return

        try {
            const response = await fetch(UPDATE_PROJECT_URL, {
                method: 'POST',
                body: JSON.stringify({ ...this.projectData, name: this.projectName.innerHTML }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                this.projectData = await response.json()
                this.updateList(EDIT_EVENT, this.projectData)
            } else throw new Error("Can't edit project, please try again later")
        } catch (err: any) {
            alert(err.message)
        } finally {
            this.projectName.innerHTML = this.projectData.name
        }
    }

    async delete() {
        try {
            const response = await fetch(UPDATE_PROJECT_URL, {
                method: 'POST',
                body: JSON.stringify({ ...this.projectData, deleted: true }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                this.project?.remove()
                this.updateList(DELETE_EVENT, this.projectData)
            } else throw new Error("Can't delete project, please try again later")
        } catch (err: any) {
            alert(err.message)
        }
    }
}

export default Project
