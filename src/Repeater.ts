export default class Repeater {

    intervalId?: number

    constructor(
        private readonly initialFunction: () => Promise<void>,
        private readonly repeatingFunction: () => void,
        private readonly repeatIntervalInMs: number
    ) {
    }

    // TODO remove
    async start(): Promise<void> {
        await this.initialFunction()
<<<<<<< HEAD
        this.intervalId = window.setInterval(() => {
            this.repeatingFunction()
        }, this.repeatIntervalInMs)
=======
        this.intervalId = window.setInterval(() => this.repeatingFunction(), this.repeatIntervalInMs)
>>>>>>> 938efde1dc0615aab7a5291c511f3c65aa65dea1
    }

    // TODO rename to start
    continue(): void {
        this.intervalId = window.setInterval(() => this.repeatingFunction(), this.repeatIntervalInMs)
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    }

    restart(): void {
        this.stop()
        this.start()
    }

}