Rime has a built-in fields level localization system.
To enable content localization configure your locales this way :

```ts
// src/lib/+rime/rizom.config.ts
export default rime({
  //...
  localization: {
    locales: [
      { code: 'fr', label: 'Français' },
      { code: 'en', label: 'English' }
    ],
    default: 'fr'
  }
});
```

Once enabled any field could then be set as localized :

```ts
text('content').localized();
```

Your documents will get a locale property, that could then be used to retrieve your localized content:

```ts
cont { docs } = await rime.collection('pages').find({ locale : 'en' })
```

Or from the api:

```ts
cont response = await fetch('/api/pages?locale=fr')
```
