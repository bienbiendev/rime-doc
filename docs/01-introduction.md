**Rime** is a headless CMS built on top of **SvelteKit**, designed with a focus on flexibility, ease of configuration, user-friendly administration, and performance. It’s made for developers who want to concentrate on creativity rather than fighting with the tools.

[resource:pages:installation](/docs/02-installation.md)

## Why another CMS ?

The main goal of **Rime** is to provide instant access to a flexible admin panel, with all the essential tools to build your project. It has been designed to be as intuitive and easy to use as possible, while still offering the full power of **SvelteKit** and **Svelte**.

Some of its key features include :

- Headless architecture, so you can build your front-end without limitations
- Automatic API endpoint generation
- A wide variety of [fields](/docs/05-fields/00-overview.md), including blocks and nested arrays
- A flexible, intuitive rich-text editor
- Built-in [i18n](/docs/03-configuration/04-i18n.md) support
- Version system
- Great types supports, from your database schema to your front-end
- Smooth, developer-friendly workflow

While some existing tools offer similar features — with varying levels of configuration complexity — none of them truly met my needs without compromise. **Rime** bridges that gap, combining the full power of **SvelteKit** and **Svelte**, while providing all the features a CMS needs.

Also the choices of SQLite database and targeting nodeJS server environments ensure that everything runs on your server — database, files, and app together. No external services, no vendor lock-in, your data stays yours. And deploying is as simple as uploading your code to any hosting provider that supports nodeJS.
