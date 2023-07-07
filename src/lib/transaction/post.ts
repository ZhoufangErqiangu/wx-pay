import { OrderPayer, PostOrderData } from ".";
import { WxPay } from "..";

export interface PostJSAPIData extends PostOrderData {
  /**
   * 支付者
   */
  payer: OrderPayer;
}
export interface PostJSAPIRes {
  prepay_id: string;
}
/**
 * JSAPI下单 小程序支付也用这个接口
 * 
 * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_1.shtml
 */
export function postTransactionJsApi(this: WxPay, data: PostJSAPIData) {
  return this.request<PostJSAPIRes>({
    url: "/v3/pay/transactions/jsapi",
    method: "post",
    data: {
      appid: this.appId,
      mchid: this.mchId,
      notify_url: "",
      ...data,
    },
  });
}

export interface APPPostOrderRes {
  prepay_id: string;
}
/**
 * APP下单
 * 
 * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_2_1.shtml
 */
export function postTransactionApp(this: WxPay, data: PostOrderData) {
  return this.request<APPPostOrderRes>({
    method: "POST",
    url: "/v3/pay/transactions/app",
    data: {
      appid: this.appId,
      mchid: this.mchId,
      notify_url: "",
      ...data,
    },
  });
}

export interface PostH5Res {
  h5_url: string;
}
/**
 * H5下单
 * 
 * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_3_1.shtml
 */
export function postTransactionH5(this: WxPay, data: PostOrderData) {
  return this.request<PostH5Res>({
    method: "POST",
    url: "/v3/pay/transactions/h5",
    data: {
      appid: this.appId,
      mchid: this.mchId,
      notify_url: "",
      ...data,
    },
  });
}

export interface PostNativeOrderRes {
  code_url: string;
}
/**
 * Native下单
 * 
 * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_1.shtml
 */
export function postTransactionNative(this: WxPay, data: PostOrderData) {
  return this.request<PostNativeOrderRes>({
    method: "POST",
    url: "/v3/pay/transactions/native",
    data: {
      appid: this.appId,
      mchid: this.mchId,
      notify_url: "",
      ...data,
    },
  });
}
