import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'api/Login/GetUser?app_key=oSystem&timestamp=2020-12-08%2009:16:24&sign=ABCD&userName=' + data.userName + '&password=' + data.password,
    // url: 'api/Login/GetUser?app_key=oSystem&timestamp=2020-12-08%2009:16:24&sign=ABCD&userName=admin&password=123456',
    method: 'get'
  })
}

export function getInfo(token) {
  return request({
    url: 'api/UserCenter/GetUser?app_key=oSystem&timestamp=2020-12-08%2009:16:24&sign=ABCD&userName=admin&password=123456&UserKey=dDVaQ3dhbWtmUEV1SzVWdk9Rejg1bzhXc0hWQTBMOURQMDdiWmFXOFpmeG54a0x3bmVXbjVaQVVuQlEvOWZjQitSem0xR3lCMFVZK3pSOW1Nb0xwNVE9PQ==',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'api/Login/PostLogout?app_key=oSystem&timestamp=2020-12-08&sign=ABCD',
    method: 'post'
  })
}

export function createArticle(data) {
  return request({
    url: 'api/Register/PostRegisterUser?app_key=oSystem&timestamp=2020-12-08&sign=ABCD',
    method: 'post',
    data
  })
}

export function UserList(data) {
  return request({
    url: 'api/UserCenter/GetUser?app_key=oSystem&timestamp=2020-12-08%2009:16:24&sign=ABCD&UserKey=dDVaQ3dhbWtmUEV1SzVWdk9Rejg1bzhXc0hWQTBMOURQMDdiWmFXOFpmeG54a0x3bmVXbjVaQVVuQlEvOWZjQitSem0xR3lCMFVZK3pSOW1Nb0xwNVE9PQ==',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: 'api/UserCenter/GetUser?app_key=oSystem&timestamp=2020-12-08%2009:16:24&sign=ABCD&userName=admin&password=123456',
    method: 'get',
    data
  })
}
