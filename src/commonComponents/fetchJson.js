/* eslint-disable */
import 'whatwg-fetch';
import {Modal, message} from 'antd';
import Config from '../api/constants';
import storageHelper from '../api/storageHelper';
import Utils from '../components/utils';
export const formatUrl = (url) => {
    return /https?:\/\//gi.test(url) ? url : `${Config.hostServer}${url}`;
};

const errMsg = {
    msg: '',
    time: 0,
};
const OPTIONS = {
    errMsgModal: false,
    throwError: false,
};
const requestOptions = {
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
    method: 'post',
};
const checkMsgTime = (msg) => {
    const time = new Date().getTime();
    if (errMsg.msg && errMsg.time && errMsg.msg === msg) {
        const sec = time - errMsg.time;
        errMsg.msg = msg;
        errMsg.time = time;
        if (sec < 2000) {// 2s以内相同的消息不提示
            return false;
        }
    }
    errMsg.msg = msg;
    errMsg.time = time;
    return true;
}
const showErrorMsg = (errMsgModal, msg) => {
    if (!checkMsgTime(msg)) {
        return;
    }
    if (errMsgModal) {
        Modal.error({
            title: msg,
        });
        return;
    }
    message.error(msg);
}
const alertLoginOut = {
    time: 0,
}
const keepLoginStatus = () => {
    const loginTime = storageHelper.getLoginStatusTime();
    const diffTime = new Date().getTime() - (loginTime || 0);
    if (diffTime >= 3600000) {
        message.warning('登录已超时');
    }
    postJson('/rccp/ats/login/checkLogin');
}
//登录超时前5分钟提示信息
const freshLoginTime = (responseCode) => {
    clearTimeout(alertLoginOut.time);
    if (responseCode !== 10003 && responseCode !== 10005) {
        storageHelper.setLoginStatusTime(new Date().getTime());
        alertLoginOut.time = setInterval(() => {
            const loginTime = storageHelper.getLoginStatusTime();
            const diffTime = new Date().getTime() - (loginTime || 0);
            if (diffTime >= 3300000) {
                const ref = Modal.confirm({
                    title: '离登录超时还有5分钟，需要保持登录吗？',
                    okText: '保持登录',
                    cancelText: '不需要',
                    onOk: () => {
                        keepLoginStatus();
                        ref.destroy();
                    },
                    onCancel: () => {
                        ref.destroy();
                    }
                });
                clearTimeout(alertLoginOut.time);
                // 5分钟后自动登录
                setTimeout(() => {
                    ref.destroy();
                    goToLogin('fresh');
                },325000);
            }
        }, 60000);
    }
}
const goToLogin = (fresh) => {
    storageHelper.setRefreshFlag('Y');
    window.location.href = `${Utils.getAtspath()}/#/login`;
    fresh === 'fresh' && setTimeout(() => {
        window.location.reload();
    });
}
const throwError = (code, msg, data) => {
    const err = new Error('fetchv2.error');
    err.data = {
        code,
        msg,
        data,
    };
    throw err;
}
export const postJson = async (url, data = {}, callback, options) => {
    const newOptions = {...OPTIONS, ...options};
    const newUrl = formatUrl(url);
    const request = {...requestOptions};
    request.body = JSON.stringify(data);
    let response = {};
    try {
        response = await fetch(newUrl, request);
    } catch (error) {
        // 用户应该不需要处理此类错误
        callback && callback();
        showErrorMsg(newOptions.errMsgModal, '网络异常');
        return null;
    }
    callback && callback();
    const {status} = response;
    if (status >= 300) {
        showErrorMsg(newOptions.errMsgModal, '服务异常');
        return null;
    }
    const rs = await response.json();
    rs.responseCode = Number(rs.responseCode);
    setTimeout(() => {
        freshLoginTime(rs.responseCode);
    }, 0);
    if (rs.responseCode === 10001 || rs.responseCode === 10009) {
        return rs;
    } else if (!rs.responseMsg) {
        rs.responseMsg = '系统未知错误';
    }
    switch (rs.responseCode) {
        case 10003:
            // eslint-disable-next-line
            console.log('登录超时', newUrl);
            goToLogin();
            break;
        case 10009:
            console.log('资源不足', newUrl);
            goToLogin();
            break;
        default:
    }
    //用户可能处理此类错误
    if (newOptions.throwError) {
        throwError(12, '接口错误', rs);
    } else {
        showErrorMsg(newOptions.errMsgModal, rs.responseMsg);
    }
    return null;
}