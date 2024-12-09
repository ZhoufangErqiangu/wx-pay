import { verify } from "crypto";
import { WxPay } from "..";

export function checkSignature(
  this: WxPay,
  time: string,
  nonceStr: string,
  body: unknown,
  signature: string,
) {
  const publicKey = this.wxPayPublicKey;
  const data = JSON.stringify(body);
  const v = Buffer.from(`${time}\n${nonceStr}\n${data}\n`);
  const s = Buffer.from(signature, "base64");
  return verify("sha256", v, publicKey, s);
}
