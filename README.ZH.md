# wx-pay

与微信支付交互.

遵照低耦合高内聚的设计思想, 尽可能地减少外部依赖, 并且不具有缓存等有副作用的功能.

## 证书与密钥

微信支付为了确保安全, 具有复杂的加密验签解密过程

* 商户API证书, 通常为apiclient_cert.p12和apiclient_cert.pem. apiclient_cert.p12的密码为商户号, 其中记录了证书序列号等信息
* 商户API私钥, 通常为apiclient_key.pem
* 平台证书, 通过api下载, 第一次下载时需要使用 `https://github.com/wechatpay-apiv3/CertificateDownloader`
* 平台公钥, 从平台证书生成
* APIv3密钥, 单独设置的解密密钥

> https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay3_0.shtml

常规的流程如下

1. 商户使用`商户API私钥`对请求进行签名
2. 发送请求和签名到平台
3. 平台发送支付通知到商户, 请求中会指定`平台证书`序列号
4. 商户使用`平台证书`验证签名
5. 商户使用`APIv3密钥`解密请求
