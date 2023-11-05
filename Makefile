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