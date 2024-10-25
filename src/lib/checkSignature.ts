import { verify } from "crypto";
import { readFileSync } from "fs";
import { WxPay } from ".";

export function checkSignature(
  this: WxPay,
  time: string,
  nonceStr: string,
  body: unknown,
  signature: string,
) {
  const publicKey = readFileSync(this.wxPayPublicKey, "utf-8");
  const data = JSON.stringify(body);
  const v = Buffer.from(`${time}\n${nonceStr}\n${data}\n`);
  const s = Buffer.from(signature, "base64");
  return verify("sha256", v, publicKey, s);
}
