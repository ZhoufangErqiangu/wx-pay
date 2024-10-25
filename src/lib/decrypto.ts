import { createDecipheriv, privateDecrypt, constants } from "crypto";
import { WxPay } from ".";

export function decrypto(
  this: WxPay,
  nonce: string,
  ciphertext: string,
  associatedData: string,
) {
  const d = createDecipheriv("aes-256-gcm", this.apiv3Key, nonce);
  const buf = Buffer.from(ciphertext, "base64");
  const authTag = buf.subarray(-16);
  const data = buf.subarray(0, -16);
  d.setAuthTag(authTag);
  d.setAAD(Buffer.from(associatedData));
  const res = d.update(data, undefined, "utf8");
  d.final();
  return res;
}

export function decryptoByPrivateKey(this: WxPay, ciphertext: string) {
  const c = privateDecrypt(
    {
      key: this.privateKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(ciphertext, "base64"),
  );
  return c.toString("utf-8");
}
