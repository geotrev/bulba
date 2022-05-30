## Bulba

A set of packages enabling an intuitive, deterministic, and extendable web component base class.

Base class (the main package):

- [@bulba/element](https://github.com/geotrev/bulba/tree/main/packages/element).

Renderers:

- [@bulba/jsx](https://github.com/geotrev/bulba/tree/main/packages/jsx)
- [@bulba/template](https://github.com/geotrev/bulba/tree/main/packages/template)

Utilities:

- [@bulba/utils](https://github.com/geotrev/bulba/tree/main/packages/utils)

### Development

To run tests:

```sh
$ npm test
```

To start the dev server, there are a few commands to know:

```sh
# Template renderer dev
$ npm run watch:template

# JSX renderer dev
$ npm run watch:jsx

# Template renderer, using CDN
$ npm run watch:cdn:template

# JSX renderer, using CDN
$ npm run watch:cdn:jsx
```

Note that when using the CDN commands, you should also uncomment one of the CDN links in the `index.html` entry point of either `preview/jsx` or `preview/template`. All should be valid after releasing a new version.
