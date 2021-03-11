/**
 * 合并外边距
 */

export default (options) => {
  options.marginTop = options.marginTop || options.margin;
  options.marginBottom = options.marginBottom || options.margin;
  options.marginRight = options.marginRight || options.margin;
  options.marginLeft = options.marginLeft || options.margin;

  return options;
};
