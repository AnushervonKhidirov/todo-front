export const GET_ALL_TODO_URL = 'http://localhost:8000/todos/all'
export const GET_ACTIVE_TODO_URL = 'http://localhost:8000/todos/active'
export const GET_DELETED_TODO_URL = 'http://localhost:8000/todos/deleted'
export const ADD_TODO_URL = 'http://localhost:8000/todos/add'
export const UPDATE_TODO_URL = 'http://localhost:8000/todos/update'
export const DELETE_TODO_URL = 'http://localhost:8000/todos/delete'

export const GET_ALL_PROJECT_URL = 'http://localhost:8000/projects/all'
export const GET_ACTIVE_PROJECT_URL = 'http://localhost:8000/projects/active'
export const GET_DELETED_PROJECT_URL = 'http://localhost:8000/projects/deleted'
export const ADD_PROJECT_URL = 'http://localhost:8000/projects/add'
export const UPDATE_PROJECT_URL = 'http://localhost:8000/projects/update'
export const DELETE_PROJECT_URL = 'http://localhost:8000/projects/delete'

export const GET_BIN_DATA = 'http://localhost:8000/bin'

// export const PROJECT_TAB = 'project'
export const TODO_TAB = 'todo'
export const BIN_TAB = 'bin'

export const TAB_ANIMATION_DURATION = 1500

export const ADD_EVENT = new CustomEvent('add')
export const EDIT_EVENT = new CustomEvent('edit')
export const DELETE_EVENT = new CustomEvent('delete')
export const NAVIGATE_EVENT = new CustomEvent('navigate')
