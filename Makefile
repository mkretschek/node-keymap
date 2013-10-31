
lint: 
	jshint ./lib
	jshint ./test

test:
	mocha --recursive --reporter dot --ui bdd ./test

.PHONY: lint test
