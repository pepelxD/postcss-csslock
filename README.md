# PostCSS-CSSLock [![Build Status][ci-img]][ci]

[PostCSS] plugin CSS-gateway is a special kind of calculation of CSS-value, in which: there is a minimum and maximum value, there are two breakpoints (usually depending on the width of the viewport), between these points the value varies linearly from the minimum to the maximum..

The writing of this plugin was inspired by the article - [The Mathematics of CSS Gateways](https://habr.com/company/mailru/blog/315196/)

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/pepelxD/postcss-csslock.svg
[ci]:      https://travis-ci.org/pepelxD/postcss-csslock

## Install

`npm install postcss-csslock -D`

## Example

   ### Input

```css
.foo {
    lock: font-size 20 40 320 960;
}

.bar {
    lock: line-height 23 28 320 960;
}
```
   ### Output

```css
.foo {
    font-size: 20px;
}
@media (min-width: 320px) {
    .foo {
        font-size: calc(3.125vw + 10px);
    }
}
@media (min-width: 960px) {
    .foo {
        font-size: 40px;
    }
}


.bar {
    line-height: 115%;
}
@media (min-width: 320px) {
    .bar {
        line-height: calc(115% + 0.7813vw - 2.5px );
    }
}
@media (min-width: 960px) {
    .bar {
        line-height: calc(115% + 5px );
    }
}
```

By default, the plugin works with pixel units, but you can use "rem" in the "font-size" property and "%" in "line-height" property.

To do this, just write the values with the units of measurement.

In this case, for the line height, the percentage value is returned, for the font size depending on the units transferred


## Settings:
  #### mobileFirst
  ___type___: *boolean*

  ___default___: *false*

  Used to switch the modes of building media queries

  #### baseFontSize
  ___type___: *nember*

  ___default___: *16*

  ___units___: *px*

  Used to set the base font size
  Warning, this setting must match the base font size of your project

  #### roundSize
  ___type___: *nember*

  ___default___: *4*

  Used to specify the number of decimal places in the resulting decimal numbers as a result of the calculations

  #### userFunc
  ___type___: *object*

  Pass here an object whose properties are the names of the rules you want to process, and the value of the property are the functions that are executed to process the rule

  ##### Example:
  ```
  userFunc: {
      'margin-left'(opts) {
          console.log(opts);
      }
  }
  ```
  Results of output to the console:
  ```
    {
        prop: 'margin-left',
        values: [ '30', '50', '320', '960' ],
        unit: 'px',
        decl: "Current decl object provided by post-css",
        baseFontSize: 16,
        roundSize: 5,
        sizeMap: { '.html': { value: 20, unit: 'px' } // It stores information about the font size in the selectors to which it was applied "lock: font-size..."
    }
  ```

  It is important to know that when changing the default function for the font size, you need to manually place in the "sizeMap" information about the minimum value and units,
  this is necessary for calculating the height of the line, unless of course you do not replace this function.

## Restrictions
Because the CSS gateways are tied to the units of the viewing area, the gateways have a number of important limitations. __They can only take numeric values, use calc () and take values in pixels.__

Why is that? Because the viewing area units (vw, vh, vmin and vmax) are always defined in pixels. For example, if the width of the viewport is 768 pixels, then 1vw is determined to be 7.68 pixels.

The current implementation of the plug-in allows you to take the following units of measure:

font-size - px, rem

line-height - px, %

However, if you use pixels, you do not need to specify them - these are the default ones.

Media requests are built only on pixel control points.

Using a gateway for line height, without a gateway for the font size, will result in an error.
This is due to the fact that the plugin for calculating the line height needs the current font size, it gets it just when creating a gateway for the font size.

In other words, to apply a gateway to the height of a row, you need to have a record like this:
```
lock: font-size ....;
lock: line-height ....;
```

##Recommendation
Use the post-css plugin to combine media queries, css-lok will create for each selector in which a separate media request is applied.



## Usage

```js
postcss([ require('postcss-csslock')(opts) ])
```

See [PostCSS] docs for examples for your environment.


