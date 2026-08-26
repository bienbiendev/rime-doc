<!-- Summary: Rime is a developer-focused headless CMS for the Svelte ecosystem. -->

**Rime** is a CMS built on top of **SvelteKit**, designed with a focus on flexibility, ease of configuration, user-friendly administration, and performance. It turns a simple configuration into a schema database, then provides the tools around it:

```text
configuration -> schema -> database -> API -> admin panel -> your frontend
```

Rime handles the CMS foundations while leaving the frontend to you. Use the generated API, or build your frontend exactly the way your project needs with **Svelte** and **SvelteKit**.

[resource:pages:installation](/docs/02-installation.md)

## Why another CMS ?

The goal of **Rime** is to provide the Svelte ecosystem a CMS that is powerful enough for serious projects and straightforward for developers to configure and extend. Define your content, manage it through the panel, access it through the API, and decide how the frontend is built and delivered.

Some of its key features include :

- Headless architecture, so you can build your frontend without limitations
- Schema-driven configuration and automatic API endpoint generation
- A wide variety of [fields](/docs/05-fields/00-overview.md), including blocks and nested arrays
- A flexible, intuitive rich-text editor
- Built-in [i18n](/docs/03-configuration/04-i18n.md) support
- Version system
- Great type support, from your database schema to your frontend
- A smooth, developer-friendly workflow

While some existing tools offer similar features — with varying levels of configuration complexity — none of them truly met my needs without compromise. **Rime** bridges that gap, combining the full power of **SvelteKit** and **Svelte**, while providing all the features a CMS needs.

The choice of SQLite and Node.js server environments means your database, files, and app can run together on your server. There are no required external services or vendor lock-in, and your data stays yours. Deploying is as simple as uploading your code to any hosting provider that supports Node.js.
