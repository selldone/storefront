## Local Development


###  First, navigate to the library’s directory:


```bash
yarn link
```


### Link the Library in Your Consuming Project

```bash
yarn link "@selldone/core-js"

yarn link "@selldone/translate"

yarn link "@selldone/sdk-storefront"

yarn link "@selldone/sdk-community"

yarn link "@selldone/sdk-vendor"

yarn link "@selldone/components-vue"

yarn link "@selldone/page-builder"

```

### Unlink the Library

1. cd path/to/your/project
2. yarn unlink "@selldone/core-js"
3. yarn install
```bash
yarn unlink "@selldone/core-js"
yarn unlink "@selldone/translate"
yarn unlink "@selldone/sdk-storefront"
yarn unlink "@selldone/sdk-community"
yarn unlink "@selldone/sdk-vendor"
yarn unlink "@selldone/components-vue"
yarn unlink "@selldone/page-builder"

yarn install
```