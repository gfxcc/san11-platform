# Non-prod Environments

## Staging Environments

### Purpose

The staging environment is designed to test large-scale architecture and environment changes before they are released to production. This includes:

* Serving the UI via a server like Nginx or Caddy instead of using `ng serve`
* Adopting Caddy for HTTPS management

The development environment is intentionally different from the production environment to optimize development speed and usability. For example:

* Using `http` endpoints to simplify environment setup
* Serving `html` content via `ng serve` to enable immediate code rebuilds

The staging environment allows verification of changes in a production-like setting.

## Autopush Environment

`localhost` is used in `autopush` env to test changes locally.

The drawback of using `localhost` is 
* the need to manually install the local CA certificate.

### Locate the local root CA certificate

```sh
make fetch-local-ca
```
