# wx-pay

与微信支付交互.

遵照低耦合高内聚的设计思想, 尽可能地减少外部依赖, 并且不具有缓存等有副作用的功能.

> 微信支付调整了通知签名的方式
>
> 只有老商户使用平台证书验证签名, 请使用 v0.1.1
>
> 新商户使用微信支付公钥验证签名

## 证书与密钥

微信支付为了确保安全, 具有复杂的加密验签解密过程

- 商户 API 证书, 通常为 `apiclient_cert.p12` 和 `apiclient_cert.pem`
  - `apiclient_cert.p12` 的密码为商户号, 其中记录了证书序列号等信息
- 商户 API 私钥, 通常为 `apiclient_key.pem`
- 微信支付公钥, 单独申请的密钥
- APIv3 密钥, 单独设置的解密密钥

> https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay3_0.shtml
>
> https://pay.weixin.qq.com/docs/merchant/products/platform-certificate/wxp-pub-key-guide.html#%E8%8E%B7%E5%8F%96%E5%BE%AE%E4%BF%A1%E6%94%AF%E4%BB%98%E5%85%AC%E9%92%A5

常规的流程如下

1. 商户使用 **商户 API 私钥** 对请求进行签名
2. 将请求和签名发送到微信支付进行业务流程
3. 微信支付向回调地址发送通知和通知签名
4. 商户使用 **微信支付公钥** 验证通知签名
5. 商户使用 **APIv3 密钥** 解密通知

## 范例

```typescript
import { WxPay } from "@liuhlightning/wx-pay";
import {
  NotifyTransactionHeaders,
  PostOrderData,
} from "@liuhlightning/wx-pay/dist/lib/transaction";
import { Request, Response } from "express";

const wxPay = new WxPay({
  appId: "微信支付绑定的appid",
  apiv3Key: "APIv3密钥",
  mchId: "商户号",
  notifyUrl: "回调地址",
  wxPayPublicKeyPath: "微信支付公钥的文件路径",
  privateKeyPath: "商户API私钥的文件路径",
  certSerial: "商户API证书序列号",
  debug: process.env.NODE_ENV !== "production",
});

// 发起支付
export async function postPay() {
  const data: PostOrderData = {
    description: "支付描述",
    out_trade_no: "商户系统中的订单号",
    amount: {
      // 支付金额
      total: 0.01,
      currency: "CNY",
    },
  };

  // 支付
  const { status, data: pd } = await wxPay.postTransactionNative(data);
  if (status !== 200) {
    throw new Error(`微信支付请求错误 ${status}`);
  }
  return pd;
}

// 支付通知
export async function postNotifyy(req: Request, res: Response) {
  // 验证签名并解密数据
  const n = wxPay.notifyTransaction(
    req.headers as unknown as NotifyTransactionHeaders,
    req.body,
  );
  if (!n) {
    // 验证签名失败
    res.status(401).send({
      code: "FAIL",
      message: "签名错误",
    });
  } else {
    // 在这里进行业务处理

    res.sendStatus(204);
  }
}
```
