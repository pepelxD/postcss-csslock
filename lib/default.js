const tools = require('./tools');

module.exports = function(opts) {
    let values = opts.values.map(item => parseFloat(item));
    let {unit, baseFontSize, decl, roundSize, sizeMap} = opts;
    let size = tools.linearfunc(values);
    return {
        startValue: `${values[0]}${unit}`,
        mediaValue: `calc(${tools.roundVal(size.slope * 100, roundSize)}vw + ${tools.roundVal(size.delta, roundSize)}${unit})`,
        finishValue: `${values[1]}${unit}`
    }
}
