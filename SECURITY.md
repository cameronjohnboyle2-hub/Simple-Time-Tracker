# Security boundary

The shipped application is an open, fictional demonstration. Selecting worker/admin views is navigation, not an authentication claim. It has no operational backend, credentials, or cloud account connection.

All runtime assets live in `public/`. Its Content Security Policy sets `connect-src 'none'`, `worker-src 'none'`, and `form-action 'none'`. Browser requests for the page and its same-origin static modules/styles are still expected. There is no service-worker registration, Firebase SDK, remote-data listener, or external CDN dependency.

Demo changes use a new local-storage namespace; the app never loads the old operational state key. Stored values are unencrypted, so only fictional inputs are appropriate. Reset replaces demo records. Browser-language preferences are also local. Stored-state projection removes credentials and rejects malformed IDs/dates before rendering; user-visible names and notes are escaped or rendered with text nodes.

The development server binds `127.0.0.1` and serves only `public/`, checks decoded paths and resolved filesystem boundaries, rejects non-read methods, and sends additional response headers. GitHub Pages receives only that directory, with its HTML-level Content Security Policy. The local server's extra headers are not a claim about Pages response headers.

Production use requires a separate authentication and authorization design enforced by the backend, with synthetic denial tests and deployment verification. The demo's open view selector does not grant a production role. Its local behavior is not a validation of any external application's database configuration.

For a security concern, use a private channel already established with the maintainer. Do not post real worker records, credential values, or production exports in a public issue.
