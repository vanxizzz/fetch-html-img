# fetch-html-img

## 文档锚链接
##### [1. 该库用来干什么？](#oo)
##### [2. 配置描述](#bb)
##### [3. Installation安装](#cc)
##### [4. Usage使用案例](#dd)

## <span id=oo>1. 该库用来干什么？</span>
##### 通过html文本抓取图片

## <span id=bb>2. 配置描述</span>
##### 主配置
| 参数名 | 数据类型 |  必填|默认值  |简单描述 |举例|
| :----:| :----:   | :----:  | :----: |  :----: |:----: |
| htmlStr | String|是🐢 |   | 页面的html文本 |\<html>...\</html>|
| selector | String|是🐢 |   | 目标图片的css选择器 |".wrapper img"|
| saveDir | String|是🐢 |   | 保存图片的目录，需要传绝对路径 |path.resolve(__dirname , "./imgDir")|
| setImgName | Function|否⭕ |  默认是随机10个字符 | 设置生成的图片名称模板 |函数返回值就是生成的图片名称|
| host | String|否⭕ |   | 抓取网站的域名(为了防止有些图片没有域名的情况) |"https://baidu.com"|
| imgNum | Number|否⭕ | 9999 | 抓取的图片数量||
| sortRandom | Boolean|否⭕ | false | 是否乱序抓取页面上的图片 |

## <span id=cc>3. Installation安装</span>
```js
npm install fetch-html-img
或者
yarn add fetch-html-img
```

## <span id=dd>4. Usage使用案例</span>
##### 1.安装库
```js
npm install fetch-html-img
或者
yarn add fetch-html-img
```
##### 2.创建data.html文件，并把目标页面的html文本拷贝至data.html
##### 3.创建fetchImg.js文件
```js
const fs = require("fs");
const fetchImg = require("fetch-html-img")
const path = require("path")
let res =  fs.readFileSync(path.resolve("./data.html"));
res = res.toString("utf-8");
fetchImg({
    htmlStr: res,//html文本
    selector: ".imgitem .main_img",
    saveDir: path.resolve(__dirname, "./qq"),
    imgNum: 5,
    sortRandom: false,
    setImgName: function(imgUrl , index){
        /* imgUrl是请求的图片名，如：http://xxx/aaa.jpg
            index是图片索引
        */
        let targetImgName = `${index}-${Math.random().toString(16).substr(2, 5)}${Math.random().toString(16).substr(2, 5)}`;
        let ext = path.extname(imgUrl);
        if (!ext) {
            ext = ".jpg"
        }
        targetImgName = `${targetImgName}${ext}`;
        return targetImgName;
    }
});

```
##### 3.通过nodejs运行fetchImg.js文件（控制台输出：抓取结束才算结束）
```js
node fetchImg.js
```


