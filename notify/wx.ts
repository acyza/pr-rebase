import { request } from 'https'

type wxResponse = {
  errcode: number,
  errmsg: string
}

const NotifyError = Object.freeze({
  name: 'notify error'
})

export default (msg: string, wxWebhookKey: string) => {
  let resolve: () => void,reject: (err: Error) => void;
  const promise = new Promise<void>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  const clientRequest = request({
    hostname: 'qyapi.weixin.qq.com',
    path: `/cgi-bin/webhook/send?key=${wxWebhookKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }, (res) => {
    res.on('data', (_data) => {
      const data = JSON.parse(_data.toString()) as wxResponse
      if (data.errcode) {
        reject({
          ...NotifyError,
          message: data.errmsg
        })
      }
    })
  })

  clientRequest.on('finish', () => {
    resolve()
  })

  clientRequest.on('error', (err) => {
    reject({
      ...NotifyError,
      message: err.message
    })
  })

  const data = {
    msgtype: 'text',
    text: {
      content: msg
    }
  }

  clientRequest.write(JSON.stringify(data))

  clientRequest.end()
  return promise
}
