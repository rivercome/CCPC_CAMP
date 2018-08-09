import { API, request } from 'utils'

export async function queryProjectNotice() {
  return request('/api/project/notice');
}
