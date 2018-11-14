import _ from 'lodash';
import moment from 'moment';
import URL from 'url';
import querystring from 'querystring';
import { formatUrl, } from '@common/utils/fetchJson.js';
import constants from '../constants';

// 是否开发模式下
const isDevMode = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev';
export default {
    //获取页面参数，如http://test.html?a=1&b=2  则返回： { a: 1, b: 2 }
    getUrlParams(url) {//使用： const urlParams = utils.getUrlParams(this.props.location.search);
        return URL.parse(url, true).query;// 路由跳转通过search传值
    },

    //拼接URL参数，可将{name: 'a', obj: {t: 1}} 转成 name=a&obj=[stringify]
    setUrlParams(params) {
        const urlQuery = Object.entries(params).reduce((obj, [key, value]) => {
            const val = value && typeof value === 'object' ? JSON.stringify(value) : value;
            return {...obj, [key]: val};
        }, {});
        return querystring.stringify(urlQuery);
    },
    //判断是否是 IE
    isIE() {
        return !! window.ActiveXObject || 'ActiveXObject' in window;
    },
    //检查邮箱是否正确
    validateEmail(val) {
        const emailReg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
        return emailReg.test(val && val.toLowerCase());
    },
    //检查身份证号码是否正确
    validateIDCard(val) {
        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return reg.test(val);
    },
    //格式化DatePicker值为yyyy-MM-dd
    formatDate2yyyyMMdd(date) {
        if (!date) {
            return '';
        }
        return moment(date).format('YYYY-MM-DD');
    },
    //格式化DatePicker值为yyyy-MM
    formatDate2yyyyMM(date) {
        if (!date) {
            return '';
        }
        return moment(date).format('YYYY-MM');
    },
    //将时间对象转换为字符串，没有秒钟
    formatDateWithoutSecond(date) {
        if (!date) {
            return '';
        }
        return moment(date).format('YYYY-MM-DD HH:mm');
    },
    //获取时间间隔  多少天
    GetDateDiff(startDate, endDate) {
        const dates = Math.abs((startDate - endDate)) / (1000 * 60 * 60 * 24);
        return dates;
    },
    //统计字符串中的中文个数
    countChineseChar(text) {
        let sum = 0;
        const re = /[\u4E00-\u9FA5]/g; //测试中文字符的正则
        if (text) {
            if (re.test(text)) {
                sum = text.match(re).length;// 匹配存在则返回数组
            }
        }
        return sum;
    },
    //将文本域中的内容转换为html格式
    txtToHtml(txt) {
        if (!txt) {
            return '';
        }
        let txtVal = '';
        txtVal = txt.replace(/ /g, '&nbsp;');
        txtVal = txtVal.replace(/\r\n/g, '<br />');
        txtVal = txtVal.replace(/\n/g, '<br />');
        return txtVal;
    },
    //将html内容的格式转换成 文本域显示
    htmlToTxt(txt) {
        if (!txt) {
            return '';
        }
        let txtVal = '';
        txtVal = txt.replace(/&nbsp;/g, ' ');
        txtVal = txtVal.replace(/<br \/>/g, '\n');
        txtVal = txtVal.replace(/<br>/g, '\n');
        return txtVal;
    },
    //去除对象的字符串前后空格
    trimObjValue(formValues) {
        return _.mapValues(formValues, (v) => {
            if (_.isString(v)) {
                return _.trim(v);
            }
            return v;
        });
    },
    //移除class
    removeClass(ele, cls) {
        let eleClass = `${ele.className}`;
        eleClass = eleClass.replace(/(\s+)/gi, ' ');
        let removed = eleClass.replace(`${cls}`, ' ');
        removed = removed.replace(/(^\s+)|(\s+$)/g, '');
        ele.className = removed;
    },
    //增加class
    addClass(ele, cls) {
        const eleClass = ele.className;
        const blank = (eleClass !== '') ? ' ' : '';
        const added = eleClass + blank + cls;
        ele.className = added;
    },
    //阿拉伯数字转 中文数字
    numberToChn(num) {
        const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        const chnUnitSection = ['', '万', '亿', '万亿', '亿亿'];
        const chnUnitChar = ['', '十', '百', '千'];
        function SectionToChinese(section) {
            let strIns = '';
            let chnStr = '';
            let unitPos = 0;
            let zero = true;
            while (section > 0) {
                const v = section % 10;
                if (v === 0) {
                    if (!zero) {
                        zero = true;
                        chnStr = chnNumChar[v] + chnStr;
                    }
                } else {
                    zero = false;
                    strIns = chnNumChar[v];
                    strIns += chnUnitChar[unitPos];
                    chnStr = strIns + chnStr;
                }
                unitPos++;
                section = Math.floor(section / 10);
            }
            return chnStr;
        }
        let unitPos = 0;
        let strIns = '';
        let chnStr = '';
        let needZero = false;
        if (num === 0) {
            return chnNumChar[0];
        }
        while (num > 0) {
            const section = num % 10000;
            if (needZero) {
                chnStr = chnNumChar[0] + chnStr;
            }
            strIns = SectionToChinese(section);
            strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
            chnStr = strIns + chnStr;
            needZero = (section < 1000) && (section > 0);
            num = Math.floor(num / 10000);
            unitPos ++;
        }
        if (/^——十/.test(chnStr)) {
            chnStr = chnStr.substr(1);
        }
        return chnStr;
    },
    //数组元素调换位置
    arrSwitchIndex(arr, firstIndex, secondIndex) {
        const newArr = [...arr];
        const firstObj = newArr[firstIndex];
        const secondObj = newArr[secondIndex];
        newArr[firstIndex] = secondObj;
        newArr[secondIndex] = firstObj;
        return newArr;
    },
    //判断是否是 IE浏览器
    idIEBr() {
        const userAgent = navigator.userAgent;
        const isOpera = userAgent.indexOf('Opera') > -1;
        let isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera;
        if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            isIE = true;
        }
        if (isIE) {
            return '1';
        } else {
            return '-1';
        }
    },
    //关闭网页， 兼容非弹出页面
    closeWin() {
        if (navigator.userAgent.indexOf('Firefox') !== -1 || navigator.userAgent.indexOf('Chrome') !== -1) {
            window.location.href = 'about:blank';
            window.close();
        } else {
            window.opener = null;
            window.open('', '_self');
            window.close();
        }
    },
    //数组去重
    getDistinctArray(arr, key) {
        const hash = {};
        let newArr = [];
        if (key) {
            newArr = arr && arr.reduce((item, next) => {
                hash[next.key] ? '' : hash[next.key] = true && item.push(next);
                return item;
            }, []);
        } else {
            newArr = arr && arr.reduce((item, next) => {
                hash[next] ? '' : hash[next] = true && item.push(next);
                return item;
            }, []);
        }
        return newArr;
    },
    downloadImg(imgSrc, imgName = '二维码') {
        if (this.isIEBr() === '1') {
            const ablob = this.base64Img2Blob(imgSrc);
            window.navigator.msSaveBlob(ablob, `${imgName}.jpg`);
            return;
        }
        const blob = new Blob([''], {
            type: 'application/octet-stream',
        });
        const windowURL = window.URL || window.webkitURL;
        const url = windowURL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = imgSrc;
        a.download = imgName;
        const e = document.createEvent('MouseEvents');
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
        windowURL.revokeObjectURL(url);
    },
    base64Img2Blob(base64Date) {
        const format = 'image/jpeg';
        const base64 = base64Date;
        const code = window.atob(base64.split(',')[1]);
        const aBuffer = new window.ArrayBuffer(code.length);
        const uBuffer = new window.Uint8Array(aBuffer);
        for (let i = 0; i < code.length; i++) {
            uBuffer[i] = code.charCodeAt(i) & 0xff;
        }
        let blob = null;
        try {
            blob = new Blob([uBuffer], {
                type: format,
            });
        } catch (e) {
            window.BlobBuilder = Window.BlobBuilder || 
                window.WebkitBlobBuilder ||
                window.MozBlobBuilder || 
                window.MSBlobBuilder;
            if (e.name === 'TypeError' && window.BlobBuilder) {
                const bb = new window.BlobBuilder();
                bb.append(uBuffer.buffer);
                blob = bb.getBlob('image/jpeg');
            } else if (e.name === 'InvalidStateError') {
                blob = new Blob([aBuffer], {
                    type: format,
                });
            }
        }
        return blob;
    },
    formatMoney(value) {
        return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    getAtspath() {
        // 当前是根路径
        const atsPath = '';
        return atsPath;
    }
};