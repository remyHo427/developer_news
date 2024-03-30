SCRIPT_MAIN=./scripts/main.mjs

make:
	node $(SCRIPT_MAIN) build

run:
	node $(SCRIPT_MAIN) build
	node $(SCRIPT_MAIN) build --watch & \
	node ./dist/out.cjs && \
	kill $!

clean:
	rm -rf ./dist