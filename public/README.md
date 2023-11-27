# Selldone Storefront Meta Tags `index.html`

This README file provides detailed information about the meta tags used in the `index.html` of the Selldone Storefront
project. These tags play a crucial role in simulating the Selldone hosting store environment and configuring various
aspects of the storefront.

## Overview

Meta tags in HTML are used to provide metadata about the HTML document. In the context of the Selldone Storefront, these
tags are essential for defining shop characteristics, API endpoints, CDN links, and other configuration settings.

## Meta Tag Descriptions

### Business and Shop Information

- **Business OS and Shop Classification**
    - `<meta name="Classification" content="Shop">`
    - `<meta name="copyright" content="Selldone">`
    - These tags classify the site as a shop and attribute copyright to Selldone.

- **Shop Name**
    - `<meta name="shop-name" content="<%= process.env.VUE_APP_SAMPLE_SHOP_NAME %>">`
    - Specifies the name of the shop, dynamically loaded from environment variables.

- **Shop Prefix Address**
    - `<meta name="shop-prefix-address" content="">`
    - Defines a prefix for the shop's address (e.g., a unique identifier or slug).

- **Custom Home Page**
    - `<meta name="custom-home" content="<%= process.env.VUE_APP_SAMPLE_SHOP_CUSTOM_HOME %>">`
    - Sets a custom landing page for the shop, loaded from environment variables.

### Business OS Configuration

- **Service Origin**
    - `<meta name="service-url" content="https://selldone.com">`
    - The main URL for the Selldone service.

- **API Endpoints**
    - Various meta tags define the URLs for different Selldone APIs (General, Extended, Iframe, Community, etc.).
    - Example: `<meta name="selldone-gapi" content="https://gapi.selldone.com">`

- **Content Delivery Networks (CDNs)**
    - These tags specify URLs for different types of content (images, videos, JSON files, etc.) hosted on Selldone's
      CDNs.
    - Example: `<meta name="selldone-cdn-images" content="https://selldone.com/cdn-shop-images-1">`

- **Storage Redirection**
    - `<meta name="storage-redirect" content="true">`
    - `<meta name="storage-redirect-host" content="https://cdn.selldone.com">`
    - `<meta name="storage-redirect-thumbnails" content="true">`
    - These tags manage the redirection of storage requests to the appropriate CDN.

### Defaults and Localization

- **Local Service Country**
    - `<meta name="local-service-country" content="">`
    - Sets the default country for the local service.

- **Default Currency, Country, and Language**
    - These tags set the default currency, country, and language for the storefront.
    - Example: `<meta name="default-currency" content="<%= process.env.VUE_APP_SAMPLE_DEFAULT_CURRENCY %>">`

### Theme Customization

- **Theme Colors**
    - These tags define the color scheme for various theme modes (light, dark, deep dark, info).
    - Example: `<meta name="color--theme-light" content="<%= process.env.VUE_APP_SAMPLE_DEFAULT_CURRENCY %>">`


The meta tags in the Selldone Storefront's `index.html` are essential for configuring the storefront's functionality and
appearance. They ensure that the storefront aligns with the specific requirements of the Selldone hosting environment
and provides a seamless user experience.