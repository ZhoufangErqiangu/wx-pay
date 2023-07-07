import { RefundChannel, RefundStatus } from ".";
import { WxPay } from "..";

export interface RefundTransactionData {
  /**
   * 商户订单号
   */
  out_trade_no: string;
  /**
   * 商户退款单号
   */
  out_refund_no: string;
  /**
   * 退款原因
   */
  reason?: string;
  /**
   * 退款结果回调url
   */
  notify_url?: string;
  /**
   * 退款资金来源
   */
  funds_account?: string;
  /**
   * 金额信息
   */
  amount: {
    /**
     * 退款金额
     */
    refund: number;
    /**
     * 退款出资账户及金额
     */
    from?: {
      /**
       * 出资账户类型
       */
      account: string;
      /**
       * 出资金额
       */
      amount: number;
    }[];
    /**
     * 原订单金额
     */
    total: number;
    /**
     * 退款币种
     */
    currency: string;
  };
  /**
   * 退款商品
   */
  goods_detail?: {
    /**
     * 商户侧商品编码
     */
    merchant_goods_id: string;
    /**
     * 微信支付商品编码
     */
    wechatpay_goods_id?: string;
    /**
     * 商品名称
     */
    goods_name?: string;
    /**
     * 商品单价
     */
    unit_price: number;
    /**
     * 商品退款金额
     */
    refund_amount: number;
    /**
     * 商品退货数量
     */
    refund_quantity: number;
  }[];
}

export interface RefundTransactionRes {
  /**
   * 微信支付退款单号
   */
  refund_id: string;
  /**
   * 商户退款单号
   */
  out_refund_no: string;
  /**
   * 微信支付订单号
   */
  transaction_id: string;
  /**
   * 商户订单号
   */
  out_trade_no: string;
  /**
   * 退款渠道
   */
  channel: RefundChannel;
  /**
   * 退款入账账户
   */
  user_received_account: string;
  /**
   * 退款成功时间
   */
  success_time?: string;
  /**
   * 退款创建时间
   */
  create_time: string;
  /**
   * 退款状态
   */
  status: RefundStatus;
  /**
   * 资金账户
   */
  funds_account?: string;
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
     * 退款出资账户及金额
     */
    from?: {
      /**
       * 出资账户类型
       */
      account: string;
      /**
       * 出资金额
       */
      amount: number;
    }[];
    /**
     * 用户支付金额
     */
    payer_total: number;
    /**
     * 用户退款金额
     */
    payer_refund: number;
    /**
     * 应结退款金额
     */
    settlement_refund: number;
    /**
     * 应结订单金额
     */
    settlement_total: number;
    /**
     * 优惠退款金额
     */
    discount_refund: number;
    /**
     * 退款币种
     */
    currency: string;
    /**
     * 手续费退款金额
     */
    refund_fee?: number;
  };
  /**
   * 优惠退款信息
   */
  promotion_detail: {
    /**
     * 券ID
     */
    promotion_id: string;
    /**
     * 优惠范围
     */
    scope: string;
    /**
     * 优惠类型
     */
    type: string;
    /**
     * 优惠券面额
     */
    amount: number;
    /**
     * 优惠退款金额
     */
    refund_amount: number;
    /**
     * 优惠币种
     */
    currency?: string;
    /**
     * 商品列表
     */
    goods_detail?: {
      /**
       * 商户侧商品编码
       */
      merchant_goods_id: string;
      /**
       * 微信侧商品编码
       */
      wechatpay_goods_id?: string;
      /**
       * 商品名称
       */
      goods_name?: string;
      /**
       * 商品单价
       */
      unit_price: number;
      /**
       * 商品退款金额
       */
      refund_amount: number;
      /**
       * 商品退货数量
       */
      refund_quantity: number;
    }[];
  }[];
}

/**
 * 申请退款
 * 
 * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_9.shtml
 */
export function refundTransaction(
  this: WxPay,
  data: RefundTransactionData,
) {
  return this.request<RefundTransactionRes>({
    url: "/v3/refund/domestic/refunds",
    method: "POST",
    data,
  });
}
