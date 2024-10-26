# wx-pay

Interact with WeChat Pay.

Designed following principles of low coupling and high cohesion, minimizing external dependencies and avoiding features with side effects, such as caching.

> WeChat Pay has adjusted the way notification signatures are verified.
>
> Only legacy merchants should use platform certificates for signature verification. Please use version v0.1.1.
>
> New merchants should use WeChat Pay public keys for signature verification.

## Certificates and Keys

WeChat Pay implements a complex encryption, signing, and decryption process to ensure security.

- Merchant API Certificate, usually in the form of `apiclient_cert.p12` and `apiclient_cert.pem`.
  - The password for `apiclient_cert.p12` is the merchant ID, and it contains certificate serial number details.
- Merchant API Private Key, usually in the form of `apiclient_key.pem`.
- WeChat Pay Public Key, a separately requested key.
- APIv3 Key, a separately set decryption key.

> https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay3_0.shtml
>
> https://pay.weixin.qq.com/docs/merchant/products/platform-certificate/wxp-pub-key-guide.html#%E8%8E%B7%E5%8F%96%E5%BE%AE%E4%BF%A1%E6%94%AF%E4%BB%98%E5%85%AC%E9%92%A5

The general process is as follows:

1. The merchant uses the **Merchant API Private Key** to sign the request.
2. The signed request is sent to WeChat Pay for processing.
3. WeChat Pay sends a notification and a notification signature to the callback URL.
4. The merchant uses the **WeChat Pay Public Key** to verify the notification signature.
5. The merchant decrypts the notification using the **APIv3 Key**.

## 范例

```typescript
import { WxPay } from "@liuhlightning/wx-pay";
import {
  NotifyTransactionHeaders,
  PostOrderData,
} from "@liuhlightning/wx-pay/dist/lib/transaction";
import { Request, Response } from "express";

const wxPay = new WxPay({
  appId: "The appid associated with WeChat Pay",
  apiv3Key: "APIv3 key",
  mchId: "Merchant ID",
  notifyUrl: "Callback URL",
  wxPayPublicKeyPath: "File path to the WeChat Pay public key",
  privateKeyPath: "File path to the Merchant API private key",
  certSerial: "Merchant API certificate serial number",
  debug: process.env.NODE_ENV !== "production",
});

// Initiating a Payment
export async function postPay() {
  const data: PostOrderData = {
    description: "Payment description",
    out_trade_no: "Order number in merchant's system",
    amount: {
      // Payment amount
      total: 0.01,
      currency: "CNY",
    },
  };

  // Initiate payment
  const { status, data: pd } = await wxPay.postTransactionNative(data);
  if (status !== 200) {
    throw new Error(`WeChat Pay request error ${status}`);
  }
  return pd;
}

// Payment Notification
export async function postNotify(req: Request, res: Response) {
  // Verify signature and decrypt data
  const n = wxPay.notifyTransaction(
    req.headers as unknown as NotifyTransactionHeaders,
    req.body,
  );
  if (!n) {
    // Signature verification failed
    res.status(401).send({
      code: "FAIL",
      message: "Signature error",
    });
  } else {
    // Handle business logic here

    res.sendStatus(204);
  }
}
```
