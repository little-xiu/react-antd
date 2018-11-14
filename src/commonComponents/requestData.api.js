import {postJson} from './fetchJson';
import Config from '../api/constants';
const URL = {
    // 导出
    ExportInterviewArrange: `${Config.hostServer}/rccp/ats/downloadInterview?interviewRound=`,
    //校验场次的合理性
    queryTempByInfo: '/rccp/ats/',
}

export const ExportInterviewArrange = URL.ExportInterviewArrange;

export const queryTempByInfo = async (data, errCb) => {
    const res = await postJson(URL.queryTempByInfo, data, errCb);
    return res;
}