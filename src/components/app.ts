import Projects from './projects/projects.js'
import Todos from './todos/todos.js'

import { createElement, getCurrTabName, navigate } from '../utils/hooks.js'
import { TODO_TAB, BIN_TAB, TAB_ANIMATION_DURATION } from '../utils/constants.js'
import Bin from './bin/bin.js'

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
        this.renderHeader()
        window.addEventListener('hashchange', () => this.openTab())
        this.openTab(false)
    }

    renderHeader() {
        createElement('h1', 'header-title', this.header, null, 'My Projects')
        const binBtn = createElement('button', 'bin-btn', this.header, null, 'Recycle bin')
        binBtn.addEventListener('click', () => navigate(BIN_TAB))
    }

    openTab(animation: boolean = true) {
        const tab = getCurrTabName()
        
        if (animation) this.switchTabAnimation()

        setTimeout(
            () => {
                this.main.innerHTML = ''

                if (tab === TODO_TAB) return this.openTodos()
                if (tab === BIN_TAB) return this.openBin()
                
                this.openProjects()
            },
            animation ? TAB_ANIMATION_DURATION / 2 : 0
        )
    }

    openProjects() {
        const projects = new Projects(this.main)
        projects.init()
    }

    openTodos() {
        const todos = new Todos(this.main)
        todos.init()
    }

    openBin() {
        const bin = new Bin(this.main)
        bin.init()
    }

    switchTabAnimation() {
        this.main.classList.add('switch')

        setTimeout(() => {
            this.main.classList.remove('switch')
        }, TAB_ANIMATION_DURATION)
    }

    logIn() {}
    logOut() {}
}

export default App
