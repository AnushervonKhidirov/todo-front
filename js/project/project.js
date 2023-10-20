import ProjectList from './project-list.js'

import { createElement } from '../utils/hooks.js'
import { GET_ALL_PROJECT_URL, ADD_PROJECT_URL, REMOVE_EVENT } from '../utils/constans.js'

class Project {
    constructor(wrapper) {
        this.wrapper = wrapper
        this.projects = {}
    }

    async init() {
        await this.fetchAllProjects()
        this.renderList()
        this.renderForm()
    }

    renderList() {
        this.projectListWrapper = createElement('div', 'project-list-wrapper', this.wrapper)
        createElement('h1', 'project-header', this.projectListWrapper, null, 'My projects')

        this.projectList = new ProjectList(this.projectListWrapper, this.projects.active, this.updateList.bind(this))
        this.projectList.init()
    }

    renderForm() {
        this.form = createElement('form', 'add-project-form', this.projectListWrapper)
        this.formInput = createElement('input', 'input-project', this.form, {
            type: 'text',
            placeholder: 'Project name',
        })

        this.formBtn = createElement('button', 'submit-project', this.form, { type: 'submit' }, 'Add project')
        this.form.addEventListener('submit', this.addProject.bind(this))
    }

    async addProject(e) {
        e.preventDefault()

        if (!this.formInput.value) return

        const response = await fetch(ADD_PROJECT_URL, {
            method: 'POST',
            body: JSON.stringify({ text: this.formInput.value }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) return

        this.projects.all.push(await response.json())
        this.formInput.value = ''
        this.updateProjects()
    }

    async fetchAllProjects() {
        const response = await fetch(GET_ALL_PROJECT_URL)

        if (response.ok) {
            this.projects.all = await response.json()
            this.updateProjects()
        } else this.projects.all = []
    }

    updateList(updatedProject, event) {
        this.projects.all =
            event === REMOVE_EVENT
                ? this.projects.all.filter(project => project.id !== updatedProject.id)
                : this.projects.all.map(project => (project.id === updatedProject.id ? updatedProject : project))

        this.updateProjects()
    }

    updateProjects() {
        this.projects.active = this.projects.all.filter(project => !project.isOnTrash)
        this.projects.onTrash = this.projects.all.filter(project => project.isOnTrash)

        if (this.projectList) this.projectList.update(this.projects.active)
    }
}

export default Project
