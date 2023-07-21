import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from "axios";
import { readFileSync } from "fs";
import { nonceStr } from "../util/nonceStr";
import { normalizeUrl } from "../util/normalizeUrl";
import { paramsToString } from "../util/paramsToString";
import { timestamp } from "../util/timestamp";
import { checkSignature } from "./checkSignature";
import { decrypto } from "./decrypto";
import { getCerts } from "./getCerts";
import { requestInterceptorBuilder } from "./interceptor";
import { sign } from "./sign";
import {
  closeTransaction,
  notifyTransactionBuilder,
  notifyTransactionRefundBuilder,
  postTransactionApp,
  postTransactionH5,
  postTransactionJsApi,
  postTransactionNative,
  queryRefund,
  queryTransaction,
  refundTransaction,
} from "./transaction";

/**
 * 微信支付参数
 */
export interface WxPayParam {
  /**
   * appid 在微信开放平台申请
   */
  appId: string;
  /**
   * APIv3密钥 在商户平台设置
   */
  apiv3Key: string;
  /**
   * 商户ID 在微信支付申请
   */
  mchId: string;
  /**
   * 异步接收微信支付结果通知的回调地址
   *
   * 通知url必须为外网可访问的url，不能携带参数。
   *
   * 公网域名必须为https
   */
  notifyUrl: string;
  /**
   * 平台证书公钥文件夹
   *
   * 微信会定期或不定期更换公钥, 所以需要保存到文件夹里
   *
   * 验证签名时, 会从此文件夹读取公钥
   */
  publicKeyDir: string;
  /**
   * 商户API私钥文件地址
   */
  privateKeyPath: string;
  /**
   * 商户证书序列号
   */
  certSerial: string;
  /**
   * 支持发票
   */
  supportFapiao?: boolean;
  /**
   * auto get cert
   */
  autoGetCert?: boolean;
  /**
   * 请求的地址
   */
  baseURL?: string;
  /**
   * 超时时间
   */
  timeout?: number;
  /**
   * axios 配置
   */
  axiosConfig?: CreateAxiosDefaults;
  /**
   * 启用调试, 打印所有log
   */
  debug?: boolean;
}

/**
 * 微信支付
 */
export class WxPay {
  public baseURL = "https://api.mch.weixin.qq.com";
  public appId: string;
  protected apiv3Key: string;
  public mchId: string;
  public notifyUrl: string;
  public publicKeyDir: string;
  protected privateKey;
  public certSerial: string;
  public supportFapiao: boolean;
  public service: AxiosInstance;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public request: <T = any, R = AxiosResponse<T>, D = any>(
    config: AxiosRequestConfig<D>,
  ) => Promise<R>;
  public debug: boolean;

  /**
   * 构造请求拦截器函数
   */
  public requestInterceptorBuilder = requestInterceptorBuilder;

  static normalizeUrl = normalizeUrl;
  public normalizeUrl = normalizeUrl;
  static paramsToString = paramsToString;
  public paramsToString = paramsToString;

  /**
   * 签名
   */
  public sign = sign;
  /**
   * 检查签名
   */
  public checkSignature = checkSignature;
  /**
   * 解密
   */
  public decrypto = decrypto;
  /**
   * jsapi下单
   * 小程序下单
   */
  public postTransactionJsApi = postTransactionJsApi;
  /**
   * app下单
   */
  public postTransactionApp = postTransactionApp;
  /**
   * h5下单
   */
  public postTransactionH5 = postTransactionH5;
  /**
   * native下单
   */
  public postTransactionNative = postTransactionNative;
  /**
   * 构造处理支付通知函数
   */
  public notifyTransactionBuilder = notifyTransactionBuilder;
  /**
   * 处理支付通知
   */
  public notifyTransaction = this.notifyTransactionBuilder();
  /**
   * 查询订单
   */
  public queryTransaction = queryTransaction;
  /**
   * 关闭订单
   */
  public closeTransaction = closeTransaction;
  /**
   * 退款
   */
  public refundTransaction = refundTransaction;
  /**
   * 构造退款通知处理函数
   */
  public notifyTransactionRefundBuilder = notifyTransactionRefundBuilder;
  /**
   * 退款通知处理
   */
  public notifyTransactionRefund = this.notifyTransactionRefundBuilder();
  /**
   * 查询退款
   */
  public queryRefund = queryRefund;
  /**
   * 获取证书
   */
  public getCerts = getCerts;

  constructor(param: WxPayParam) {
    const {
      appId,
      apiv3Key,
      mchId,
      notifyUrl,
      publicKeyDir,
      privateKeyPath,
      certSerial,
      supportFapiao = false,
      autoGetCert = true,
      baseURL,
      timeout = 10000,
      axiosConfig = {},
      debug = false,
    } = param;
    this.appId = appId;
    this.apiv3Key = apiv3Key;
    this.mchId = mchId;
    this.notifyUrl = notifyUrl;
    this.publicKeyDir = publicKeyDir;
    this.privateKey = readFileSync(privateKeyPath, "utf-8");
    this.certSerial = certSerial;
    this.supportFapiao = supportFapiao;
    if (baseURL) this.baseURL = baseURL;
    // axios
    this.service = Axios.create({
      ...axiosConfig,
      baseURL: this.baseURL,
      timeout,
    });
    this.service.interceptors.request.use(this.requestInterceptorBuilder());
    this.request = this.service.request;
    // auto get cert
    if (autoGetCert) {
      this.getCerts();
    }
    // debug
    this.debug = debug;
    if (this.debug) {
      this.service.interceptors.request.use((config) => {
        console.log("wx pay request url    ", config.url);
        console.log("wx pay request method ", config.method);
        console.log("wx pay request params ", config.params);
        console.log("wx pay request headers", config.headers);
        console.log("wx pay request data   ", config.data);
        return config;
      });
      this.service.interceptors.response.use((res) => {
        console.log("wx pay response status ", res.status);
        console.log("wx pay response headers", res.headers);
        console.log("wx pay response data   ", res.data);
        return res;
      });
    }
  }

  /**
   * 随机字符串
   */
  public get nonceStr() {
    return nonceStr();
  }

  /**
   * 时间戳
   */
  public get timestamp() {
    return timestamp();
  }
}
