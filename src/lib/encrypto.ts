import { constants, publicEncrypt } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";
import { WxPay } from ".";

export function encrypto(
  this: WxPay,
  /**
   * 这是微信通知时发的证书序列号, 不是配置输入的
   */
  wxPayCertSerial: string,
  message: string,
) {
  const publicKeyPath = join(this.wxPayCertDir, `${wxPayCertSerial}.pem`);
  const publicKey = readFileSync(publicKeyPath, "utf-8");
  const c = publicEncrypt(
    {
      key: publicKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(message, "utf-8"),
  );
  return c.toString("base64");
}
