const tools = require('./tools');

module.exports = function (opts) {
    let values = opts.values.map(item => parseFloat(item));
    let {unit, baseFontSize, decl, roundSize, sizeMap} = opts;
    let fontSize = sizeMap[decl.parent.selector];
    let ratio = null;
    let minSize = null;
    let maxSize = null;
    let curentSize = null;
    let value = null;
    switch (fontSize.unit) {
        case 'px':
            ratio = fontSize.value / baseFontSize;
            curentSize = fontSize.value;
            break;
        case 'rem':
            ratio = fontSize.value;
            curentSize = fontSize.value * baseFontSize;
            break;
    }
    switch (unit) {
        case '%':
            minSize = baseFontSize * ratio * (values[0] / 100);
            maxSize = baseFontSize * ratio * (values[1] / 100);
            value = `${values[0]}${unit}`;
            break;
        case 'px':
            minSize = baseFontSize * ratio * (values[0] / curentSize);
            maxSize = baseFontSize * ratio * (values[1] / curentSize);
            value = `${tools.roundVal(values[0] / curentSize * 100, roundSize)}%`;
            break;
        default:
            throw decl.error(
                `${unit} unsupported units`,
                {plugin: 'postcss-csslock', input: decl.error.file, word: unit}
            );
            break;
    }
    let minPoint = 0;
    let maxPoint = maxSize - minSize;
    let size = tools.linearfunc([minPoint, maxPoint, values[2], values[3]]);
    return {
        startValue: value,
        mediaValue: `calc(${value} + ${tools.roundVal(size.slope * 100, roundSize)}vw - ${tools.roundVal(size.delta, roundSize) * -1}px )`,
        finishValue: `calc(${value} + ${tools.roundVal(maxPoint, roundSize)}px )`
    }
}
