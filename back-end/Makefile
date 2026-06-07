PY?=python3
PROTO_PATH:=../protos
PROTO_FILES:=$(PROTO_PATH)/*.proto
OUTPUT_PATH:=./src/handler/protos

.PHONY: test
test: itest utest
	date

.PHONY: typecheck
typecheck:
	npx --yes pyright --project pyrightconfig.json

.PHONY: itest
itest:
	PYTHONPATH=./src $(PY) -m pytest -q ./tests/itest/

.PHONY: utest
utest:
	$(PY) -m unittest discover -v -s "./src" -p "*_test.py"

.PHONY: gen-proto
gen-proto:
	$(PY) -m grpc_tools.protoc -I ../protos -I ../third_party/googleapis -I ../third_party/protobuf/src --python_out=$(OUTPUT_PATH) --grpc_python_out=$(OUTPUT_PATH) --mypy_out=$(OUTPUT_PATH) $(PROTO_FILES)
	# A workaround due to https://github.com/protocolbuffers/protobuf/issues/1491
	sed -E 's/^import (.*_pb2.*)/from . import \1/' $(OUTPUT_PATH)/san11_platform_pb2_grpc.py > /tmp/san11_platform_pb2_grpc.py
	mv /tmp/san11_platform_pb2_grpc.py $(OUTPUT_PATH)/san11_platform_pb2_grpc.py
