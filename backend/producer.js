const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis({
  maxRetriesPerRequest: null, 
});

const fileQueue = new Queue("file-queue", {
  connection,
});

module.exports = {
  connection,
  fileQueue,
};
