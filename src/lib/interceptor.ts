import { InternalAxiosRequestConfig } from "axios";
import { WxPay } from ".";

export type RequestInterceptor = (
  req: InternalAxiosRequestConfig,
) => InternalAxiosRequestConfig;

/**
 * 测试用参数, 开发和生产勿使用
 */
export interface RequestInterceptorBuilderParam {
  timestamp: string;
  nonceStr: string;
}

export function requestInterceptorBuilder(
  this: WxPay,
  /**
   * 测试用参数, 开发和生产勿输入
   */
  param?: RequestInterceptorBuilderParam,
): RequestInterceptor {
  return (req: InternalAxiosRequestConfig) => {
    const { method, url, data, params } = req;
    const methodStr = (method ?? "GET").toUpperCase();
    const timestamp = param?.timestamp ?? this.timestamp;
    const nonceStr = param?.nonceStr ?? this.nonceStr;
    let url1 = url ?? "";
    if (params && Object.keys(params).length > 0) {
      url1 += `?${this.paramsToString(params)}`;
    }
    const body = methodStr === "GET" ? "" : JSON.stringify(data);
    const signStr = `${methodStr}\n${url1}\n${timestamp}\n${nonceStr}\n${body}\n`;
    const signature = this.sign(signStr);
    const authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${this.mchId}",nonce_str="${nonceStr}",signature="${signature}",timestamp="${timestamp}",serial_no="${this.certSerial}"`;
    req.headers.set("Authorization", authorization);
    req.headers.set("Wechatpay-Serial", this.certSerial);
    return req;
  };
}
