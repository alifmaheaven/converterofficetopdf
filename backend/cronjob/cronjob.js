const cron = require('node-cron');

const jobs1 = require('./jobs/jobs1');

cron.schedule('* * * * *', function() {
    // function jobs you want todo
    jobs1.deleteFiles();

});

module.exports = cron;