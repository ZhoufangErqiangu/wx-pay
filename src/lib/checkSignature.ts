import { verify } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";
import { WxPay } from ".";

export function checkSignature(
  this: WxPay,
  /**
   * 这是微信通知时发的证书序列号, 不是配置输入的
   */
  wxPayCertSerial: string,
  time: string,
  nonceStr: string,
  body: unknown,
  signature: string,
) {
  const publicKeyPath = join(this.wxPayCertDir, `${wxPayCertSerial}.pem`);
  const publicKey = readFileSync(publicKeyPath, "utf-8");
  const data = JSON.stringify(body);
  const v = Buffer.from(`${time}\n${nonceStr}\n${data}\n`);
  const s = Buffer.from(signature, "base64");
  return verify("sha256", v, publicKey, s);
}
