import { IUrlParams } from './types'

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

export function getCurrTabName(url: string): string | null {
    const tabName = url.match(/.*?\#([^]*)\?.*/)
    return tabName ? tabName[1] : null
}

export function getUrlParams(url: string): IUrlParams[] {
    const urlParams = url.match(/.*?\?([^]*).*/)

    if (!urlParams) return []

    const params = urlParams[1].replace(/%20/g, ' ')

    return params.split('&')?.map(param => ({
        name: param.split('=')[0],
        value: param.split('=')[1],
    }))
}
