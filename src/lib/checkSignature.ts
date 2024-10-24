import { verify } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";
import { WxPay } from ".";

export function checkSignature(
  this: WxPay,
  /**
   * 这是微信通知时发的证书序列号, 不是配置输入的
   */
  certSerial: string,
  time: string,
  nonceStr: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
  signature: string,
) {
  const publicKeyPath = join(this.publicKeyDir, `${certSerial}.pem`);
  const publicKey = readFileSync(publicKeyPath, "utf-8");
  const data = JSON.stringify(body);
  const v = Buffer.from(`${time}\n${nonceStr}\n${data}\n`);
  const s = Buffer.from(signature, "base64");
  return verify("sha256", v, publicKey, s);
}
