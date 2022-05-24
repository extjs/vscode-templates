const fs = require("fs-extra");
const { spawn } = require("child_process");
const path = require('path');
const { argv } = require('yargs');
const os = require('os');

cmd(
    [
        "cd ext ; sencha ant",
        "cd ext/classic/classic ; sencha package build",
        "cd ext/modern/modern ; sencha package build",
        "cd docs/classic ; sencha doxi build all-classes-flatten",
        "cd docs/modern ; sencha doxi build all-classes-flatten",
        "cp -r build/docs data",
        "node generate_components --output {{output}} --sdk_version {{sdk_version}}"
    ]
);

async function cmd(commands) {
    run(commands);
}

function run(commands) {
    let command = commands.shift();
    let sdkPath = path.join(...argv.sdk.split(/(?:\/|\\)/).filter(item => item));

    if (os.type() !== 'Windows_NT') {
        sdkPath = path.sep + sdkPath;
    }

    if (argv?.output) {
        command = command.replace('{{output}}', argv?.output);
    }

    let configFile = path.join(sdkPath, 'package.json');
    let config = JSON.parse(
      fs.readFileSync(configFile, 'utf8')
    );

    if (config?.version) {
        command = command.replace('{{sdk_version}}', config?.version);
    }

    let fullCommands = command.split(' ');
    let initCommand = fullCommands.shift();
    let options = {
        shell: true
    }

    if (initCommand === 'cd') {
        options.cwd = path.join(sdkPath,...fullCommands.shift().split(/(?:\/|\\)/));
        fullCommands.shift();
        initCommand = fullCommands.shift();
    }

    if (initCommand === 'cp') {
        if (os.type() === 'Windows_NT') {
            initCommand = 'xcopy';
            fullCommands[0] = '/E /H /C /I';
        }

        fullCommands[1] = path.join(sdkPath,...fullCommands[1].split(/(?:\/|\\)/));
        fullCommands[2] = path.resolve(...fullCommands[2].split(/(?:\/|\\)/));
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
            console.log('Done all process!!!');
        }
    });
}
