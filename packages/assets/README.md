# @xbase/assets

Source-of-truth package for shared static files.

Put files under `public`:

- `public/logos`
- `public/icons`
- `public/images`
- `public/fonts`
- `public/documents`
- `public/media`

```ts
import { assets } from "@xbase/assets";
import image from "@xbase/assets/images/example.png";

const directories = assets.directories;
```

Assets are consumed from the package as module imports. They are not copied into
each app's `public` directory.
