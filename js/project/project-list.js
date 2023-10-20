import ProjectItem from './project-item.js'

import { createElement } from '../utils/hooks.js'

class ProjectList {
    constructor(wrapper, projects, updateList) {
        this.wrapper = wrapper
        this.projects = projects
        this.updateList = updateList
    }

    init() {
        this.list = createElement('ul', 'project-list', this.wrapper)
        this.renderProjects()
    }

    renderProjects() {
        this.projects.forEach(project => {
            const projectItem = new ProjectItem(this.list, project, this.updateList.bind(this))
            projectItem.init()
        })
    }

    update(projects) {
        this.projects = projects
        this.list.innerHTML = ''
        this.renderProjects()
    }
}

export default ProjectList
