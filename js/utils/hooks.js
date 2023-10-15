export function createElement(tagName, className, parent, options, appendToStart) {
    const tag = document.createElement(tagName)
    if (className) tag.classList.add(...className.split(' '))
    if (parent) {
        if (appendToStart) {
            parent.prepend(tag)
        } else {
            parent.append(tag)
        }
    }
    if (options) {
        for (let key in options) {
            tag.setAttribute(key, options[key])
        }
    }

    return tag
}

export async function fetchTodos(url, options) {
    const response = await fetch(url, options)
    return await response.json()
}
