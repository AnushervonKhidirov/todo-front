import Projects from './projects/projects.js'
import Todos from './todos/todos.js'
import { createElement } from '../utils/hooks.js'

class App {
    wrapper: HTMLElement
    header: HTMLElement
    main: HTMLElement

    constructor(wrapper: HTMLElement) {
        this.wrapper = wrapper
        this.header = createElement('header', null, this.wrapper)
        this.main = createElement('main', null, this.wrapper)
    }

    init() {
        createElement('h1', 'header-title', this.header, null, 'My Projects')
        this.openProjects()
    }

    openProjects() {
        this.main.innerHTML = ''
        const projects = new Projects(this.main, this.openTodos.bind(this))
        projects.init()
    }

    openTodos(projectId: string) {
        this.main.innerHTML = ''
        const todos = new Todos(this.main, projectId, this.openProjects.bind(this))
        todos.init()
    }

    openBin() {}

    closeProjects() {}
    closeTodos() {}
    closeBin() {}

    logIn() {}
    logOut() {}
}

export default App
