export default class ColorRepository {

    private colors = ["#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]

    private available = Array<string>()

    private repository = new Map<string, string>()

    private last = -1

    constructor() {
        this.available = this.colors.slice().reverse()
    }

    get(key: string): string {
        let color = this.repository.get(key)
        if (color) {
            return color
        } else {
            let color = this.available.length > 0 ? this.available.pop()! : this.colors[++this.last % this.colors.length]
            this.repository.set(key, color)
            return color
        }
    }

    free(key: string): void {
        const color = this.repository.get(key)
        console.log(color)
        if (color) {
            this.repository.delete(key)
            if (this.available.indexOf(color) == -1) {
                this.available.push(color)
            }
            console.log(this.available)
        }
    }

}