const { spawn } = require("child_process");
const path = require('path');
const { argv } = require('yargs');

cmd(
    [ 
        "node component --output {{output}} --sdk_version {{sdk_version}}"
    ]
);

async function cmd(commands) {
    run(commands);
}

function run(commands) {
    let command = commands.shift();

    if (argv?.output) {
        command = command.replace('{{output}}', argv?.output);
    }

    if (argv?.sdk_version) {
        command = command.replace('{{sdk_version}}', argv?.sdk_version);
    }

    let fullCommands = command.split(' ');
    let initCommand = fullCommands.shift();
    let options = {
        shell: true
    }

    if (initCommand === 'node') {
        options.cwd = path.resolve();
    }

    const ls = spawn(
        initCommand,
        fullCommands,
        options
    );

    ls.stdout.on("data", data => {
        console.log(`${data}`);
    });

    ls.stderr.on("data", data => {
        console.log(`${data}`);
    });

    ls.on("close", code => {
        if (commands.length) {
            run(commands);
        } else {
            console.log('Component generated!!!');
        }
    });
}
