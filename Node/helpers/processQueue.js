class Queue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }
  
    // Method to add a task to the queue
    async add(task) {
        this.queue.push(task);
        if (!this.processing) {
            this.processing = true;
            await this.processQueue();
            this.processing = false;
        }
    }
  
    // Method to process the queue
    async processQueue() {
        while (this.queue.length > 0) {
            const task = this.queue.shift();
            await task();
        }
    }
}
  