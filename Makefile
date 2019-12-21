dist/fastads.js: src/index.js
	sed 's/module.exports.*$$/;fastads(global);/' src/index.js | npx babel -f .babelrc  | npx terser --compress --mangle -b beautify=false,preamble="'// @quintype/fastads@`node -pe 'require("./package.json").version'`'" -e global:window -o $@
