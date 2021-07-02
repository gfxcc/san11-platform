.PHONY: regen

PROTO_PATH:=../protos
PROTO_FILES:=$(PROTO_PATH)/*.proto
OUTPUT_PATH:=./handler/src/lib/protos


regen:
	python3 -m grpc_tools.protoc -I$(PROTO_PATH) --python_out=$(OUTPUT_PATH) --grpc_python_out=$(OUTPUT_PATH) $(PROTO_FILES)
	# A workaround due to https://github.com/protocolbuffers/protobuf/issues/1491
	gsed -i -E 's/^import.*_pb2/from . \0/' $(OUTPUT_PATH)/*.py

.PHONY: test
test:
	python3 tests/rpc-client.py