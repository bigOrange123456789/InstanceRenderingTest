const obj2gltf = require('obj2gltf');
const fs = require('fs');
const gltfPipeline = require('gltf-pipeline');
const fsExtra = require('fs-extra');
const path = require('path');
const gltfToGlb = gltfPipeline.gltfToGlb;
const options = {
    dracoOptions: {
        compressionLevel: 7
    }
};
const inputPath = 'obj\\';//输入obj文件夹
const matrixPath = 'reuse\\';//输入dat矩阵文件夹
const outputPath = 'glb\\';//输出glb文件夹
const gltfPath = 'gltf\\';
const resultsPath = 'json\\';//最终结果（reuseInfo, interestTable）文件夹

let matrixMap = new Map();
let reuseData = {};
loadMatrix();
let files = fs.readdirSync(inputPath);
traverseObj2Glb(0, files.length);
let interestTable = {};

generateInterestTable();

function traverseObj2Glb(i, length) {
    if (i < length) {
        let basename = path.basename(files[i], '.obj');
        console.log("processing " + basename + '.obj');
        obj2glb(basename, i);
    } else {
        console.log('create GLB Files finished');
    }
}


function obj2glb(basename, id) {
    obj2gltf(inputPath + basename + '.obj')
        .then(function (gltf) {
            gltf.nodes[0].name = basename;
            if (matrixMap.get(basename) !== undefined)
                gltf.nodes[0].matrixArrs = JSON.stringify(matrixMap.get(basename));
            fsExtra.writeFileSync(gltfPath + basename + '.gltf', Buffer.from(JSON.stringify(gltf)));
            return Promise.resolve();
        })
        .then(function () {
            let data = fsExtra.readJsonSync(gltfPath + basename + '.gltf');
            return Promise.resolve(gltfToGlb(data, options));
        })
        .then(function (results) {
            fsExtra.writeFileSync(outputPath + basename + '.glb', results.glb);
            traverseObj2Glb(++id, files.length);
        });
}


function loadMatrix() {
    let files = fs.readdirSync(matrixPath);
    files.forEach(function (file) {
        console.log("processing " + file);
        let data = fs.readFileSync(matrixPath + file, { encoding: 'utf-8' });
        let name = path.basename(file, '.dat');
        splitMatrix(data, name);
    });
    fsExtra.writeFileSync(resultsPath + "reuseInfo.json", JSON.stringify(reuseData));
}


function splitMatrix(string, name) {
    let lineArr = string.split(/\n/);
    let reuseName = lineArr[0].split(/\s+/)[2];
    let mat = lineArr[1].split(/\s+/).slice(0, 16);
    if (matrixMap.get(reuseName) === undefined)
        matrixMap.set(reuseName, {});
    matrixMap.get(reuseName)[name] = mat;
    //导出重用文件列表
    reuseData[name] = reuseName;
}


function generateInterestTable() {
    console.log("start generating interest table!!!");

    files.forEach(function (file) {
        let data = fs.readFileSync(inputPath + file, "utf-8");
        let basename = path.basename(file, '.obj');
        let minX = 9999999;
        let minY = 9999999;
        let minZ = 9999999;
        let maxX = -9999999;
        let maxY = -9999999;
        let maxZ = -9999999;
        let dataArr = data.split(/\n/);
        dataArr.forEach(item => {
            if (item.indexOf("v") !== -1) {
                let vetArr = item.split(/\s+/);
                if (1.0 * vetArr[1] < minX)
                    minX = 1.0 * vetArr[1];
                if (1.0 * vetArr[2] < minY)
                    minY = 1.0 * vetArr[2];
                if (1.0 * vetArr[3] < minZ)
                    minZ = 1.0 * vetArr[3];

                if (1.0 * vetArr[1] > maxX)
                    maxX = 1.0 * vetArr[1];
                if (1.0 * vetArr[2] > maxY)
                    maxY = 1.0 * vetArr[2];
                if (1.0 * vetArr[3] > maxZ)
                    maxZ = 1.0 * vetArr[3];
            }
        });
        let interest = {};
        interest["volume"] = (maxX - minX) * (maxY - minY) * (maxZ - minZ);
        if (!matrixMap.get(basename))
            interest["reuseTimes"] = 0;
        else
            interest["reuseTimes"] = Object.keys(matrixMap.get(basename)).length;
        interestTable[basename] = interest;
    });

    fsExtra.writeFileSync(resultsPath + "interestTable.json", JSON.stringify(interestTable));
    console.log("generate interest table done!!!");
}


// mergeMatrix(matrixPath, resultsPath);
function mergeMatrix(path1, path2) {
    let string = '';
    let files = fs.readdirSync(path1);
    files.forEach(function (item) {
        console.log('processing matrix ' + item);
        string += fs.readFileSync(path1 + item);
    });

    fs.writeFileSync(path2 + 'out.mtx', string);
    console.log('process matrix finished');
}
