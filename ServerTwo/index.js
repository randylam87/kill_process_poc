const express = require('express')
const pids = require('port-pid');
const app = express()
const port = 3001
 
let pidsToKill = [];

const PORT_TO_KILL = 3000
pids(PORT_TO_KILL).then(pids => {
    pidsToKill = pids.tcp
});

function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) {
        console.log('about to kill processes on port', PORT_TO_KILL)
        pidsToKill.forEach(pid => {
            console.log('killing pid:', pid);
            process.kill(pid, 'SIGINT')
        })
        console.log('exiting now')
        process.exit()
    };
}

const TIME_UNTIL_EXIT_IN_MS = 5_000;
console.log('waiting', TIME_UNTIL_EXIT_IN_MS, 'ms until exiting')
setTimeout(() => {
    console.log('exiting app on port', port)
}, TIME_UNTIL_EXIT_IN_MS)

process.on('exit', exitHandler.bind(null, {exit:true})) // probably want to listen to exit when an process is complete
process.on('SIGINT', exitHandler.bind(null, {exit:true})); // this can be used for when you exit via ctrl + c