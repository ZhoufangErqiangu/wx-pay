import { constants, createSign } from "crypto";
import { WxPay } from "..";

export function sign(this: WxPay, content: string) {
  const c = createSign("RSA-SHA256");
  c.update(content);
  return c.sign(
    {
      key: this.privateKey,
      padding: constants.RSA_PKCS1_PADDING,
    },
    "base64",
  );
}
