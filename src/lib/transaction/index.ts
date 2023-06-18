/**
 * 订单金额
 */
export interface OrderAmount {
  /**
   * 总金额
   */
  total: number;
  /**
   * 货币类型
   */
  currency: string;
}

/**
 * 支付者
 */
export interface OrderPayer {
  /**
   * 用户标识
   */
  openid: string;
}

/**
 * 单品列表
 */
export interface OrderDetailGoods {
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
   * 商品数量
   */
  quantity: number;
  /**
   * 商品单价
   */
  unit_price: number;
}

/**
 * 优惠功能
 */
export interface OrderDetail {
  /**
   * 订单原价
   */
  cost_price?: number;
  /**
   * 商品小票ID
   */
  invoice_id?: string;
  /**
   * 单品列表
   */
  goods_detail?: OrderDetailGoods[];
}

/**
 * 商户门店信息
 */
export interface OrderSceneStore {
  /**
   * 门店编号
   */
  id: string;
  /**
   * 门店名称
   */
  name?: string;
  /**
   * 地区编码
   */
  area_code?: string;
  /**
   * 详细地址
   */
  address?: string;
}

/**
 * 场景信息
 */
export interface OrderScene {
  /**
   * 用户终端IP
   */
  payer_client_ip: string;
  /**
   * 商户端设备号
   */
  device_id?: string;
  /**
   * 商户门店信息
   */
  store_info?: OrderSceneStore;
}

/**
 * 结算信息
 */
export interface OrderSettle {
  /**
   * 是否指定分账
   */
  profit_sharing?: boolean;
}

export interface PostOrderData {
  /**
   * 应用ID
   */
  appid?: string;
  /**
   * 直连商户号
   */
  mchid?: string;
  /**
   * 商品描述
   */
  description: string;
  /**
   * 商户订单号
   */
  out_trade_no: string;
  /**
   * 交易结束时间
   */
  time_expire?: string;
  /**
   * 附加数据
   */
  attach?: string;
  /**
   * 通知地址
   */
  notify_url?: string;
  /**
   * 订单优惠标记
   */
  goods_tag?: string;
  /**
   * 电子发票入口开放标识
   */
  support_fapiao?: boolean;
  /**
   * 订单金额
   */
  amount: OrderAmount;
  /**
   * 优惠功能
   */
  detail?: OrderDetail;
  /**
   * 场景信息
   */
  scene_info?: OrderScene;
  /**
   * 结算信息
   */
  settle_info?: OrderSettle;
}

export type TradeType =
  | "JSAPI"
  | "NATIVE"
  | "APP"
  | "MICROPAY"
  | "MWEB"
  | "FACEPAY";

export type TradeState =
  | "SUCCESS"
  | "REFUND"
  | "NOTPAY"
  | "CLOSED"
  | "REVOKED"
  | "USERPAYING"
  | "PAYERROR";

export type RefundChannel =
  | "ORIGINAL"
  | "BALANCE"
  | "OTHER_BALANCE"
  | "OTHER_BANKCARD";

export type RefundStatus = "SUCCESS" | "CLOSED" | "PROCESSING" | "ABNORMAL";

export * from "./close";
export * from "./notify";
export * from "./notifyRefund";
export * from "./post";
export * from "./query";
export * from "./queryRefund";
export * from "./refund";
