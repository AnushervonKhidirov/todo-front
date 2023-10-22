import Projects from './projects.js'
import { createElement } from '../utils/hooks.js'

class App {
    constructor(public wrapper: HTMLElement) {
        this.wrapper = wrapper
    }

    init() {
        this.renderHeader()
        this.renderMain()
    }

    renderHeader() {
        const header = createElement('header', null, this.wrapper)
        createElement('h1', 'header-title', header, null, 'My Projects')
    }

    renderMain() {
        const main = createElement('main', null, this.wrapper)
        this.openProjects(main)
    }

    openProjects(projectListWrapper: HTMLElement) {
        const project = new Projects(projectListWrapper, this.openTodos)
        project.init()
    }

    openTodos() {}
    openBin() {}

    closeProjects() {}
    closeTodos() {}
    closeBin() {}

    logIn() {}
    logOut() {}
}

export default App
