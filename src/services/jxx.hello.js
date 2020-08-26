import Http from '@/common/http';

export const helloInfoService = params => Http.send('get', '/hello/info', params);