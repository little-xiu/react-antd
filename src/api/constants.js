// 是否开发环境
const dev = process.env.NODE_ENV === 'development';
const Config = {
    hostServer: '',
};
let hostServer = '';
if (dev) {
    hostServer = 'http://EJIC-dj993:8086';
    hostServer = 'https://ats-stg1.pingan.com:10650';
} else {
    hostServer = ``;
}
Config.hostServer = `${hostServer}/zztg-campus-web`;
export default Config;