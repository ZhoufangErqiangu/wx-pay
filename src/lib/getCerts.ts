import { writeFileSync } from "fs";
import { join } from "path";
import { WxPay } from ".";

export interface Cert {
  serial_no: string;
  effective_time: string;
  expire_time: string;
  encrypt_certificate: {
    algorithm: string;
    nonce: string;
    associated_data: string;
    ciphertext: string;
  };
}

export interface GetCertsRes {
  data: Cert[];
}

/**
 * 获取平台证书列表
 * 
 * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/wechatpay5_1.shtml
 */
export async function getCerts(this: WxPay): Promise<void> {
  const { status, data } = await this.request<GetCertsRes>({
    url: "/v3/certificates",
    method: "get",
  });
  if (status !== 200) throw new Error(`获取证书错误 失败 ${status}`);
  const now = Date.now();
  for (const cert of data.data) {
    const expire = new Date(cert.expire_time).getTime();
    if (now > expire) continue;
    const r = cert.encrypt_certificate;
    const content = this.decrypto(r.nonce, r.ciphertext, r.associated_data);
    const path = join(this.publicKeyDir, `${cert.serial_no}.key`);
    writeFileSync(path, content);
  }
}
