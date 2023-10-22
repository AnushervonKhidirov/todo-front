export function createElement<T extends HTMLElement>(
    tagName: string,
    className?: string | null,
    parent?: HTMLElement | null,
    attributes?: { [key: string]: string } | null,
    inner?: string | null,
    prepend?: boolean
): T {
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

    if (attributes) {
        for (let key in attributes) {
            tag.setAttribute(key, attributes[key])
        }
    }

    return tag as T
}
