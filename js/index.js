const ICON_DONE =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="#000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const ICON_EDIT =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M20.1498 7.93997L8.27978 19.81C7.21978 20.88 4.04977 21.3699 3.32977 20.6599C2.60977 19.9499 3.11978 16.78 4.17978 15.71L16.0498 3.84C16.5979 3.31801 17.3283 3.03097 18.0851 3.04019C18.842 3.04942 19.5652 3.35418 20.1004 3.88938C20.6356 4.42457 20.9403 5.14781 20.9496 5.90463C20.9588 6.66146 20.6718 7.39189 20.1498 7.93997V7.93997Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round"stroke-linejoin="round"/></svg>'
const ICON_REMOVE =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"/></svg>'

class Todo {
    constructor(todoList, todoItem) {
        this.todoItemData = todoItem
        this.todoList = todoList
    }
    create() {
        const todoItemClass = this.todoItemData.isDone ? 'todo todo_done' : 'todo'

        this.todoItem = createElement('li', todoItemClass, this.todoList, {
            id: this.todoItemData.id,
        })
        const todoText = createElement('div', 'todo_text', this.todoItem)
        const todoIcons = createElement('div', 'todo_icons', this.todoItem)

        const doneIcon = createElement('div', 'icon done', todoIcons, { title: 'done' })
        const editIcon = createElement('div', 'icon edit', todoIcons, { title: 'edit' })
        const removeIcon = createElement('div', 'icon remove', todoIcons, { title: 'remove' })

        todoText.innerHTML = this.todoItemData.text

        doneIcon.innerHTML = ICON_DONE
        editIcon.innerHTML = ICON_EDIT
        removeIcon.innerHTML = ICON_REMOVE

        doneIcon.addEventListener('click', () => this.changeStatus())
    }

    changeStatus() {
        this.todoItemData.isDone = !this.todoItemData.isDone

        if (this.todoItemData.isDone) {
            this.todoItem.classList.add('todo_done')
        } else {
            this.todoItem.classList.remove('todo_done')
        }
    }
}

function createElement(tagName, className, parent, options) {
    const tag = document.createElement(tagName)
    if (className) tag.classList.add(...className.split(' '))
    if (parent) parent.appendChild(tag)
    if (options) {
        for (let key in options) {
            tag.setAttribute(key, options[key])
        }
    }

    return tag
}

const list = document.querySelector('#todo_list')

const todoData = [
    {
        id: 1,
        text: 'todo 1',
        isDone: false,
    },
    {
        id: 2,
        text: 'todo 2',
        isDone: false,
    },
    {
        id: 3,
        text: 'todo 3',
        isDone: true,
    },
]

todoData.forEach(todo => {
    const todoItem = new Todo(list, todo)
    todoItem.create()
})
