import Projects from './projects/projects.js'
import Todos from './todos/todos.js'

import { createElement } from '../utils/hooks.js'
import { PROJECT_TAB, TODO_TAB, BIN_TAB, TAB_ANIMATION_DURATION } from '../utils/constans.js'

class App {
    wrapper: HTMLElement
    header: HTMLElement
    main: HTMLElement
    firstInit: boolean
    animDuration: number

    constructor(wrapper: HTMLElement) {
        this.wrapper = wrapper
        this.header = createElement('header', null, this.wrapper)
        this.main = createElement('main', null, this.wrapper)
        this.firstInit = true
        this.animDuration = 0
    }

    init() {
        const tab = sessionStorage.getItem('tab') || 'project'
        const projectId = sessionStorage.getItem('projectId')
        const projectName = sessionStorage.getItem('projectName')

        createElement('h1', 'header-title', this.header, null, 'My Projects')

        if (tab === PROJECT_TAB) this.openProjects()
        if (tab === TODO_TAB && projectId && projectName) this.openTodos(projectId, projectName)
        if (projectId && projectName) this.openTodos(projectId, projectName)
        if (tab === BIN_TAB) this.openBin()
    }

    openProjects() {
        this.switchTab()
        sessionStorage.setItem('tab', PROJECT_TAB)

        setTimeout(() => {
            this.main.innerHTML = ''
            const projects = new Projects(this.main)
            projects.init()
        }, this.animDuration)
    }

    openTodos(projectId: string, projectName: string) {
        this.switchTab()
        sessionStorage.setItem('tab', TODO_TAB)
        sessionStorage.setItem('projectId', projectId)
        sessionStorage.setItem('projectName', projectName)

        setTimeout(() => {
            this.main.innerHTML = ''
            const todos = new Todos(this.main)
            todos.init()
        }, this.animDuration)
    }

    openBin() {
        sessionStorage.setItem('tab', BIN_TAB)
    }

    switchTab() {
        if (this.firstInit) {
            this.firstInit = false
            return
        }

        this.animDuration = TAB_ANIMATION_DURATION / 2
        this.main.classList.add('switch')

        setTimeout(() => {
            this.main.classList.remove('switch')
        }, TAB_ANIMATION_DURATION)
    }

    logIn() {}
    logOut() {}
}

export default App
