const { default: axios } = require("axios")
const fsPromise = require("fs").promises;
const path = require("path");
const pAll = require("p-all");
const cheerio = require("cheerio");
const initConfig = require("./initConfig")
module.exports = async function fetchImg(config) {
    console.log("==========================")
    console.log("开始抓取...")
    initConfig(config);
    let { htmlStr, targetAttr, selector, setImgName, saveDir, imgNum, sortRandom } = config;
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

    imgSrcs = imgSrcs.filter(it => /http:\/\/.|https:\/\/./.test(it));
    /* 查找多少个 */
    if (sortRandom) {
        imgSrcs.sort(it => Math.random() - 0.5).sort(it => Math.random() - 0.5);
    }
    imgSrcs = imgSrcs.filter((val, i) => i < imgNum);
    imgSrcs = imgSrcs.map(it => {
        return () => axios.get(it, { responseType: "arraybuffer", timeout: 30000 });
    })
    let responses = await pAll(imgSrcs);
    let imgDatas = responses.map((it, index) => {
        let targetImgName = setImgName(it.config.url, index);
        let targetUrl = path.resolve(saveDir, targetImgName);
        return () => fsPromise.writeFile(targetUrl, it.data, "binary");
    });
    await pAll(imgDatas);
    console.log("抓取结束");
    console.log("==========================")
}
