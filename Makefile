dist/output.js: src/index.js
	npx babel src/index.js | npx terser --compress --mangle -b beautify=false,preamble="'// @quintype/fastads@`node -pe 'require("./package.json").version'`'" -o $@
