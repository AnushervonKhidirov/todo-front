import { createElement } from '../../utils/hooks.js'
import { GET_BIN_DATA } from '../../utils/constans.js'
import { IProject, ITodo } from '../../utils/types.js'

class Bin {
    wrapper: HTMLElement
    bin: { projects: IProject[]; todos: ITodo[] } | null

    constructor(wrapper: HTMLElement) {
        this.wrapper = wrapper
        this.bin = null
    }

    async init() {
        await this.fetchData()
        console.log(this.bin)
    }

    async fetchData() {
        try {
            const response = await fetch(GET_BIN_DATA)
            if (response.ok) {
                this.bin = await response.json()
            } else throw new Error("Cant' to get deleted items, try again later")
        } catch (err: any) {
            alert(err.message)
        }
    }
}

export default Bin
