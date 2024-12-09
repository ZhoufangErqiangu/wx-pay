import {
  NotifyTransactionBody,
  NotifyTransactionHeaders,
  RefundStatus,
} from ".";
import { WxPay } from "../..";

export interface NotifyTransactionRefund {
  /**
   * 商户号
   */
  mchid: string;
  /**
   * 商户订单号
   */
  out_trade_no: string;
  /**
   * 微信支付订单号
   */
  transaction_id: string;
  /**
   * 商户退款单号
   */
  out_refund_no: string;
  /**
   * 微信退款单号
   */
  refund_id: string;
  /**
   * 退款状态
   */
  refund_status: RefundStatus;
  /**
   * 退款成功时间
   */
  success_time?: string;
  /**
   * 退款入账账户
   */
  user_received_account: string;
  /**
   * 金额信息
   */
  amount: {
    /**
     * 订单金额
     */
    total: number;
    /**
     * 退款金额
     */
    refund: number;
    /**
     * 用户支付金额
     */
    payer_total: number;
    /**
     * 用户退款金额
     */
    payer_refund: number;
  };
}

/**
 * 退款结果通知
 *
 * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_11.shtml
 */
export type NotifyRefundHandler = (
  headers: NotifyTransactionHeaders,
  body: NotifyTransactionBody,
) => void | NotifyTransactionRefund;

export function notifyTransactionRefundBuilder(
  this: WxPay,
): NotifyRefundHandler {
  return (headers: NotifyTransactionHeaders, body: NotifyTransactionBody) => {
    const {
      "wechatpay-timestamp": time,
      "wechatpay-nonce": nonceStr,
      "wechatpay-signature": signature,
    } = headers;
    const c = this.checkSignature(time, nonceStr, body, signature);
    if (!c) return;
    const r = body.resource;
    const d = this.decrypto(r.nonce, r.ciphertext, r.associated_data ?? "");
    return JSON.parse(d) as NotifyTransactionRefund;
  };
}
