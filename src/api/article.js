import request from '@/utils/request'

export function createArticle(data) {
  return request({
    url: 'PCWE/AddCheckRecordTbl',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: 'PCWE/UPCheckRecordTbl',
    method: 'post',
    data
  })
}
export function delArticle(data) {
  return request({
    url: 'PCWE/DelCheckRecordTbl',
    method: 'post',
    data
  })
}