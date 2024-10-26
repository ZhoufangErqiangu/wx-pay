import { AxiosHeaders } from "axios";
import { strictEqual } from "node:assert";
import { describe, test } from "node:test";
import { join } from "path";
import { WxPay } from "../src";

const wxPay = new WxPay({
  appId: "",
  apiv3Key: "",
  mchId: "1900009191",
  certSerial: "1DDE55AD98ED71D6EDD4A4A16996DE7B47773A8C",
  wxPayPublicKeyPath: join(process.cwd(), "cert", "1900009191_wxp_pub.pem"),
  privateKeyPath: join(process.cwd(), "cert", "test.pem"),
  notifyUrl: "",
});

// this will fail because we do not know the private key
describe("sign", { skip: true }, () => {
  test("test wx pay sign", () => {
    strictEqual(
      wxPay
        .requestInterceptorBuilder({
          timestamp: "1554208460",
          nonceStr: "593BEC0C930BF1AFEB40B4A08C8FB242",
        })({
          method: "get",
          url: "/v3/certificates",
          headers: new AxiosHeaders(),
        })
        .headers.get("Authorization"),
      // eslint-disable-next-line quotes
      'WECHATPAY2-SHA256-RSA2048 mchid="1900009191",nonce_str="593BEC0C930BF1AFEB40B4A08C8FB242",signature="uOVRnA4qG/MNnYzdQxJanN+zU+lTgIcnU9BxGw5dKjK+VdEUz2FeIoC+D5sB/LN+nGzX3hfZg6r5wT1pl2ZobmIc6p0ldN7J6yDgUzbX8Uk3sD4a4eZVPTBvqNDoUqcYMlZ9uuDdCvNv4TM3c1WzsXUrExwVkI1XO5jCNbgDJ25nkT/c1gIFvqoogl7MdSFGc4W4xZsqCItnqbypR3RuGIlR9h9vlRsy7zJR9PBI83X8alLDIfR1ukt1P7tMnmogZ0cuDY8cZsd8ZlCgLadmvej58SLsIkVxFJ8XyUgx9FmutKSYTmYtWBZ0+tNvfGmbXU7cob8H/4nLBiCwIUFluw==",timestamp="1554208460",serial_no="1DDE55AD98ED71D6EDD4A4A16996DE7B47773A8C"',
    );
  });
});
