import linearizeEncodings from './help/linearizeEncodings';
import merge from './help/merge';

/**
 * 实例化条码，并获取二进制数据
 * @param {String} text 条码输入值
 * @param {Function} Encoder 码制函数
 * @param {Object} options 条码其他参数
 * @return {Array} 二进制数据和其他信息
 */
export default (text, Encoder, options) => {
  // 条码不是非空字符串
  if (typeof text !== 'string' || text.length === 0) {
    throw new Error('Barcode value must be a non-empty string');
  }

  var encoder;

  try {
    encoder = new Encoder(text, options);
  } catch (error) {
    // 条码格式无效
    throw new Error('Invalid barcode format.');
  }

  // 所选格式的条形码无效
  if (!encoder.valid()) {
    throw new Error('Invalid barcode for selected format.');
  }

  // 获得二进制数据和其他信息
  // encoded structure is {
  //  text: 'xxxxx',
  //  data: '110100100001....'
  // }
  var encoded = encoder.encode();

  // Encodings can be nestled like [[1-1, 1-2], 2, [3-1, 3-2]
  // Convert to [1-1, 1-2, 2, 3-1, 3-2]
  encoded = linearizeEncodings(encoded);

  // 合并配置参数
  for (let i = 0; i < encoded.length; i++) {
    encoded[i].options = merge(options, encoded[i].options);
  }

  return encoded;
};
