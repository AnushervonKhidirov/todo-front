import Todo from './todo.js'

const todoWrapper = document.querySelector('#todo')
const list = new Todo(todoWrapper, 'Project title')

list.init()
