const shell = require('shelljs');
const yargs = require('yargs');
const fs = require("fs");
require("colors");

// 读取apps目录
let appNames = fs.readdirSync('./src/apps');

// 解析命令行
const { argv } = yargs;
const apps = argv.apps;
const mode = argv.mode || 'buildpro';
let buildNames = appNames;
if (apps) {
    let tempNames = new Set();
    apps.split(' ').forEach((item) => {
        if (appNames.includes(item)) {
            tempNames.add(item);
        }
    });
    buildNames = Array.from(tempNames);
}

if (buildNames.length <= 0) {
    throw new Error(`编译对象不能为空：${buildNames}`);
}

const buildMultiObj = {};
buildNames.forEach((appName)=>{
    const appFiles = fs.readdirSync(`./src/apps/${appName}`);
    if (appFiles.includes('tpl')) {
        buildMultiObj[appName] = 1;
    }
});

console.log('编译模式：'.green, mode.yellow);
console.log('编译对象：'.green, JSON.stringify(buildNames).yellow);
console.log('多页面模板：'.green, JSON.stringify(buildMultiObj).yellow);

// 开始执行编译命令
if (!['buildpro','buildtest','builddev'].includes(mode)) {
    throw new Error('编译模式不对：', mode);
}

const buildMode = mode === 'buildpro' ? '' : `--mode=${mode}`;
for (let i = 0; i < buildNames.length; i++) {

    const buildMulti = buildMultiObj[buildNames[i]] ? '--multi' : '';

    shell.exec(`vue-cli-service build ${buildMode} --app=${buildNames[i]} ${buildMulti}`, (error, stdout, stderr) => {
        if (error) {
            throw new Error(`exec error: ${error}`);
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });

}


