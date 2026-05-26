UUID := $(shell uuidgen)
TMP_DIR := /tmp/san11pk-platform-test
.DEFAULT_GOAL := help
test: export TMP_DB_DATA=/tmp/san11pk-platform-test/$(UUID)

.PHONY: help
help:
	@echo "Available targets:"
	@echo ""
	@echo "General:"
	@echo "  help              Show this help message (default)"
	@echo "  test              Run test suite in Docker (uses docker-compose.test.yaml)"
	@echo "  verify           Run backend, frontend, gateway, and UI release gates"
	@echo "  verify-backend   Run Python unit and integration tests"
	@echo "  verify-frontend  Build the Angular frontend"
	@echo "  verify-gateway   Compile/test the Go gateway"
	@echo "  verify-ui        Start dev stack and run Playwright CUJ tests"
	@echo "  verify-ui-rebuild Rebuild dev stack and run Playwright CUJ tests"
	@echo "  cleanup           Clean test temp data and stop test containers"
	@echo "  fetch-local-ca    Copy Caddy local root CA cert from front-end container"
	@echo ""
	@echo "Codegen:"
	@echo "  gen-proto         Generate protobuf files for back-end and front-end"
	@echo "  gen-gateway       Generate gateway stubs via buf"
	@echo ""
	@echo "Prod:"
	@echo "  build-prod        Build production images"
	@echo "  up-prod           Start production stack"
	@echo "  down-prod         Stop production stack"
	@echo "  deploy-prod       Rebuild and restart production stack"
	@echo ""
	@echo "Staging:"
	@echo "  build-staging     Build staging images"
	@echo "  up-staging        Start staging stack"
	@echo "  down-staging      Stop staging stack"
	@echo "  deploy-staging    Rebuild and restart staging stack"
	@echo ""
	@echo "Autopush:"
	@echo "  build-autopush    Build autopush images"
	@echo "  up-autopush       Start autopush stack"
	@echo "  down-autopush     Stop autopush stack"
	@echo "  deploy-autopush   Rebuild and restart autopush stack"
	@echo ""
	@echo "Dev:"
	@echo "  build-dev         Build development images"
	@echo "  up-dev            Start development stack"
	@echo "  deploy-dev        Build and start development stack"

.PHONY: test
test: cleanup
	mkdir -p $(TMP_DB_DATA)
	docker compose -f docker-compose.test.yaml run --rm sut

.PHONY: verify
verify: verify-backend verify-frontend verify-gateway verify-ui

.PHONY: verify-backend
verify-backend:
	cd back-end && make utest itest

.PHONY: verify-frontend
verify-frontend:
	cd front-end && npm run build

.PHONY: verify-gateway
verify-gateway:
	cd back-end/gateway && GOCACHE=/tmp/san11-go-build-cache go test ./...

.PHONY: verify-ui
verify-ui:
	docker compose -f compose.yaml -f compose.dev.yaml up -d
	cd front-end && npm run e2e:playwright

.PHONY: verify-ui-rebuild
verify-ui-rebuild:
	docker compose -f compose.yaml -f compose.dev.yaml up -d --build
	cd front-end && npm run e2e:playwright

.PHONY: cleanup
cleanup:
	rm -rf ${TMP_DIR}
	# Removes any residues from previous test.
	docker compose -f docker-compose.test.yaml down

.PHONY: gen-proto
gen-proto:
	cd back-end && make gen-proto
	cd front-end && npm run proto:generate

.PHONY: gen-gateway
gen-gateway:
	cd protos && buf generate
	# protoc -I ./protos -I third_party/googleapis -I third_party/protobuf  \
    # 		--go_out ./back-end/gateway/gen/go/ --go_opt paths=source_relative \
    # 		--go-grpc_out ./back-end/gateway/gen/go/ --go-grpc_opt paths=source_relative \
    # 		./protos/*.proto

# prod deployment
.PHONY: build-prod
build-prod:
	docker compose -f compose.yaml -f compose.prod.yaml build

.PHONY: up-prod
up-prod:
	docker compose -f compose.yaml -f compose.prod.yaml up -d

.PHONY: down-prod
down-prod:
	docker compose -f compose.yaml -f compose.prod.yaml down

.PHONY: deploy-prod
deploy-prod: down-prod build-prod up-prod

# Staging deployment
.PHONY: build-staging
build-staging:
	docker compose -f compose.yaml -f compose.staging.yaml build

.PHONY: up-staging
up-staging:
	docker compose -f compose.yaml -f compose.staging.yaml up

.PHONY: down-staging
down-staging:
	docker compose -f compose.yaml -f compose.staging.yaml down

.PHONY: deploy-staging
deploy-staging: down-staging build-staging up-staging

# Autopush deployment
.PHONY: build-autopush
build-autopush:
	docker compose -f compose.yaml -f compose.autopush.yaml build

.PHONY: up-autopush
up-autopush:
	docker compose -f compose.yaml -f compose.autopush.yaml up

.PHONY: down-autopush
down-autopush:
	docker compose -f compose.yaml -f compose.autopush.yaml down

.PHONY: deploy-autopush
deploy-autopush: down-autopush build-autopush up-autopush

# Dev deployment
.PHONY: build-dev
build-dev:
	docker compose -f compose.yaml -f compose.dev.yaml build

.PHONY: up-dev
up-dev:
	docker compose -f compose.yaml -f compose.dev.yaml up

.PHONY: deploy-dev
deploy-dev: build-dev up-dev


# For development
.PHONY: fetch-local-ca
fetch-local-ca:
	mkdir -p tmp
	docker cp san11-platform-front-end-1:/data/caddy/pki/authorities/local/root.crt tmp/local-ca-cert.pem
	@echo "Certificate saved to tmp/local-ca-cert.pem"
