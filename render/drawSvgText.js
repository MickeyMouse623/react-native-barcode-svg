/**
 * 绘制文字
 */
import React from 'react';
import {Text} from 'react-native-svg';

export default (encoding, options) => {
  if (options.displayValue && encoding.text) {
    let x: number;
    let y: number;
    let textAnchor: string;

    if (options.textPosition === 'top') {
      y = options.fontSize - options.textMargin;
    } else {
      y = options.height + options.textMargin + options.fontSize;
    }

    if (options.textAlign === 'left' || encoding.barcodePadding > 0) {
      x = 0;
      textAnchor = 'start';
    } else if (options.textAlign === 'right') {
      x = encoding.width - 1;
      textAnchor = 'end';
    } else {
      x = encoding.width / 2;
      textAnchor = 'middle';
    }

    return (
      <Text
        key={Math.random()}
        x={x}
        y={y}
        textAnchor={textAnchor}
        stroke={options.lineColor}
        fontWeight={options.fontWeight}
        fontSize={options.fontSize}>
        {encoding.text}
      </Text>
    );
  }
};
