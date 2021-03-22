const { default: axios } = require("axios")
const fsPromise = require("fs").promises;
const path = require("path");
const pAll = require("p-all");
const cheerio = require("cheerio");
const initConfig = require("./initConfig")
const url = require("url");
require("colors");
module.exports = async function fetchImg(config) {
    try {
        console.log("==========================")
        let tempTime = Date.now();
        console.log("开始抓取...".bgRed)
        initConfig(config);
        let { htmlStr, targetAttr, selector, setImgName, host, saveDir, imgNum, sortRandom } = config;
        let hostObj;
        if (host) {
            hostObj = url.parse(host);
            let port = hostObj.port ? hostObj.port : (hostObj.protocol === "http:" ? "80" : "443")
            host = `${hostObj.protocol}//${hostObj.host}:${port}`
        }
        try {
            await fsPromise.stat(saveDir);
        } catch (error) {
            /* 走到这，说明该目录不存在 */
            await fsPromise.mkdir(saveDir);
        }
        const $ = cheerio.load(htmlStr);
        /* 图片路径数组 */
        let imgSrcs = $(selector).map((index, ele) => {
            return $(ele).attr(targetAttr)
        }).get();
        /* 过滤出不是http和https协议的 */
        imgSrcs = imgSrcs.filter(it => /http:\/\/.|https:\/\/.|^\/[^/]*|^\/\/./.test(it));
        imgSrcs = imgSrcs.map(it => {
            if (it.substr(0, 2) === "//") {
                return `${hostObj.protocol}${it}`
            } else if (it.substr(0, 1) === "/") {
                return `${host}${it}`;
            } else {
                return it;
            }
        })
        /* 查找多少个 */
        if (sortRandom) {
            imgSrcs.sort(it => Math.random() - 0.5).sort(it => Math.random() - 0.5);
        }
        imgSrcs = imgSrcs.filter((val, i) => i < imgNum);
        imgSrcs = imgSrcs.map((it, index) => {
            return () => (async () => {
                let res = await axios.get(it, { responseType: "arraybuffer", timeout: 30000 })
                let targetImgName = setImgName(it, index);
                console.log(`成功抓取第${String(index + 1).green}张图片${it}，路径：${path.resolve(saveDir, targetImgName).green}`);
                return { data: res, imgName: targetImgName };
            })();
        })
        let responses = await pAll(imgSrcs);
        let imgDatas = responses.map(({ data, imgName }) => {
            let targetUrl = path.resolve(saveDir, imgName);
            return () => fsPromise.writeFile(targetUrl, data, "binary");
        });
        await pAll(imgDatas);
        tempTime = (Date.now() - tempTime) / 1000;
        console.log("抓取结束");
        console.log(`${"耗时".green}：${tempTime}秒`)
        console.log("==========================")

    } catch (error) {
        console.log("发生错误")
        console.log(error);
    }
}
