const postcss = require('postcss');
const merge = require('deepmerge');
const media = require('./lib/media');
const engine = require('./lib/engine');

let defOpts = {
    mobileFirst: false,
    baseFontSize: 16,
    unit: 'px', // rem
    roundSize: 4,
    userFunc: false // obj func
};

module.exports = postcss.plugin('postcss-csslock', (opts = {}) => {
    let options = merge(defOpts, opts);
    let sizeMap = {};
    options.roundSize += 1;
    return (root) => {
        root.walkRules((rule) => {
            rule.walkDecls('lock', (decl) => {
                if(typeof options.userFunc === 'object') {
                    if(Object.keys(options.userFunc).length !== 0) {
                        for(let key in options.userFunc) {
                            if(options.userFunc.hasOwnProperty(key)) {
                                engine[key] = options.userFunc[key];
                            }
                        }
                    }
                }

                let params = decl.value.split(' ');
                let propUnit = params[1].replace(/[^a-z|%]/ig, '').toLowerCase() || options.unit.toLowerCase();
                let mediaUnit = params[3].replace(/[^a-zA-Z]/g, '').toLowerCase() || 'px';
                let property = params[0];

                if(typeof engine[property] !== 'function') {
                    property = 'default';
                }

                let values = engine[property]({
                    prop: params[0],
                    values: params.slice(1),
                    unit: propUnit,
                    decl: decl,
                    baseFontSize: options.baseFontSize,
                    roundSize: options.roundSize,
                    sizeMap: sizeMap
                });

                rule.append({
                    prop: params[0],
                    value: options.mobileFirst ? values.startValue : values.finishValue
                });
                media({
                    rule: rule,
                    startMedia: parseFloat(params[3]),
                    endMedia: parseFloat(params[4]),
                    prop: params[0],
                    values: values,
                    mobileFirst: options.mobileFirst,
                    unit: 'px'
                }, postcss);

                decl.remove();
            });
        });
    };
});
