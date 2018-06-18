export default class Repeater {

    intervalId?: number

    constructor(
        private readonly initialFunction: () => Promise<void>,
        private readonly repeatingFunction: () => void,
        private readonly repeatIntervalInMs: number
    ) {
    }

    async start() {
        await this.initialFunction()
        this.intervalId = setInterval(() => {
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