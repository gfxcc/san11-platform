UUID := $(shell uuidgen)
TMP_DIR := /tmp/san11pk-platform-test
test: export TMP_DB_DATA=/tmp/san11pk-platform-test/$(UUID)
 
.PHONY: test
test: cleanup
	mkdir -p $(TMP_DB_DATA)
	docker-compose -f docker-compose.test.yaml run --rm sut

.PHONY: cleanup
cleanup:
	rm -rf ${TMP_DIR}
	# Removes any residues from previous test.
	docker-compose -f docker-compose.test.yaml down

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
