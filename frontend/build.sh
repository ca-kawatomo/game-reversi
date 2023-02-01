rm -fr dist
parcel build src/index.html --no-minify
rm -fr dist/.auth
html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype dist/index.html -o dist/index.html
npx ts-node minify.js
rm dist/*.map