export default class Repeater {

    intervalId?: number

    constructor(
        private readonly initialFunction: () => Promise<any>,
        private readonly repeatingFunction: () => any,
        private readonly repeatIntervalInMs: number
    ) {
    }

    // TODO remove
    async start() {
        await this.initialFunction()
        this.intervalId = window.setInterval(() => {
            this.repeatingFunction()     
        }, this.repeatIntervalInMs)
    }

    // TODO rename to start
    continue() {
        this.intervalId = window.setInterval(() => {
            this.repeatingFunction()     
        }, this.repeatIntervalInMs)
    }
    
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    }
    
    restart() {
        this.stop();
        this.start();
    }
    
}