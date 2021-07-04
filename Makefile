test: export TMP_DIR=/tmp/san11pk-platform-test/$(shell uuidgen)
 
.PHONY: test
test:
	mkdir $(TMP_DIR) && \
	 	docker-compose -f docker-compose.test.yaml run sut
