export function createElement(tagName, className, parent, attribute, inner, prepend) {
    const tag = document.createElement(tagName)

    if (className) tag.classList.add(...className.split(' '))
    
    if (parent) {
        if (prepend) {
            parent.prepend(tag)
        } else {
            parent.append(tag)
        }
    }

    if (inner) tag.innerHTML = inner

    if (attribute) {
        for (let key in attribute) {
            tag.setAttribute(key, attribute[key])
        }
    }

    return tag
}

export async function fetchData(url, options) {
    const response = await fetch(url, options)
    return await response.json()
}
