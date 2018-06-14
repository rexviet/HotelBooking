import kue from 'kue';
import requireDir from 'require-dir';

let queue, queueUI;
let instance = null;

export default class Queue {
  constructor() {
    this.time = Date.now();
  }

  static init(kueConfigs, kueUIConfigs) {
    queue = kue.createQueue(kueConfigs);
    queueUI = kue.app;
    queueUI.set('title', 'Kue Service');
    queueUI.listen(kueUIConfigs.port, function () {
      console.log('Queue listening on port:', kueUIConfigs.port);
    });

    // import all workers
    requireDir('./workers');
  }

  static getInstance() {
    if (!instance) {
      instance = new Queue();
    }
    return instance;
  }

  getTime() {
    return this.time;
  }

  getQueue() {
    return queue;
  }

  pushJob(jobTitle, data) {
    queue.create(jobTitle, data).removeOnComplete(true).save();
  }
}