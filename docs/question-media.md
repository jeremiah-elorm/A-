# Question Media Conventions

Use these fields on `Question` when a prompt includes a diagram or practical setup.

## Fields
- `imageUrl`: Relative path (e.g. `/questions/diagrams/heart.svg`) or absolute URL.
- `imageAlt`: Required if `imageUrl` is set. Describe the diagram content.
- `imageCaption`: Optional short caption shown under the diagram.

## Storage
- Place static diagrams under `public/questions/diagrams/`.
- Prefer SVG for clarity and lightweight assets.

## Admin validation
- Image alt text is required when an image is provided.
- Image URL must be a relative path or absolute URL.
