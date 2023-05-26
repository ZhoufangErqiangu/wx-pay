import { WxPay } from "..";

/**
 * 关闭订单
 * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_3.shtml
 */
export function closeTransaction(this: WxPay, id: string) {
  return this.request<never>({
    url: `/v3/pay/transactions/out-trade-no/${id}/close`,
  });
}
