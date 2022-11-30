import request from '@/utils/request'

// export function getList(params) {
//   return request({
//     url: '/vue-admin-template/table/list',
//     method: 'get',
//     params
//   })

export function fetchList(params) {
  return request({
    url: 'PCWE/GetCheckRecordTbl',
    method: 'post',
    params
  })
}
