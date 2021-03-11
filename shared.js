import {Dimensions, PixelRatio} from 'react-native';
import merge from './help/merge.js';

const {width, height} = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();
const DEFAULT_DENSITY = 2; // 像素密度
// 以iphone6为基准,如果以其他尺寸为基准的话,修改下面的defaultWidth和defaultHeight为对应尺寸即可. 以下为1倍图时
const defaultWidth = 750;
const defaultHeight = 1080;
const w2 = defaultWidth / DEFAULT_DENSITY;
const h2 = defaultHeight / DEFAULT_DENSITY;

function getEncodingHeight(encoding, options) {
  return (
    options.height +
    (options.displayValue && encoding.text.length > 0
      ? options.fontSize + options.textMargin
      : 0) +
    options.marginTop +
    options.marginBottom
  );
}

function getBarcodePadding(textWidth, barcodeWidth, options) {
  if (options.displayValue && barcodeWidth < textWidth) {
    if (options.textAlign === 'center') {
      return Math.floor((textWidth - barcodeWidth) / 2);
    } else if (options.textAlign === 'left') {
      return 0;
    } else if (options.textAlign === 'right') {
      return Math.floor(textWidth - barcodeWidth);
    }
  }

  return 0;
}

/**
 * 计算条码属性
 * @param {Array} encodings 需要计算的条码数据
 * @param {Object} barcodeOptions 用户传入的自定义参数
 * @return {Array}
 */
function calculateEncodingAttributes(encodings, barcodeOptions) {
  const result = [];

  for (let i = 0; i < encodings.length; i++) {
    var encoding = encodings[i];
    var options = merge(barcodeOptions, encoding.options);

    // Calculate the width of the encoding
    var textWidth;

    if (options.displayValue) {
      textWidth = messureText(encoding.text, options);
    } else {
      textWidth = 0;
    }

    var barcodeWidth = encoding.data.length * options.width;
    encoding.width = Math.ceil(Math.max(textWidth, barcodeWidth));

    encoding.height = getEncodingHeight(encoding, options);

    encoding.barcodePadding = getBarcodePadding(
      textWidth,
      barcodeWidth,
      options,
    );

    result.push(encoding);
  }

  return result;
}

/**
 * 获取条码总宽度
 * @param {Array} encodings 条码数据
 * @return {Number}
 */
function getTotalWidthOfEncodings(encodings) {
  var totalWidth = 0;

  for (let i = 0; i < encodings.length; i++) {
    totalWidth += encodings[i].width;
  }

  return totalWidth;
}

function getMaximumHeightOfEncodings(encodings) {
  var maxHeight = 0;

  for (let i = 0; i < encodings.length; i++) {
    if (encodings[i].height > maxHeight) {
      maxHeight = encodings[i].height;
    }
  }

  return maxHeight;
}

function getSpText(size: Number) {
  const scaleWidth = width / w2;
  const scaleHeight = height / h2;

  let scale = Math.min(scaleWidth, scaleHeight);
  size = Math.round(size * scale + 0.5);

  return (size / DEFAULT_DENSITY) * fontScale;
}

/**
 * 计算文本宽度
 * @param {String} text 需要核算的文本
 * @param {Object} options 用户传入的自定义参数
 * @return {Number}
 */
function messureText(text, options) {
  if (!text) {
    return 0;
  }

  const textWidth = getSpText(options.fontSize) * text.length;

  return textWidth;
}

export {
  getMaximumHeightOfEncodings,
  getEncodingHeight,
  getBarcodePadding,
  calculateEncodingAttributes,
  getTotalWidthOfEncodings,
};
