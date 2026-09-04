// Boilerplate -- turns "Heritage Canvas Tote" into "heritage-canvas-tote".
// Your father never sees or types a slug; it's generated silently.
export function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
