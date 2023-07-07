import { TradeState, TradeType } from ".";
import { WxPay } from "..";

export interface QueryOrderRes {
  appid: string;
  mchid: string;
  out_trade_no: string;
  transaction_id?: string;
  trade_type?: TradeType;
  trade_state: TradeState;
  trade_state_desc: string;
  bank_type?: string;
  attach?: string;
  success_time?: string;
  payer: {
    openid: string;
  };
  amount?: {
    total?: number;
    payer_total?: number;
    currency?: string;
    payer_currency?: string;
  };
  scene_info?: {
    device_id?: string;
  };
  promotion_detail?: {
    coupon_id: string;
    name?: string;
    scope?: string;
    type?: string;
    amount: number;
    stock_id?: string;
    wechatpay_contribute?: number;
    merchant_contribute?: number;
    other_contribute?: number;
    currency?: string;
    goods_detail?: {
      goods_id: string;
      quantity: number;
      unit_price: number;
      discount_amount: number;
      goods_remark?: string;
    }[];
  }[];
}

/**
 * 查询订单
 * 
 * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_2.shtml
 */
export function queryTransaction(this: WxPay, id: string) {
  return this.request<QueryOrderRes>({
    url: `/v3/pay/transactions/out-trade-no/${id}`,
    method: "get",
    params: {
      mchid: this.mchId,
    },
  });
}
