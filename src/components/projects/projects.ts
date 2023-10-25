import Project from './project.js'

import { createElement } from '../../utils/hooks.js'
import { GET_ACTIVE_PROJECT_URL, ADD_PROJECT_URL, ADD_EVENT } from '../../utils/constants.js'

import type { IProject } from '../../utils/types.js'

class Projects {
    wrapper: HTMLElement
    projectList: HTMLUListElement
    projects: IProject[]
    formInput: HTMLInputElement | null
    eventsAdded: boolean

    constructor(wrapper: HTMLElement) {
        this.wrapper = wrapper
        this.projects = []
        this.projectList = createElement<HTMLUListElement>('ul', 'project-list', this.wrapper)
        this.formInput = null
        this.eventsAdded = false
    }

    async init() {
        await this.fetchData()
        this.renderProjectList()
        this.renderForm()
    }

    async fetchData() {
        try {
            const response = await fetch(GET_ACTIVE_PROJECT_URL)

            if (response.ok) {
                this.projects = await response.json()
            } else throw new Error("Cant' to get projects, try again later")
        } catch (err: any) {
            alert(err.message)
        }
    }

    renderProjectList() {
        this.projects.forEach(projectData => {
            this.renderProject(this.projectList, projectData)
        })
    }

    renderProject(wrapper: HTMLUListElement, data: IProject) {
        const project = new Project(wrapper, data)
        project.init()

        if (project.projectElem) this.addProjectEvents(project)
        return project.projectElem
    }

    renderForm() {
        const form = createElement<HTMLFormElement>('form', 'add-project-form', this.wrapper)
        this.formInput = createElement<HTMLInputElement>('input', 'input-project', form, {
            type: 'text',
            placeholder: 'Project name',
        })

        createElement('button', 'submit-project', form, { type: 'submit' }, 'Add project')
        form.addEventListener('submit', this.addProject.bind(this))
    }

    async addProject(e: SubmitEvent) {
        e.preventDefault()

        if (!this.formInput?.value) return

        try {
            const response = await fetch(ADD_PROJECT_URL, {
                method: 'POST',
                body: JSON.stringify({ text: this.formInput.value }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const projectData: IProject = await response.json()
                const projectElem = this.renderProject(this.projectList, projectData)
                projectElem?.dispatchEvent(ADD_EVENT)
                this.formInput.value = ''
            } else throw new Error("Can't to add project, try again later")
        } catch (err: any) {
            alert(err.message)
        }
    }

    addProjectEvents(project: Project) {
        const { projectElem, projectData } = project

        projectElem?.addEventListener('add', () => {
            this.projects.push(project.projectData)
        })
        projectElem?.addEventListener('edit', () => {
            this.projects = this.projects.map(project => (project.id === projectData.id ? projectData : project))
        })
        projectElem?.addEventListener('delete', () => {
            this.projects = this.projects.filter(project => project.id !== projectData.id)
        })
    }
}

export default Projects
