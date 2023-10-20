import { createElement, fetchData } from '../utils/hooks.js'
import { UPDATE_PROJECT_URL } from '../utils/constans.js'

class ProjectItem {
    constructor(wrapper, projectData, updateList) {
        this.wrapper = wrapper
        this.projectData = projectData
        this.updateList = updateList
    }

    init() {
        this.project = createElement('li', 'project-item', this.wrapper, {
            options: {
                'data-project': this.projectData.name,
                id: this.projectData.id,
            },
        })

        this.renderProjectData()
        this.renderActionButtons()
    }

    renderProjectData() {
        this.projectName = createElement('h3', 'project-name', this.project)
        this.projectName.innerHTML = this.projectData.name
        this.projectName.addEventListener('blur', () => this.updateProject(false))

        const projectId = createElement('div', 'project-id', this.project)
        projectId.innerHTML = `<b>id:</b> <i>${this.projectData.id}</i>`
    }

    renderActionButtons() {
        const actionButtons = createElement('div', 'action-buttons', this.project)

        this.editBtn = createElement('button', 'edit-project-btn', actionButtons)
        this.editBtn.innerHTML = 'edit'
        this.editBtn.addEventListener('click', () => this.updateProject(true))

        this.deleteBtn = createElement('button', 'delete-project-btn', actionButtons)
        this.deleteBtn.innerHTML = 'delete'
        this.deleteBtn.addEventListener('click', () => this.confirmToDelete())
    }

    async updateProject(isEditable) {
        this.projectName.setAttribute('contenteditable', isEditable)

        if (isEditable) this.projectName.focus()
        if (isEditable || this.projectData.name === this.projectName.innerHTML) return

        const response = await fetchData(UPDATE_PROJECT_URL, {
            method: 'POST',
            body: JSON.stringify({ ...this.projectData, name: this.projectName.innerHTML }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        this.updateList(response)
    }

    async delete() {
        const response = await fetchData(UPDATE_PROJECT_URL, {
            method: 'POST',
            body: JSON.stringify({ ...this.projectData, isOnTrash: true }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        this.updateList(response)
    }

    confirmToDelete() {
        const confirmWindow = createElement('div', 'confirm-window', this.project)
        const confirmText = createElement('div', 'confirm-text', confirmWindow)
        const confirmAnswers = createElement('div', 'confirm-answers', confirmWindow)

        const confirmYes = createElement('button', 'confirm-btn confirm-btn-yes', confirmAnswers)
        const confirmNo = createElement('button', 'confirm-btn confirm-btn-yes', confirmAnswers)

        confirmText.innerHTML = `Are you sure you want to delete <b>${this.projectData.name}</b>?`
        confirmYes.innerHTML = 'Yes'
        confirmNo.innerHTML = 'No'

        this.project.classList.add('flip')

        confirmYes.addEventListener('click', () => {
            this.delete()
        })
        confirmNo.addEventListener('click', () => {
            this.project.classList.remove('flip')
            this.project.addEventListener('transitionend', removeConfirmWindow)
        })

        function removeConfirmWindow() {
            confirmWindow.remove()
            this.project.removeEventListener('transitionend', removeConfirmWindow)
        }
    }
}

export default ProjectItem
