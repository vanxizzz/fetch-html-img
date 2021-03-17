const path = require("path");
const obj = {
    htmlStr: {
        type: "string",
        require: true,
    },
    targetAttr: {
        type: "string",
        defaultValue: "src"
    },
    selector: {
        type: "string",
        require: true,
    },
    setImgName: {
        type: "function",
        defaultValue(imgUrl, index) {
            let targetImgName = `${index}-${Math.random().toString(16).substr(2, 5)}${Math.random().toString(16).substr(2, 5)}`;
            let ext = path.extname(imgUrl);
            if (!ext) {
                ext = ".jpg"
            }
            targetImgName = `${targetImgName}${ext}`;
            return targetImgName;
        }
    },
    saveDir: {
        type: "string",
        require: true,
    },
    imgNum: {
        type: "number",
        defaultValue: 9999,
    },
    sortRandom: {
        type: "boolean",
        defaultValue: false,
    }
}


module.exports = (config) => {
    if (!config || typeof config !== "object") {
        throw Error("配置必须是个对象");
    }
    let initConfigKeys = Object.keys(obj);
    for (let configName of initConfigKeys) {
        const { require, defaultValue, type } = obj[configName];
        if (require && config[configName] == null) {
            throw Error(`${configName}参数必传`)
        }
        if (defaultValue && config[configName] == null) {
            config[configName] = defaultValue;
        }
        if (typeof config[configName] !== type) {
            throw Error(`${configName}类型错误`)
        }
    };
}