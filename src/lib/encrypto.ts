import { constants, publicEncrypt } from "crypto";
import { WxPay } from ".";

export function encrypto(this: WxPay, message: string) {
  const c = publicEncrypt(
    {
      key: this.wxPayPublicKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(message, "utf-8"),
  );
  return c.toString("base64");
}
