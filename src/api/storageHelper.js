const UMID = 'UMID';
const DYNAMIC_COL = 'DYNAMIC_COL';
const INTERVIEW_DATA = 'INTERVIEW_DATA';
const BOOK_ROOM = 'BOOK_ROOM';
const LOGIN_STATUS_TIME = 'LOGIN_STATUS_TIME';
const REFRESH_BROWSER = 'REFRESH_BROWSER';
const storageHelper = {
    // 登录用户um
    getUmid() {
        return sessionStorage.getItem(UMID);
    },
    setUmid(data) {
        sessionStorage.setItem(UMID, data);
    },
    removeUmid() {
        sessionStorage.removeItem(UMID);
    },
    // 表格动态列
    getDynamicCal(key) {
        return localStorage.getItem(`${DYNAMIC_COL}${key}_${this.getUmid}`);
    },
    // 记录登录状态刷新时间
    getLoginStatusTime() {
        return sessionStorage.getItem(LOGIN_STATUS_TIME);
    },
    setLoginStatusTime(time) {
        sessionStorage.setItem(LOGIN_STATUS_TIME, time);
    },
    // 刷新浏览器标示Y
    setRefreshFlag(flag) {
        if (flag) {
            sessionStorage.setItem(REFRESH_BROWSER, JSON.stringify(flag));
        } else {
            sessionStorage.removeItem(REFRESH_BROWSER);
        }
    },
} 
export default storageHelper;