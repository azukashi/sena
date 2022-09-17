# Sena (セナ)\*

Node.js-based CDN (Content Delivery Network) server for images.

## Development

### Create env variables

```bash
# Linux/macOS
$ cp .env.example .env
```

### Install dependencies

```bash
$ pnpm install
```

### Serve in production server

```bash
$ pnpm start
```

## Authentication

As defined in [.env.example](./.env.example), default username & password used to login is\*

```
Username: admin0
Password: admin0
```

\*: These auth info can't be used on [Live-version app](https://falcxxdev.alwaysdata.net).

## Notes

This is a very simple image uploading website. Authentication login style is simple with a dialog from the browser, and only has "+" button on the dashboard for uploading images. Also, username & password used for login is still stored in `.env` file and this does not secure. However, i will start using databases when i have times & improving things.

\*: App name is inspired from Blue Archive's character: Himuro Sena (氷室 セナ)
