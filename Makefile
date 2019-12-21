all: dist/fastads.html dist/fastads.js

dist/fastads.html: dist/fastads.js
	(/bin/echo -n "<script data-version=\"`head -n 1 $< | cut -d " " -f 2`\">"; tail -n -1 $<; /bin/echo "</script>") > $@

dist/fastads.js: src/index.js
	sed 's/module.exports.*$$/;fastads(global);/' src/index.js | npx babel -f .babelrc  | npx terser --compress --mangle -b beautify=false,preamble="'// @quintype/fastads@`node -pe 'require("./package.json").version'`'" -e global:window -o $@
