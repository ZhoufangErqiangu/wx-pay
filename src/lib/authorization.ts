import { WxPay } from "..";
import { paramsToString } from "../util/paramsToString";

/**
 * 构建鉴权字符串
 * @param url 请求地址
 * @param method 请求方法
 * @param query 请求参数
 * @param timestamp 时间戳
 * @param nonceStr 随机字符串
 * @param data 请求数据
 * @param headers 附加请求头
 * @returns 鉴权字符串
 */
export function buildAuthotization(
  this: WxPay,
  url: string,
  method: string,
  query: Record<string, string> | null | undefined,
  timestamp: string,
  nonceStr: string,
  data?: unknown,
): string {
  // method
  const m = method.toUpperCase();

  // url
  let u: string;
  if (query && Object.keys(query).length > 0) {
    u = `${url}?${paramsToString(query)}`;
  } else {
    u = url;
  }

  // body
  const b = m === "GET" ? "" : JSON.stringify(data);

  // signature
  const s = `${m}\n${u}\n${timestamp}\n${nonceStr}\n${b}\n`;
  const ss = this.sign(s);
  return `WECHATPAY2-SHA256-RSA2048 mchid="${this.mchId}",nonce_str="${nonceStr}",signature="${ss}",timestamp="${timestamp}",serial_no="${this.certSerial}"`;
}
