const tools = require('./tools');

module.exports = function(opts) {
    let values = opts.values.map(item => parseFloat(item));
    let {unit, baseFontSize, decl, roundSize, sizeMap} = opts;
    let cssString = null;
    sizeMap[decl.parent.selector] = {value: values[0], unit: unit};
    if (opts.unit === 'px') {
        let size = tools.linearfunc(values);
        cssString = {
            startValue: `${values[0]}${unit}`,
            mediaValue: `calc(${tools.roundVal(size.slope * 100, roundSize)}vw + ${tools.roundVal(size.delta, roundSize)}${unit})`,
            finishValue: `${values[1]}${unit}`
        }
    } else if (opts.unit === 'rem') {
        let corectValues = values.map((item, i) => {
            return i === 0 || i === 1 ? item * baseFontSize : item;
        });
        let size = tools.linearfunc(corectValues);
        let delta = size.delta - corectValues[0];
        let operand = '+';
        if (Math.sign(delta) === -1) {
            delta *= -1;
            operand = '-';
        }
        cssString = {
            startValue: `${values[0]}${unit}`,
            mediaValue: `calc(${values[0]}${unit} + ${tools.roundVal(size.slope * 100, roundSize)}vw ${operand} ${tools.roundVal(delta, roundSize)}px)`,
            finishValue: `calc(${values[0]}${unit} + ${tools.roundVal(corectValues[1] - corectValues[0], roundSize)}px)`
        }
    } else {
        throw decl.error(
            `${unit} unsupported units`,
            { plugin: 'postcss-csslock', input: decl.error.file, word: unit}
        );
    }
    return cssString;
}
