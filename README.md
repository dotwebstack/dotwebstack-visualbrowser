# dotwebstack-visualbrowser
A javascript library for visual browsing of data on the web

## build & run (in local browser)

```
npm install

npm run build

npm start
```

The demo is available via http://localhost:8080

## usage (locally)

Copy all the files in the /build directory and put these files in the root of a local webserver

## Roadmap

The current version of this library is a clone of the original LDT library and not according to the latest standards with regard to javascript programming. It should be rebuild:

- Restructering of the code, multiple source files
- Remove the dependency of jquery
- Remove the CSS dependency of bootstrap
- Add D3 as a regular imported dependency, not a separate source file
- Remove DIV's in the html code (it should be created dynamically as part of the initialization fase of the diagram)

Functionally some extra features are already identified:
- Add separate configuration, based on JSON or JSON-LD code
- "Dancing" of nodes should be configurable
- Recollapse of items
- Visualizing the whole graph, not only the centre subject

## External dependencies:

(should be part of npm dependency config, see roadmap)

- D3 version 3: http://d3js.org/d3.v3.min.js
- JQuery: https://code.jquery.com/jquery-3.1.1.min.js
- Bootstrap: https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css
- Bootstrap glyph icons: https://github.com/twbs/bootstrap/raw/master/fonts/glyphicons-halflings-regular.*
- JSON-LD: https://cdn.jsdelivr.net/npm/jsonld@1.0.1/dist/jsonld.min.js
