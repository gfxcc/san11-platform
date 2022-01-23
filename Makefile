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

.PHONY: regen
regen:
	cd back-end && make regen
	cd front-end && npm run proto:generate