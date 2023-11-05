PY=python3.8
PROTO_PATH:=../protos
PROTO_FILES:=$(PROTO_PATH)/*.proto
OUTPUT_PATH:=./src/handler/protos

UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Linux)
	SED := sed
endif
ifeq ($(UNAME_S),Darwin)
	SED := gsed
endif

.PHONY: test
test: itest utest
	date

.PHONY: itest
itest:
	date
	# $(PY) -m pytest ./tests/itest/

.PHONY: utest
utest:
	cd src && $(PY) -m pytest .

.PHONY: gen-proto
gen-proto:
	$(PY) -m grpc_tools.protoc -I ../protos -I ../third_party/googleapis -I ../third_party/protobuf/src --python_out=$(OUTPUT_PATH) --grpc_python_out=$(OUTPUT_PATH) --mypy_out=$(OUTPUT_PATH) $(PROTO_FILES)
	# A workaround due to https://github.com/protocolbuffers/protobuf/issues/1491
	$(SED) -E 's/^import.*_pb2/from . \0/' $(OUTPUT_PATH)/san11_platform_pb2_grpc.py > /tmp/san11_platform_pb2_grpc.py
	mv /tmp/san11_platform_pb2_grpc.py $(OUTPUT_PATH)/san11_platform_pb2_grpc.py
