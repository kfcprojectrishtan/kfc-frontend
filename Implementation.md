# Implementation Guide: Clean URLs on GitHub Pages

This guide explains how to remove visible `.html` page names from your website URLs on **GitHub Pages** while keeping the website design, layout, styles, and content exactly the same.

## Goal

Make these pages open with clean professional URLs:

- `index.html` → `/`
- `adresses.html` → `/adresses/`
- `orders.html` → `/orders/`
- `register.html` → `/register/`

## Important Rules

- Do **not** change the design
- Do **not** change the layout
- Do **not** change styles
- Do **not** change content
- Do **not** create a new design
- Only update the file structure, internal links, and redirects

---

## 1. Keep the homepage file name the same

Keep the homepage as:

```text
index.html
```

Do **not** rename it.

GitHub Pages automatically serves `index.html` when someone opens:

```text
/
```

So the homepage file stays the same, but the visible URL becomes cleaner.

---

## 2. Change the file structure for other pages

To make other pages open without `.html`, move them into folders and rename them to `index.html` inside those folders.

### Current structure

```text
index.html
adresses.html
orders.html
register.html
```

### New structure

```text
index.html
adresses/
  index.html
orders/
  index.html
register/
  index.html
```

### What to do

- Move `adresses.html` to `adresses/index.html`
- Move `orders.html` to `orders/index.html`
- Move `register.html` to `register/index.html`

After this, GitHub Pages will open:

- `/adresses/`
- `/orders/`
- `/register/`

instead of showing `.html` in the browser.

---

## 3. Update all internal links

Search through the whole project and replace old `.html` links with clean URLs.

### Homepage

Replace:

```html
<a href="index.html">Home</a>
<a href="/index.html">Home</a>
```

With:

```html
<a href="/">Home</a>
```

### Adresses page

Replace:

```html
<a href="adresses.html">Adresses</a>
<a href="/adresses.html">Adresses</a>
```

With:

```html
<a href="/adresses/">Adresses</a>
```

### Orders page

Replace:

```html
<a href="orders.html">Orders</a>
<a href="/orders.html">Orders</a>
```

With:

```html
<a href="/orders/">Orders</a>
```

### Register page

Replace:

```html
<a href="register.html">Register</a>
<a href="/register.html">Register</a>
```

With:

```html
<a href="/register/">Register</a>
```

---

## 4. Update JavaScript redirects

If your project uses JavaScript navigation, replace all redirects that point to `.html` files.

### Homepage redirect

Replace:

```js
window.location.href = '/index.html';
location.href = '/index.html';
window.location.assign('/index.html');
```

With:

```js
window.location.href = '/';
location.href = '/';
window.location.assign('/');
```

### Adresses page redirect

Replace:

```js
window.location.href = '/adresses.html';
location.href = '/adresses.html';
window.location.assign('/adresses.html');
```

With:

```js
window.location.href = '/adresses/';
location.href = '/adresses/';
window.location.assign('/adresses/');
```

### Orders page redirect

Replace:

```js
window.location.href = '/orders.html';
location.href = '/orders.html';
window.location.assign('/orders.html');
```

With:

```js
window.location.href = '/orders/';
location.href = '/orders/';
window.location.assign('/orders/');
```

### Register page redirect

Replace:

```js
window.location.href = '/register.html';
location.href = '/register.html';
window.location.assign('/register.html');
```

With:

```js
window.location.href = '/register/';
location.href = '/register/';
window.location.assign('/register/');
```

---

## 5. Update logo, navbar, buttons, and menu links

Check these parts carefully:

- logo link
- navbar links
- footer links
- menu cards
- buttons
- JavaScript redirects
- any hidden navigation logic

Make sure they all use the clean URL format.

### Correct examples

```html
<a href="/">Home</a>
<a href="/adresses/">Adresses</a>
<a href="/orders/">Orders</a>
<a href="/register/">Register</a>
```

---

## 6. Add redirect scripts for old `.html` URLs

If someone opens an old direct link like `/orders.html`, you can automatically redirect them to the clean version.

Add these scripts inside the correct page files.

### In `index.html`

```html
<script>
  if (location.pathname.endsWith('/index.html')) {
    location.replace('/');
  }
</script>
```

### In `adresses/index.html`

```html
<script>
  if (location.pathname.endsWith('/adresses.html')) {
    location.replace('/adresses/');
  }
</script>
```

### In `orders/index.html`

```html
<script>
  if (location.pathname.endsWith('/orders.html')) {
    location.replace('/orders/');
  }
</script>
```

### In `register/index.html`

```html
<script>
  if (location.pathname.endsWith('/register.html')) {
    location.replace('/register/');
  }
</script>
```

Place the script either:

- inside `<head>`
- or before `</body>`

---

## 7. Example final structure

After implementation, the project should look like this:

```text
/index.html
/adresses/index.html
/orders/index.html
/register/index.html
/assets/...
/css/...
/js/...
/images/...
```

---

## 8. Final expected result

Users will see clean URLs like:

```text
https://yourdomain.com/
https://yourdomain.com/adresses/
https://yourdomain.com/orders/
https://yourdomain.com/register/
```

Instead of:

```text
https://yourdomain.com/index.html
https://yourdomain.com/adresses.html
https://yourdomain.com/orders.html
https://yourdomain.com/register.html
```

---

## 9. What must stay unchanged

These parts must remain exactly the same:

- design
- UI
- layout
- styles
- text/content
- components
- functionality not related to URLs

Only the following should change:

- file structure
- internal links
- redirects
- visible URL format

---

## 10. Quick summary

### Do this

- Keep `index.html`
- Move `adresses.html` → `adresses/index.html`
- Move `orders.html` → `orders/index.html`
- Move `register.html` → `register/index.html`
- Replace all `.html` internal links with clean URLs
- Update all JS redirects
- Add redirect scripts for old URLs

### Do not do this

- Do not rename homepage away from `index.html`
- Do not redesign the website
- Do not change content or styling

---

## 11. Note about naming

Your current file name is `adresses.html`, so the clean URL becomes:

```text
/adresses/
```

This will work technically.

However, the standard English spelling is:

```text
addresses
```

If you want a more professional English URL later, you can rename it to:

```text
/addresses/
```

But for now, if you want to keep everything consistent with the current project, keep using:

```text
/adresses/
```

---

## 12. Ready-to-use instruction for implementation

Use this exact instruction:

> Keep the homepage file as `index.html`. Move `adresses.html` to `adresses/index.html`, `orders.html` to `orders/index.html`, and `register.html` to `register/index.html`. Then update all internal links, buttons, navbar links, logo links, and JavaScript redirects so they use `/`, `/adresses/`, `/orders/`, and `/register/` instead of `.html` URLs. Add redirect scripts so old `.html` URLs automatically redirect to the clean versions. Do not change the design, layout, styles, or content.

