/**
 * 绘制barcode
 */
import React from 'react';
import {Rect} from 'react-native-svg';

export default (encoding, options) => {
  var binary = encoding.data;
  var yFrom;

  if (options.textPosition === 'top') {
    yFrom = options.fontSize + options.textMargin;
  } else {
    yFrom = 0;
  }

  var barWidth = 0;
  var x = 0;
  var rectNodes = [];

  for (var b = 0; b < binary.length; b++) {
    x = b * options.width + encoding.barcodePadding;

    if (binary[b] === '1') {
      barWidth++;
    } else if (barWidth > 0) {
      rectNodes.push(
        <Rect
          key={b}
          x={x - options.width * barWidth}
          y={yFrom}
          width={options.width * barWidth}
          height={options.height}
          strokeWidth={0.1}
          stroke={options.lineColor}
        />,
      );

      barWidth = 0;
    }
  }

  if (barWidth > 0) {
    rectNodes.push(
      <Rect
        key={Math.random()}
        x={x - options.width * (barWidth - 1)}
        y={yFrom}
        width={options.width * barWidth}
        height={options.height}
        strokeWidth={0.1}
        stroke={options.lineColor}
      />,
    );
  }

  return rectNodes;
};
