PY=python3.8
PROTO_PATH:=../protos
PROTO_FILES:=$(PROTO_PATH)/*.proto
OUTPUT_PATH:=./src/handler/protos

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

.PHONY: regen
regen:
	$(PY) -m grpc_tools.protoc -I$(PROTO_PATH) --python_out=$(OUTPUT_PATH) --grpc_python_out=$(OUTPUT_PATH) --mypy_out=$(OUTPUT_PATH) $(PROTO_FILES)
	# A workaround due to https://github.com/protocolbuffers/protobuf/issues/1491
	gsed -i -E 's/^import.*_pb2/from . \0/' $(OUTPUT_PATH)/*.py
