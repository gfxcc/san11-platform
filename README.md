# [san11-platform](https://san11pk.org)
A web platform to share San11 related tools

![End-to-End System Architecture](resources/images/architecture_diagram.png)

# Usage

## Prepare VM environment (ubuntu)

### Install Dependencies

1. Follow https://docs.docker.com/engine/install/ubuntu/#installation-methods to install docker.

2. Grant permission to current user
```sh
sudo systemctl start docker
sudo usermod -aG docker ${USER}
# apply group membership changes immediately
newgrp docker
```

## Start services
```sh
cd san11-platform
make deploy-prod
```

# Development

## Start backend & frontend
```sh
cd san11-platform

make deploy-dev
```

## Tests
```sh
make test
```

## Architecture notes

- [Resource model](playbook/resource-model.md): explains how a resource exists
  as storage state, in-memory backend state, and external protobuf/API state.

## Production auto-deploy

Merges to `main` are deployed by GitHub Actions after `make test` passes. The
workflow SSHes into the production VM, updates the repo, and runs the existing
`make deploy-prod` target.

Configure these GitHub repository secrets before enabling production deploys:

- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_DEPLOY_SERVICE_ACCOUNT`
- `GCP_PROJECT_ID`
- `GCP_ZONE`
- `GCP_PROD_INSTANCE`
- `GCP_PROD_SSH_USER`
- `GCP_PROD_REPO_PATH`

The deploy service account must be allowed to authenticate through the Workload
Identity Provider and must have enough Compute Engine IAM permission to SSH to
the production VM. If the VM uses OS Login, grant the identity access to log in
to the VM; if it uses metadata SSH keys, grant the permissions required for
`gcloud compute ssh` to write SSH metadata.

## [Non-prod Environment](https://github.com/gfxcc/san11-platform/blob/main/dev-logs/nonprod-envs.md)

### Staging
```sh
make deploy-staging
```

### Autopush
```sh
make deploy-autopush
```
