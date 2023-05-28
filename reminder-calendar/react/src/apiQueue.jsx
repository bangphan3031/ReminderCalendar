import PQueue from 'p-queue';

const queue = new PQueue({ concurrency: 5 }); // Giới hạn 5 yêu cầu đồng thời

export default queue;