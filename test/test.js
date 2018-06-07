var postcss = require('postcss');

var plugin = require('../');

function run(input, output, opts) {
    return postcss([ plugin(opts) ]).process(input)
        .then(result => {
            expect(result.css).toEqual(output);
            expect(result.warnings().length).toBe(0);
        });
}

// Write tests here

let fontSizeIn = `.css {
        lock: font-size 20 40 320 960;
    }`;
let fontSizeOut = {
    base: `.css {
        font-size: 40px;
    }
@media (min-width: 320px) and (max-width: 960px) {
        .css {
                font-size: calc(3.125vw + 10px);
        }
}
@media (max-width: 320px) {
        .css {
                font-size: 20px;
        }
}`,
    mobileFirst: `.css {
        font-size: 20px;
    }
@media (min-width: 320px) {
        .css {
                font-size: calc(3.125vw + 10px);
        }
}
@media (min-width: 960px) {
        .css {
                font-size: 40px;
        }
}`
};
let sizeInRem = `.css {
        lock: font-size 1.25rem 2.5rem 320 960;
    }`;
let sizeOutRem = {
    base: '',
    mobileFirst: `.css {
        font-size: 1.25rem;
    }
@media (min-width: 320px) {
        .css {
                font-size: calc(1.25rem + 3.125vw - 10px);
        }
}
@media (min-width: 960px) {
        .css {
                font-size: calc(1.25rem + 20px);
        }
}`
};

it('base scale', () => {
    return run(fontSizeIn, fontSizeOut.base, { });
});
it('base mobile first scale', () => {
    return run(fontSizeIn, fontSizeOut.mobileFirst, { mobileFirst: true });
});
it('rem mobile first scale', () => {
    return run(sizeInRem, sizeOutRem.mobileFirst, { mobileFirst: true });
});
// дописать тесты
