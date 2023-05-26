import { TradeState, TradeType } from ".";
import { WxPay } from "..";

/**
 * 签名验证
 * https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay4_1.shtml
 */
export interface NotifyTransactionHeaders {
  "wechatpay-timestamp": string;
  "wechatpay-signature": string;
  "wechatpay-serial": string;
  "wechatpay-nonce": string;
}

export interface NotifyTransactionBody {
  /**
   * 通知ID
   */
  id: string;
  /**
   * 通知创建时间
   */
  create_time: string;
  /**
   * 通知类型
   */
  event_type: string;
  /**
   * 通知数据类型
   */
  resource_type: string;
  /**
   * 通知数据
   */
  resource: {
    /**
     * 加密算法类型
     */
    algorithm: string;
    /**
     * 数据密文
     */
    ciphertext: string;
    /**
     * 附加数据
     */
    associated_data?: string;
    /**
     * 原始类型
     */
    original_type: string;
    /**
     * 随机串
     */
    nonce: string;
  };
  /**
   * 回调摘要
   */
  summary: string;
}

export interface NotifyTransaction {
  /**
   * 应用ID
   */
  appid: string;
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
   * 交易类型
   */
  trade_type: TradeType;
  /**
   * 交易状态
   */
  trade_state: TradeState;
  /**
   * 交易状态描述
   */
  trade_state_desc: string;
  /**
   * 付款银行
   */
  bank_type: string;
  /**
   * 附加数据
   */
  attach?: string;
  /**
   * 支付完成时间
   */
  success_time: string;
  /**
   * 支付者
   */
  payer: {
    /**
     * 用户标识
     */
    openid: string;
  };
  /**
   * 订单金额
   */
  amount: {
    /**
     * 总金额
     */
    total: number;
    /**
     * 用户支付金额
     */
    payer_total: number;
    /**
     * 货币类型
     */
    currency: string;
    /**
     * 用户支付币种
     */
    payer_currency: string;
  };
  /**
   * 场景信息
   */
  scene_info?: {
    /**
     * 设备号
     */
    device_id?: string;
  };
  /**
   * 优惠功能
   */
  promotion_detail?: {
    /**
     * 券ID
     */
    coupon_id: string;
    /**
     * 优惠名称
     */
    name?: string;
    /**
     * 优惠范围
     */
    scope?: string;
    /**
     * 优惠类型
     */
    type?: string;
    /**
     * 优惠券面额
     */
    amount: number;
    /**
     * 活动ID
     */
    stock_id?: string;
    /**
     * 微信出资
     */
    wechatpay_contribute?: number;
    /**
     * 商户出资
     */
    merchant_contribute?: number;
    /**
     * 其他出资
     */
    other_contribute?: number;
    /**
     * 优惠币种
     */
    currency?: string;
  }[];
  /**
   * 单品列表
   */
  goods_detail?: {
    /**
     * 商品编码
     */
    goods_id: string;
    /**
     * 商品数量
     */
    quantity: number;
    /**
     * 商品单价
     */
    unit_price: number;
    /**
     * 商品优惠金额
     */
    discount_amount: number;
    /**
     * 商品备注
     */
    goods_remark?: string;
  }[];
}

/**
 * 支付通知
 * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_5.shtml
 */
export type NotifyTransactionHandler = (
  headers: NotifyTransactionHeaders,
  body: NotifyTransactionBody,
) => void | NotifyTransaction;

export function notifyTransactionBuilder(
  this: WxPay,
): NotifyTransactionHandler {
  return (headers: NotifyTransactionHeaders, body: NotifyTransactionBody) => {
    const {
      "wechatpay-serial": certSerial,
      "wechatpay-timestamp": time,
      "wechatpay-nonce": nonceStr,
      "wechatpay-signature": signature,
    } = headers;
    const c = this.checkSignature(certSerial, time, nonceStr, body, signature);
    if (!c) return;
    const r = body.resource;
    const d = this.decrypto(r.nonce, r.ciphertext, r.associated_data ?? "");
    return JSON.parse(d) as NotifyTransaction;
  };
}
