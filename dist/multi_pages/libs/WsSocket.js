class WsSocket {
  constructor({url,onMessage,onOpen,onClose,onError,reconnectNum=5,delay=3000}) {
    console.log('ws url',url);
    this.wsst = null;
    this.url = url;
    this.onMessage = onMessage;
    this.onOpen = onOpen;
    this.onClose = onClose;
    this.onError = onError;
    // 重连
    this.reconnectNum = reconnectNum; // 最大重连次数
    this.delay = delay; // 重连间隔时间
    this._reConnectLock = false;
    this._timer = null;
    this._recnum = 0;
  }
  // 创建连接
  connect() {
    // 本地测试使用 ws协议 ,正式上线使用 wss 协议
    this.wsst = new WebSocket(this.url);

    if(!this.wsst) {
      return;
    }

    this.wsst.onopen = (res)=>{
      console.log('ws onOpen',res);
      if (this.onOpen instanceof Function) {
        this.onOpen(res);
      }
      this._clearReconnect();
    };
    this.wsst.onerror = (res)=>{
      console.log('ws onError',res);
      if (this.onError instanceof Function) {
        this.onError(res);
      }
    };
    this.wsst.onmessage = (res)=>{
      if(this.onMessage instanceof Function) {
        this.onMessage(res.data);
      }
    };
    this.wsst.onclose = (res)=>{
      console.log('ws onClose',res);
      if (this.onClose instanceof Function) {
        this.onClose(res);
      }

      if (res.code !== 1000) {
        this._reconnect()
      }
    };
  }
  // 发送内容：{消息内容，回调函数}
  send(msg, call) {
    if (this.wsst && this.wsst.readyState == this.wsst.OPEN) {
      this.wsst.send({
        data: msg,
        success: () => {
          if(call instanceof Function) {
            call('success');
          }
        }
      });
    } else {
      if(call instanceof Function) {
        call('error');
      }
    }
  }
  // 关闭连接
  close() {
    if(this.wsst) {
      this.wsst.close();
      console.log('call ws close');

      this._clearReconnect();
    }
  }
  // 重连
  _reconnect() {
    if(this._reConnectLock) {
      return;
    }
    this._reConnectLock = true;

    if(this._recnum < this.reconnectNum) {
      this._recnum++;
    }
    else {
      this._clearReconnect();
      return;
    }

    this._timer = setTimeout(() => {
      this.connect();
      this._reConnectLock = false;
    }, this.delay);
  }
  // 清除重连
  _clearReconnect() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    this._reConnectLock = false;
    this._recnum = 0;
  }
}