function getRoot(node) {
    let type = node.type;
    while(type !== 'root') {
        node = node.root();
        type = node.type;
    }
    return node;
}
module.exports = function(options, postcss) {
    let root = getRoot(options.rule);
    let mediaParams = [];
    let values = [];
    if(typeof options.mobileFirst === 'boolean' && options.mobileFirst) {
        mediaParams = [
            `(min-width: ${options.startMedia}${options.unit})`,
            `(min-width: ${options.endMedia}${options.unit})`
        ];
        values = [
            options.values.mediaValue,
            options.values.finishValue
        ];
    } else {
        mediaParams = [
            `(min-width: ${options.startMedia}${options.unit}) and (max-width: ${options.endMedia}${options.unit})`,
            `(max-width: ${options.startMedia}${options.unit})`
        ];
        values = [
            options.values.mediaValue,
            options.values.startValue
        ];
    }
    mediaParams.forEach((item, i) => {
        let selector = postcss.rule({ selector: options.rule.selector});
        let mediaQuery = postcss.atRule({name: 'media', params: item});
        selector.append({
            prop: options.prop,
            value: values[i]
        });
        mediaQuery.append(selector);
        root.append(mediaQuery);
    });
}
