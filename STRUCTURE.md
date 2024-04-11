# Storefront Code Structure



## Folders Overview
The Selldone Storefront project organizes its codebase into several key directories, each serving a specific function in
the development of a Vue.js application. Below is an overview of these directories and their purposes:

| Directory    | Purpose                                                                                   |
|--------------|-------------------------------------------------------------------------------------------|
| `components` | Stores custom Vue components used throughout the storefront.                              |
| `lang`       | Contains i18n language files for supporting multiple languages and managing translations. |
| `layouts`    | Houses app's master layouts, defining the overall structure of the application's UI.      |
| `pages`      | Contains the pages of the app, each representing a different page within the application. |
| `router`     | Holds Vue Router files for managing routing, navigation, and route-related logic.         |
| `store`      | Stores VueX store files for state management across the application.                      |


## File Naming

![file-naming.png](_docs/images/file-naming.png)

## Components Naming

Generally, component naming adheres to the following rules:

| Prefix | Description                                     | Example               |
|--------|-------------------------------------------------|-----------------------|
| `Sxxx` | Components used in the storefront.              | `<s-blog-card>`       |
| `Uxxx` | General-purpose UI components.                  | `<u-chip-change>`     |
| `Bxxx` | Components for backoffice (dashboard) use.      | `<b-club-select>`     |
| `Cxxx` | Components designed for community features.     | `<c-breadcrumb>`      |
| `Lxxx` | Components developed for the landing builder.   | `<l-section-article>` |
