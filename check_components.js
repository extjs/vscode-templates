require('dotenv').config();
const axios = require('axios');
const path = require('path');
const fs = require("fs-extra");
const { argv } = require('yargs');

function run() {
    for (let mode of ["classic", 'modern']) {
        let configFile = path.resolve(`${argv?.config}.json`);
        let config = JSON.parse(
          fs.readFileSync(configFile, 'utf8')
        );

        for (let component of (mode === "classic" ? config?.classicComponents : config?.modernComponents)) {
            generateEscapedComponent(mode, component + '.json');
        }
    }
}

function generateEscapedComponent(toolkit, name) {
    let filePath = path.join('data', 'ext-' + process.env.VERSION, toolkit);
    let dirPath = argv?.output
                    ? argv?.output + path.sep + filePath
                    : path.resolve('data', 'ext-' + process.env.VERSION, toolkit);

    if (!fs.existsSync(dirPath + path.sep + name)) {
        let serverPath = path.join('CelestialSystem', 'vscode-data-model', 'master', 'components', 'ext-' + process.env.VERSION, toolkit, name);

        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const instance = axios.create({
            baseURL: process.env.GITHUB_HOST,
            auth: {
                username: process.env.GITHUB_USERNAME,
                password: process.env.GITHUB_PASSWORD
            }
        });

        instance.get(serverPath)
            .then(
                (response) => {
                    fs.writeFile(
                        dirPath + path.sep + name,
                        JSON.stringify(response.data, null, 4),
                        { flag: 'wx' }
                    );

                    console.log(name + ' has been generated!!!');
                }
            )
            .catch(function (error) {
                console.log('Invalid file name!!!');
            });
    }
}

run();