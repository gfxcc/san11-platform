# Staging Environment

## Purpose

The staging environment is designed to test large-scale architecture and environment changes before they are released to production. This includes:

* Serving the UI via a server like Nginx or Caddy instead of using `ng serve`
* Adopting Caddy for HTTPS management

The development environment is intentionally different from the production environment to optimize development speed and usability. For example:

* Using `http` endpoints to simplify environment setup
* Serving `html` content via `ng serve` to enable immediate code rebuilds

The staging environment allows verification of changes in a production-like setting.

## Design Decisions

### Localhost Usage

`localhost` is used to quickly build this environment. Compared to a public endpoint like `staging.my-domain.com`, `localhost` can be tested locally. Otherwise, development would need to be done on a remote machine serving as `staging.my-domain.com`, or frequent `git` operations would be required.

The drawback of using `localhost` is the need to manually install the local CA certificate.

In the long term, a public endpoint like `staging.my-domain.com` should be preferred.
