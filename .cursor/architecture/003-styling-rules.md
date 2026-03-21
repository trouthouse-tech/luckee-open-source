# 003 - Styling Rules (Next.js)

## Scope

These rules define how styling must be written in this repository's Next.js codebase.

## Required Pattern

1. Use a **`styles` object pattern** inside the component file.
2. Use **template literals** (backticks) for style values.
3. Define the **component first**, then define `styles` **after** the component function.
4. Group responsive utilities so each breakpoint is on a separate line.
5. Do **not** use inline `style={{ ... }}`.
6. Do **not** create separate CSS files (`.css`, `.module.css`, `.scss`) for component styling.

---

## ✅ Correct Example

```tsx
type ProductCardProps = {
  title: string;
  priceLabel: string;
};

export function ProductCard({ title, priceLabel }: ProductCardProps) {
  return (
    <article className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.price}>{priceLabel}</p>
      <button className={styles.button}>View details</button>
    </article>
  );
}

const styles = {
  card: `
    rounded-xl border border-slate-200 bg-white p-4 shadow-sm
    sm:p-5
    md:p-6
    lg:p-7
  `,
  title: `
    text-base font-semibold text-slate-900
    sm:text-lg
    md:text-xl
  `,
  price: `
    mt-2 text-sm text-slate-600
    sm:text-base
  `,
  button: `
    mt-4 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2
    text-sm font-medium text-white transition-colors hover:bg-blue-700
    sm:text-base
  `,
} as const;
```

Why this is correct:

- Uses a single `styles` object.
- Uses backtick template literals.
- Defines `styles` after the component function.
- Places each responsive prefix (`sm:`, `md:`, `lg:`) on its own line.

---

## ❌ Incorrect Example: Inline Styles

```tsx
export function ProductCard() {
  return (
    <article style={{ padding: 16, borderRadius: 12 }}>
      <h3 style={{ fontSize: 20 }}>Title</h3>
    </article>
  );
}
```

Why this is wrong:

- Violates the no-inline-styles rule.
- Does not use the `styles` object pattern.

---

## ❌ Incorrect Example: Separate CSS File

```tsx
// ProductCard.tsx
import "./ProductCard.css";

export function ProductCard() {
  return <article className="card">Title</article>;
}
```

```css
/* ProductCard.css */
.card {
  padding: 16px;
}
```

Why this is wrong:

- Violates the no-separate-CSS-files rule.

---

## ❌ Incorrect Example: Styles Declared Before Component

```tsx
const styles = {
  card: `rounded-xl p-4`,
};

export function ProductCard() {
  return <article className={styles.card}>Title</article>;
}
```

Why this is wrong:

- `styles` must be declared after the component function.

---

## ❌ Incorrect Example: Poor Responsive Grouping

```tsx
const styles = {
  card: `p-4 sm:p-5 md:p-6 lg:p-7 rounded-xl`,
};
```

Why this is wrong:

- Responsive classes are not grouped cleanly line-by-line.
- Reduces readability and consistency.

---

## Additional Convention: JSDoc on Routing/Handler Logic

In API route modules and router factories:

- Add JSDoc to the router factory.
- Add JSDoc to each handler.
- Add JSDoc to business logic functions called by handlers.

✅ Example:

```ts
/**
 * Creates the seller router with all route handlers.
 */
export function createSellerRouter() {
  return {
    getSeller,
    updateSeller,
  };
}

/**
 * Handles retrieval of a seller by id.
 */
async function getSeller(request: Request) {
  const sellerId = new URL(request.url).searchParams.get("id");
  return fetchSellerById(sellerId);
}

/**
 * Fetches seller data from the data source.
 */
async function fetchSellerById(sellerId: string | null) {
  if (!sellerId) {
    throw new Error("sellerId is required");
  }

  return { id: sellerId, name: "Demo Seller" };
}
```
