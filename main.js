const p = require('prompt-sync')();

function start() {
    while(true) {
        let inputCMD = p("project@pandemic_cp#~ ");
        if(inputCMD === "test") {
            console.log("working");
        }
    }
}