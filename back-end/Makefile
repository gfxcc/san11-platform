.PHONY: regen
regen:
	python3 -m grpc_tools.protoc -I../protos --python_out=./src/lib/protos --grpc_python_out=./src/lib/protos ../protos/*.proto


.PHONY: test
test:
	python3 tests/rpc-client.py