import { NAVIGATE_EVENT } from './constants.js'
import { IUrlParams } from './types.js'

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

export function navigate(url: string) {
    window.location.assign(url)
}

export function getCurrTabName(): string | null {
    const tabName = window.location.hash.match(/.*?\#([^]*)\?.*/)
    return tabName ? tabName[1] : null
}

export function getUrlParams(): IUrlParams {
    const urlParams = window.location.hash.match(/.*?\?([^]*).*/)
    const paramsObj: IUrlParams = {}

    if (urlParams) {
        const params = urlParams[1].replace(/%20/g, ' ')

        params.split('&')?.forEach(param => {
            const key = param.split('=')[0]
            paramsObj[key] = param.split('=')[1]
        })
    }

    return paramsObj
}
