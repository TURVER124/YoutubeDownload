function DownloadsViewModel() {
    var self = this;

    self.queue = ko.observableArray();
    self.processing = ko.observable(false);

    self.add = async function(task) {
        self.queue.push(task);
        if (!self.processing) {
            self.processing = true;
            await self.processQueue();
            self.processing = false;
        }
    }

    self.processQueue = async function() {
        while (self.queue.length > 0) {
            const task = self.queue.shift();
            await task();
        }
    }
}

var downloadsModel = new DownloadsViewModel();
ko.applyBindings(downloadsModel);
