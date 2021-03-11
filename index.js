import React, {useMemo} from 'react';
import Svg, {G, Rect} from 'react-native-svg';
import barcodes from 'jsbarcode/src/barcodes';

import encode from './encode';
import {
  calculateEncodingAttributes,
  getTotalWidthOfEncodings,
  getMaximumHeightOfEncodings,
} from './shared';
import merge from './help/merge.js';
import fixOptions from './help/fixOptions';
import drawSvgBarcode from './render/drawSvgBarcode.js';
import drawSvgText from './render/drawSvgText.js';

const BarCode = ({
  value = '',
  format = 'CODE128',
  text = '',
  width = 2,
  height = 100,
  displayValue = true, // 显示文本
  font = 'monospace', // 文本字体
  fontWeight = 'normal', // 粗体, bold
  textAlign = 'center', // 文本对齐， left / center / right
  textPosition = 'bottom', // 文本位置，  bottom / top
  textMargin = 2, // 条形码和文本之间的间距
  fontSize = 20, // 文本的大小
  background = '#ffffff', // 条形码的背景色
  lineColor = '#000000', // 条和文本的颜色
  margin = 10, // 条形码周围的空间边距
  marginTop = 0,
  marginRight = 0,
  marginBottom = 0,
  marginLeft = 0,
  getRef,
  onError,
}) => {
  const result = useMemo(() => {
    try {
      let options = {
        width,
        height,
        displayValue,
        font,
        fontWeight,
        textAlign,
        textPosition,
        textMargin,
        fontSize,
        margin,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
      };

      options = fixOptions(options);

      const encoder = barcodes[format];
      let encoded = encode(value, encoder, options);

      encoded = calculateEncodingAttributes(encoded, options);

      const codeWidth = getTotalWidthOfEncodings(encoded);
      const maxHeight = getMaximumHeightOfEncodings(encoded);
      const totalWidth = codeWidth + options.marginLeft + options.marginRight;

      return {
        options,
        totalWidth,
        maxHeight,
        encoded,
      };
    } catch (error) {
      if (onError && typeof onError === 'function') {
        onError(error);
      } else {
        // Pass the error when no handler presented
        throw error;
      }
    }
  }, [
    value,
    format,
    width,
    height,
    displayValue,
    font,
    fontWeight,
    textAlign,
    textPosition,
    fontSize,
    textMargin,
    margin,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    onError,
  ]);

  if (!result) {
    return null;
  }

  const {options, totalWidth, maxHeight, encoded} = result;
  let orginX = options.marginLeft;

  return (
    <Svg ref={getRef} width={totalWidth} height={maxHeight}>
      {/* 背景矩形 */}
      <Rect
        x={0}
        y={0}
        width={totalWidth}
        height={maxHeight}
        fill={background}
      />
      {encoded.map((item, index) => {
        const encodingOptions = merge(options, item.options);

        if (index > 0) {
          orginX += encoded[index - 1].width;
        }

        return (
          <G
            key={index}
            x={orginX}
            y={encodingOptions.marginTop}
            fill={lineColor}>
            {drawSvgBarcode(item, encodingOptions)}
            {drawSvgText(item, encodingOptions)}
          </G>
        );
      })}
    </Svg>
  );
};

export default BarCode;
