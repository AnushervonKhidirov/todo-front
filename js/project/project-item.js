import { createElement } from '../utils/hooks.js'
import { UPDATE_PROJECT_URL } from '../utils/constans.js'

class ProjectItem {
    constructor(wrapper, projectData, updateList) {
        this.wrapper = wrapper
        this.projectData = projectData
        this.updateList = updateList
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
        this.projectName.addEventListener('blur', this.updateProject.bind(this, false))
        this.projectName.innerHTML = this.projectData.name
        createElement('div', 'project-id', this.project, null, `<b>id:</b> <i>${this.projectData.id}</i>`)
    }

    renderActionButtons() {
        const actionButtons = createElement('div', 'action-buttons', this.project)

        this.openBtn = createElement('button', 'open-project-btn', actionButtons, null, 'open')
        this.openBtn.addEventListener('click', this.openProject.bind(this))

        this.editBtn = createElement('button', 'edit-project-btn', actionButtons, null, 'edit')
        this.editBtn.addEventListener('click', this.updateProject.bind(this, true))

        this.deleteBtn = createElement('button', 'delete-project-btn', actionButtons, null, 'delete')
        this.deleteBtn.addEventListener('click', this.confirmToDelete.bind(this))
    }

    openProject() {}

    async updateProject(isEditable) {
        this.projectName.setAttribute('contenteditable', isEditable)

        if (isEditable) this.projectName.focus()
        if (isEditable || this.projectData.name === this.projectName.innerHTML) return

        const response = await fetch(UPDATE_PROJECT_URL, {
            method: 'POST',
            body: JSON.stringify({ ...this.projectData, name: this.projectName.innerHTML }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (response.ok) {
            this.updateList(await response.json())
        } else {
            console.log('?')
            this.projectName.innerHTML = this.projectData.name
        }
    }

    async delete() {
        const response = await fetch(UPDATE_PROJECT_URL, {
            method: 'POST',
            body: JSON.stringify({ ...this.projectData, isOnTrash: true }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) return

        this.updateList(await response.json())
    }

    confirmToDelete() {
        this.project.classList.add('flip')

        const confirmWindow = createElement('div', 'confirm-window', this.project)
        const confirmText = createElement('div', 'confirm-text', confirmWindow, null)
        const confirmAnswers = createElement('div', 'confirm-answers', confirmWindow)
        const confirmYes = createElement('button', 'confirm-btn confirm-btn-yes', confirmAnswers, null, 'Yes')
        const confirmNo = createElement('button', 'confirm-btn confirm-btn-yes', confirmAnswers, null, 'No')

        confirmText.innerHTML = `Are you sure you want to delete <b>${this.projectData.name}</b>?`
        confirmYes.addEventListener('click', this.delete.bind(this))
        confirmNo.addEventListener('click', flipBack.bind(this))

        function flipBack() {
            this.project.classList.remove('flip')
            this.project.addEventListener('transitionend', removeConfirmWindow.bind(this))
        }

        function removeConfirmWindow() {
            confirmWindow.remove()
            this.project.removeEventListener('transitionend', removeConfirmWindow.bind(this))
        }
    }
}

export default ProjectItem
