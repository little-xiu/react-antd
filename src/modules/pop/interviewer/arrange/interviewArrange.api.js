import { postJson } from '../../../../commonComponents/fetchJson.js';
export const addAudition = async (data, callback, options) => {
  const url = '/rcrt/addAudition';
  const rs = await postJson(url, data, callback, options);
  return rs;
};

export const updateAudition = async (data, callback, options) => {
  const url = '/rcrt/updateAudition';
  const rs = await postJson(url, data, callback, options);
  return rs;
};