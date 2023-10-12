import TodoList from './todo-list.js'

const listElem = document.querySelector('#todo_list')
const openBinBtn = document.querySelector('#open_bin_btn')

const addTodoInput = document.querySelector('#add_todo_input')
const addTodoBtn = document.querySelector('#add_todo_btn')

const list = new TodoList(listElem, addTodoInput, addTodoBtn)

list.init()
