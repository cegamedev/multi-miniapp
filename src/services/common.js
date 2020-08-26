import Http from '@/common/http';


export const commonInfoService = params => Http.send('get', '/common/info', params);

