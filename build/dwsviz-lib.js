var RDFViz =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if (!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./src/diagramglobal.js":
/*!******************************!*\
  !*** ./src/diagramglobal.js ***!
  \******************************/
/*! exports provided: initGraph, togglefullscreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initGraph", function() { return initGraph; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "togglefullscreen", function() { return togglefullscreen; });
var jsonApiSubject, jsonApiIDSubject, jsonApiCall, uriEndpoint, fragments;

var width = $("#graph").width(),
    height = 500,//$("#graph").height(),
	aspect = height/width;

//Maximum number of nodes allowed before links and nodes are aggregated
var maxNodes = 4;

//Regex expression for creation label from URI
var regexLabelFromURI = new RegExp("(.+)[#|/]([^/]+)$","g");

//Some key constants
var idKey = "@id";
var elmoStyle = "http://bp4mc2.org/elmo/def#style";
var elmoName = "http://bp4mc2.org/elmo/def#name";
var rdfsLabel = "http://www.w3.org/2000/01/rdf-schema#label";
var htmlImage = "http://www.w3.org/1999/xhtml/vocab#img"

//Full screen toggle
var fullScreenFlag = false;

// zoom features
var zoom = d3.behavior.zoom()
	.scaleExtent([0.1,10])
	.on("zoom",zoomed);

// svg graph on the body
var svg = d3.select("#graph").append("svg")
    .attr("width", "100%")
    .attr("height", "500")
	.attr("overflow", "hidden")
	.append("g")
		.call(zoom)
		.on("dblclick.zoom",null);

// detailbox div
var detailBox = d3.select("#graphtitle");

// propertybox div
var pt = document.getElementsByTagName('svg')[0].createSVGPoint();
var propertyBox = d3.select("#propertybox");
var infoBox = propertyBox.append("div");
infoBox.attr("class","infobox");
var propertyNode = null;
var infoNode = null;
var propertyBoxVisible = false;

//Rectangle area for panning
var rect = svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
	.attr("class","canvas");

//Container that holds all the graphical elements
var container = svg.append("g");

//Flag for IE10 and IE11 bug: SVG edges are not showing when redrawn
var bugIE = ((navigator.appVersion.indexOf("rv:11")!=-1) || (navigator.appVersion.indexOf("MSIE 10")!=-1));

//Arrowhead definition
//(All other endpoints should be defined in this section)
container.append('defs').selectAll('marker')
        .data(['end'])
      .enter().append('marker')
        .attr('id'          , 'ArrowHead')
        .attr('viewBox'     , '0 -5 10 10')
        .attr('refX'        , 10)
        .attr('refY'        , 0)
        .attr('markerWidth' , 6)
        .attr('markerHeight', 6)
        .attr('orient'      , 'auto')
      .append('path')
        .attr('d', 'M0,-5L10,0L0,5');

//Force definition
var force = d3.layout.force()
    .gravity(0)
    .distance(150)
    .charge(-200)
    .size([width, height])
	.on("tick",tick);

//Initialising selection of graphical elements
//allLinks = all the current visible links
//allNodes = all the current visible nodes
//AllNodes and AllLinks are used within the tick function
//root holds all data, even data that has been made invisible
var allLinks = container.selectAll(".link"),
	allNodes = container.selectAll(".node"),
	nodeMap = {},
	linkMap = {},
	root = {},
	currentNode = null,
  elmoStyles = [];

//Fetch data via Ajax-call and process (ask for json-ld)
function initGraph(_jsonApiSubject, _jsonApiIDSubject, _jsonApiCall, _uriEndpoint, _fragments) {

  jsonApiSubject = _jsonApiSubject;
  jsonApiIDSubject = _jsonApiIDSubject;
  jsonApiCall = _jsonApiCall;
  uriEndpoint = _uriEndpoint;
  fragments = _fragments;

  d3.xhr(jsonApiCall+encodeURIComponent(jsonApiSubject),"application/ld+json", function(error, xhr) {

    //Parse xhr as if it was json, and expand (lose context)
    jsonld.expand(JSON.parse(xhr.responseText),function (err, json) {
      if (!err) {

        //Stijlen ophalen
        json.forEach(function(resource) {
          var found = false;
          if (elmoName in resource) {
            elmoStyles[resource["@id"]]=resource[elmoName][0]["@value"]
          }
        });

        var availableNodes = {};
        json.forEach(function(x) { availableNodes[x[idKey]] = x; });

        root.nodes = [];

        //Find subject and insert (startingpoint = middle of screen)
        var subject = json.filter(function(r) {return (r[idKey]===jsonApiSubject)})[0];
        if (!subject) {
          subject = json.filter(function(r) {return (r[idKey]===jsonApiIDSubject)})[0];
        }
        if (!subject) {
          subject = json[0];
        }
        addNode(subject,width/2,height/2);

        //Add nodes that are linked from the subject and available
        for (var property in subject) {
          if (property!==idKey && property!==elmoStyle) {
            for (var objectindex in subject[property]) {
              if (availableNodes[subject[property][objectindex][idKey]]) {
                if (!nodeMap[subject[property][objectindex][idKey]]) {
                  addNode(availableNodes[subject[property][objectindex][idKey]],width/2,height/2);
                }
              }
            }
          }
        }
        //Add nodes that have the subject as target (duplicates will be filtered out by addNode function)
        json.forEach(function(resource) {
          var found = false;
          for (var property in resource) {
            if (property!=idKey && property!=elmoStyle) {
              for (var objectindex in resource[property]) {
                if (resource[property][objectindex][idKey]===jsonApiSubject) {
                  found = true;
                }
              }
            }
          }
          if (found) {
            addNode(resource,width/2,height/2);
          }
        });

        //Update and get links
        root.links = [];
        json.forEach(function(resource) {
          for (var property in resource) {
            // Only display items that are uri's and exists as nodes
            if (property!==idKey && property!==elmoStyle) {
              for (objectindex in resource[property]) {
                if (nodeMap[resource[property][objectindex][idKey]]) {
                  var label = property.replace(regexLabelFromURI,"$2");
                  var propertyUri = property;//getFullUri(property,json["@context"]);
                  if (availableNodes[propertyUri]) {
                    if (availableNodes[propertyUri][rdfsLabel]) {
                      label = availableNodes[propertyUri][rdfsLabel][0]["@value"];
                    }
                  }
                  addLink(resource[idKey],resource[property][objectindex][idKey],property,label);
                }
              }
            }
          };
        });

        //Set first node to fixed
        root.nodes[0].fixed = true;
        root.nodes[0].expanded = true;
        updateTitle(root.nodes[0]);

        //Create network
        root.links.forEach(function(l) {
          l.source.outLinks[l.uri] = l.source.outLinks[l.uri] || [];
          l.source.outLinks[l.uri].push(l);
          l.source.linkCount++;
          l.source.parentLink = l;
          l.target.inLinks[l.uri] = l.target.inLinks[l.uri] || [];
          l.target.inLinks[l.uri].push(l);
          l.target.linkCount++;
          l.target.parentLink = l;
        });

        createAggregateNodes();
        update();

      };
    });

  });
}

function addNode(resource,x,y) {

  //Only add a node if it doesn't exists already
  if (!nodeMap[resource[idKey]]) {

    var nodeClass = "";
    if (resource[elmoStyle]) {
      if (elmoStyles[resource[elmoStyle][0][idKey]]) {
        nodeClass = elmoStyles[resource[elmoStyle][0][idKey]];
      }
    }
    var nodeLabel = resource[idKey];
    if (resource[rdfsLabel]) {
      nodeLabel = resource[rdfsLabel][0]["@value"];
    }
    var nodeData = {};
    for (var property in resource) {
      if (property!==idKey && property!=rdfsLabel && (resource[property][0]["@value"])) {
        nodeData[property]=resource[property][0]["@value"];
      }
    }
    var node = {"@id":resource[idKey]
        ,"label":nodeLabel
        ,"class":nodeClass
        ,"data": nodeData
        ,"elementType": "rect"
        };
    if (resource[htmlImage]) {
      node.img = resource[htmlImage][0]["@value"];
      node.elementType = "image";
    }
    root.nodes.push(node);
    nodeMap[resource[idKey]] = node;

    // startingpoint of new node
    node.x = x;
    node.y = y;
    //Create network: initialize new node
    node.inLinks = {};
    node.outLinks = {};
    node.linkCount = 0;
    node.parentLink;
  }

}

function addLink(sourceUri,targetUri,propertyUri,propertyLabel) {

  if (linkMap[sourceUri+targetUri]) {
    //Link already exists, add label to existing link
    linkMap[sourceUri+targetUri].label+= ", "+propertyLabel;
    return linkMap[sourceUri+targetUri]
  } else {
    //New link
    var l = {"id":sourceUri+targetUri
            ,"source":nodeMap[sourceUri]
            ,"target":nodeMap[targetUri]
            ,"uri":propertyUri
            ,"label":propertyLabel
            };
    linkMap[l.id]=l;
    root.links.push(l);
    return l;
  }

}

function movePropertyBox() {
	if (propertyBoxVisible && propertyNode) {
		if (propertyNode.arect) {
			propertyBox.style("display","block");
			//Get absolute position
			var matrix  = propertyNode.arect.getScreenCTM();
			if (propertyNode.arect.nodeName==='rect') {
				pt.x = propertyNode.arect.x.animVal.value+propertyNode.arect.width.animVal.value;
				pt.y = propertyNode.arect.y.animVal.value;
			}
			if (propertyNode.arect.nodeName==='circle') {
				pt.x = propertyNode.arect.cx.animVal.value+propertyNode.arect.r.animVal.value;
				pt.y = propertyNode.arect.cy.animVal.value-propertyNode.arect.r.animVal.value;
			}
			var divrect = pt.matrixTransform(matrix);
			//Correct for offset and scroll
			var theX = divrect.x-$('#graphcanvas').offset().left+$(window).scrollLeft();
			var theY = divrect.y-$('#graphcanvas').offset().top+$(window).scrollTop();
			//Set position
			propertyBox.style("left",theX+"px");
			propertyBox.style("top",theY+"px");
		}
	}
}

function mouseoverNode(d) {
	if (!propertyBoxVisible) {
		propertyNode = d;
		propertyBoxVisible = true;
		movePropertyBox();
		if (infoNode!=propertyNode) {
			var html='';
			infoBox.html(html);
		}
	}
}

function mouseoutNode(d) {
	if (propertyBoxVisible) {
		propertyBoxVisible = false;
		propertyBox.style("display","none");
		if (infoNode!=propertyNode) {
			var html='';
			infoBox.html(html);
		}
	}
}

function mouseoverPropertyBox() {
	if (!propertyBoxVisible) {
		propertyBox.style("display","block");
		propertyBoxVisible = true;
	}
}

function mouseoutPropertyBox() {
	propertyBox.style("display","none");
	propertyBoxVisible = false;
	if (infoNode!=propertyNode) {
		var html='';
		infoBox.html(html);
	}
}

function createAggregateNodes() {

	//Add an aggregateNode for any node that has more than maxNodes outgoing OR ingoing links
	root.nodes.forEach(function(n) {
		if (!n.aggregateNode) {
			Object.getOwnPropertyNames(n.outLinks).forEach(function(prop) {
				var d = n.outLinks[prop];
				if (d.length>=maxNodes) {
					if (!nodeMap[n["@id"]+d[0].uri]) {
						var aNode = {"@id":n["@id"]+d[0].uri,data:{},label:d[0].label,uri:d[0].uri,elementType:"circle",aggregateNode:true,inbound:false,count:d.length,links:d};
						root.nodes.push(aNode);
						root.links.push({id:n["@id"]+d[0].uri,source:n,target:aNode,label:d[0].label,uri:d[0].uri});
						nodeMap[aNode["@id"]]=aNode;
					}
				}
			});
			Object.getOwnPropertyNames(n.inLinks).forEach(function(prop) {
				var d = n.inLinks[prop];
				if (d.length>=maxNodes) {
					if (!nodeMap[n["@id"]+d[0].uri]) {
						var aNode = {"@id":n["@id"]+d[0].uri,data:{},label:d[0].label,uri:d[0].uri,elementType:"circle",aggregateNode:true,inbound:true,count:d.length,links:d};
						root.nodes.push(aNode);
						root.links.push({id:n["@id"]+d[0].uri,source:aNode,target:n,label:d[0].label,uri:d[0].uri});
						nodeMap[aNode["@id"]]=aNode;
					}
				}
			});
		}
	});
	//Do a recount of number of connections
	//(count is number of connections minus the connections that remain visible
	root.nodes.forEach(function(n) {
		if (n.aggregateNode) {
			n.count = n.links.filter(function(d) {return ((d.target.linkCount<=1) || (d.source.linkCount<=1))}).length;
		}
	});
}

var node_drag = d3.behavior.drag()
	.on("dragstart", dragstart)
	.on("drag", dragmove)
	.on("dragend", dragend);

function updateTitle(d) {
	var html = '<h3 class="panel-title"><a style="font-size:16px" href="'+uriEndpoint+encodeURIComponent(d['@id'])+'"><span class="glyphicon glyphicon-new-window"/></a> '+d.label;
	if (!d.expanded) {
		html+=' <a onclick="expand();" class="badge" style="font-size:12px">';
		if (d.data['count']) {
			html+=d.data['count']
		};
		html+='<span class="glyphicon glyphicon-zoom-in"/></a>';
	}
	html+='<span class="glyphicon glyphicon-fullscreen" style="position:absolute;right:10px;margin-top:10px;cursor:pointer" onclick="RDFViz.togglefullscreen()"/>';
	html+='</h3>';
	detailBox.html(html);
}

function togglefullscreen() {
	if (fullScreenFlag) {
		$('#graphcanvas').css({position:'relative',left:'',top:'',width:'',height:'',zIndex:''});
		//d3.select('#graphcanvas').setAttribute("style","relative");
	} else {
		$('#graphcanvas').css({position:'absolute',left:0,top:0,width: $(window).width(), height: $(window).height(), zIndex: 1000});
		//d3.select('#graphcanvas').setAttribute("style","position:absolute;left:0;top:0;width:100%;height:100%");
		d3.select("#graph").select("svg").attr("height",$(window).height()-100);
	}
	fullScreenFlag = !fullScreenFlag;
}

function dragstart(d) {
	d3.event.sourceEvent.stopPropagation();
	force.stop();
	currentNode = d;
	updateTitle(d);
}
function dragmove(d) {
	d.px += d3.event.dx;
	d.py += d3.event.dy;
	d.x += d3.event.dx;
	d.y += d3.event.dy;
	tick();
}
function dragend(d) {
	d.fixed = true;
	tick();
	force.resume();
}

function zoomed() {
	container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function update() {

	//Keep only the visible nodes
	var nodes = root.nodes.filter(function(d) {
		return d.aggregateNode ? (!d.expanded) && (d.count>0) : ((d.linkCount>1) || ((d.parentLink.source.outLinks[d.parentLink.uri].length < maxNodes) && (d.parentLink.target.inLinks[d.parentLink.uri].length < maxNodes)))
	});
	var links = root.links;
	//Keep only the visible links
	links = root.links.filter(function(d) {
		return d.source.aggregateNode ? (!d.source.expanded) && (d.source.count>0) : d.target.aggregateNode ? (!d.target.expanded) && (d.target.count>0) : (((d.source.linkCount>1) && (d.target.linkCount>1)) || ((d.source.outLinks[d.uri].length < maxNodes) && (d.target.inLinks[d.uri].length < maxNodes)))
	});

	// Update the links
	allLinks = allLinks.data(links,function(d) {return d.id});

	// Exit any old links.
	allLinks.exit().remove();

	// Enter any new links.
	var newLinks = allLinks
		.enter().append("g")
		.attr("class", function(d) { return "link"+(d.source["class"] ? " t"+d.source["class"] : "")+(d.target["class"] ? " t"+d.target["class"] : "") });

	newLinks.append("line")
		.attr("class","border")
	newLinks.append("line")
		.style("marker-end", "url(#ArrowHead)")
		.attr("class","stroke");
	newLinks.append("text")
		.attr("dx", 0)
		.attr("dy", 0)
		.attr("text-anchor", "middle")
		.attr("class","stroke-text")
		.text(function(d) { return d.label });

	// Update the nodes
	allNodes = allNodes.data(nodes,function(d) {return d["@id"]});

	// Update text (count of an aggregateNode might change)
	allNodes.select("text").text(function(d) { return d.aggregateNode ? d.count : d.label });

	// Exit any old nodes.
	allNodes.exit().remove();

	// Enter any new nodes.
	var newNodes = allNodes
		.enter().append("g")
		.attr("class", function(d) { return (d["class"] ? "node t"+d["class"] : "node")})
		.on("mouseover",mouseoverNode)
		.on("mouseout",mouseoutNode)
		.call(node_drag);

  newNodes.append("text")
		.attr("dx", 0)
		.attr("dy", function(d) {return d.elementType==="image" ? 40 : 0})
		.attr("text-anchor", "middle")
		.attr("class","node-text")
		.text(function(d) { return d.aggregateNode ? d.count : d.label })
		.each(function(d) {d.rect = this.getBBox();	d.rect.y = d.rect.y - (d.elementType==="image" ? 40 : 0);});

  newNodes.filter(function(d) {return d.elementType==="image"}).append("circle")
    .attr("cx", function(d) { return d.rect.x+d.rect.width/2})
    .attr("cy", function(d) { return d.rect.y+d.rect.height/2+4})
    .attr("r", function(d) { return 30 })
    .attr("class", function(d) { return (d["class"] ? "s"+d["class"] : "default") });
  newNodes.filter(function(d) {return d.elementType==="image"}).append("defs").append("pattern")
    .attr("id", function(d) { return "pattern_" + d["@id"]})
    .attr("x", "0%")
    .attr("y", "0%")
    .attr("viewBox","0 0 100 100")
    .attr("width", "100%")
    .attr("height", "100%")
    .append("image")
      .attr("x","0%")
      .attr("y","0%")
      .attr("width","100")
      .attr("height","100")
      .attr("xlink:href", function(d) { return d.img});
  newNodes.filter(function(d) {return d.elementType==="image"}).append("circle")
    .attr("cx", function(d) { return d.rect.x+d.rect.width/2})
    .attr("cy", function(d) { return d.rect.y+d.rect.height/2+4})
    .attr("r", function(d) { return 25 })
    .attr("fill", function(d) {return "url(#pattern_"+d["@id"]+")"})
    .each(function(d) {d.arect = this;});

	newNodes.filter(function(d) {return d.elementType==="rect"}).append("rect")
		.attr("x", function(d) { return d.rect.x-5})
		.attr("y", function(d) { return d.rect.y-5})
		.attr("width", function(d) { return d.rect.width+10 })
		.attr("height", function(d) { return d.rect.height+10 })
		.attr("class", function(d) { return (d["class"] ? "s"+d["class"] : "default") })
		.each(function(d) {d.arect = this;});

	newNodes.filter(function(d) {return d.elementType==="circle"}).append("circle")
		.attr("cx", function(d) { return d.rect.x+5})
		.attr("cy", function(d) { return d.rect.y+5})
		.attr("r", function(d) { return 5+d.rect.height/2 })
		.attr("class", function(d) { return (d["class"] ? "s"+d["class"] : "default") })
		.each(function(d) {d.arect = this;});

	force
		.nodes(nodes)
		.links(links)
		.start();

}

function togglenode(show,nodeclass) {
	var selectednodes = container.selectAll(".t"+nodeclass)
	selectednodes.style("visibility",show ? "visible" : "hidden");
}

function clickPropertyBox() {
	if (propertyNode) {
		dblclick(propertyNode);
	}
}

function expandOneItem(id) {
	var selected = nodeMap[id];
	if (selected) {
		selected.linkCount++;
	}
	if (propertyNode) {
		if (propertyNode.aggregateNode) {
			propertyNode.count-=1;
			clickInfoBox();
		}
	}
	update();
}

function clickInfoBox() {
	if (propertyNode) {
		infoNode = propertyNode;
		if (propertyNode.aggregateNode) {
			var html= '<table style="background-color:#F0F0F0;">';
			propertyNode.links.forEach(function(x) {
				if (propertyNode.inbound) {
					if (x.source.linkCount<=1) { //Hack: linkCount is misused to show nodes from aggregation!
						html += '<tr><td><a onclick="expandOneItem(this.href);return false;" href="' + x.source['@id'] + '">' + x.source.label + '</a></td></tr>';
					}
				} else {
					if (x.target.linkCount<=1) { //Hack: linkCount is misused to show nodes from aggregation!
						html += '<tr><td><a onclick="expandOneItem(this.href);return false;" href="' + x.target['@id'] + '">' + x.target.label + '</a></td></tr>';
					}
				}
			});
			html += "</table>";
			infoBox.html(html);
		} else {
			var html = '<table>';
			for (var key in propertyNode.data) {
        var label= key;
        if (fragments[key]) {
          label= fragments[key].label;
        };
        if (label!=="") {
				  html += '<tr><td>'+label+'</td><td class="data">'+propertyNode.data[key]+"</td></tr>";
        }
			}
			html += "</table>";
			infoBox.html(html);
		}
	}
}

function tick(e) {
	//Extra: Calculate change
	if (typeof e != "undefined") {
		var k = 6 * e.alpha;
	}
	allLinks.each(function(d) {
		//Extra: to form a kind of tree
		if (typeof e != "undefined") {
			d.source.y += k;
			d.target.y -= k;
		}

		//Calculating the edge of the rectangle
		//+1 to avoid divide by zero
		var dx = Math.abs(d.target.x - d.source.x)+1,
			dy = Math.abs(d.target.y - d.source.y)+1,
			ddx = d.target.x < d.source.x ? dx : -dx,
			ddy = d.target.y < d.source.y ? dy : -dy,
			xt = d.target.x+(d.source.x < d.target.x ? Math.max(d.target.rect.x-5,(d.target.rect.y-5)*dx/dy) : Math.min(d.target.rect.x-5+d.target.rect.width+10,-(d.target.rect.y-5)*dx/dy)),
			yt = d.target.y+(d.source.y < d.target.y ? Math.max(d.target.rect.y-5,(d.target.rect.x-5)*dy/dx) : Math.min(d.target.rect.y-5+d.target.rect.height+10,-(d.target.rect.x-5)*dy/dx)),
			xs = d.source.x+(d.target.x < d.source.x ? Math.max(d.source.rect.x-5,(d.source.rect.y-5)*dx/dy) : Math.min(d.source.rect.x-5+d.source.rect.width+10,-(d.source.rect.y-5)*dx/dy)),
			ys = d.source.y+(d.target.y < d.source.y ? Math.max(d.source.rect.y-5,(d.source.rect.x-5)*dy/dx) : Math.min(d.source.rect.y-5+d.source.rect.height+10,-(d.source.rect.x-5)*dy/dx));

			if (d.target.elementType==="circle") {
				var pl = Math.sqrt((ddx*ddx)+(ddy*ddy)),
					rad = 5+d.target.rect.height/2;
				xt = d.target.x+((ddx*rad)/pl)+2;
				yt = d.target.y+((ddy*rad)/pl)-5;
			}
			if (d.source.elementType==="circle") {
				var pl = Math.sqrt((ddx*ddx)+(ddy*ddy)),
					rad = 5+d.source.rect.height/2;
				xs = d.source.x-((ddx*rad)/pl);
				ys = d.source.y-((ddy*rad)/pl)-5;
			}

      if (d.target.elementType==="image") {
          var pl = Math.sqrt((ddx*ddx)+(ddy*ddy)),
          rad = 30;
          xt = d.target.x+((ddx*rad)/pl);
          yt = d.target.y+((ddy*rad)/pl);
      }
      if (d.source.elementType==="image") {
          var pl = Math.sqrt((ddx*ddx)+(ddy*ddy)),
          rad = 30;
          xs = d.source.x-((ddx*rad)/pl);
          ys = d.source.y-((ddy*rad)/pl);
      }

		//Change the position of the lines, to match the border of the rectangle instead of the centre of the rectangle
		d3.select(this).selectAll("line")
			.attr("x1",xs)
			.attr("y1",ys)
			.attr("x2",xt)
			.attr("y2",yt);

		//Rotate the text to match the angle of the lines
		var tx = xs+(xt-xs)*2/3, //set label at 2/3 of edge (to solve situation with overlapping edges)
			ty = ys+(yt-ys)*2/3;
		d3.select(this).selectAll("text")
			.attr("x",tx)
			.attr("y",ty-3)
			.attr("transform","rotate("+Math.atan(ddy/ddx)*57+" "+tx+" "+ty+")");

		//IE10 and IE11 bugfix
		if (bugIE) {
			this.parentNode.insertBefore(this,this);
		}
	})

    allNodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	movePropertyBox();

}

function expand() {
	if (currentNode) {
		dblclick(currentNode)
	}
}

function dblclick(d) {
	// Fixed position of a node can be relaxed after a user doubleclicks AND the node has been expanded
	d.fixed = d.expanded ? !d.fixed : d.fixed;

	//Check for aggregate node
	if (!d.aggregateNode) {
		//Only query if the nodes hasn't been expanded yet
		if (!d.expanded) {
			//Fetch new data via Ajax call
      d3.xhr(jsonApiCall+encodeURIComponent(d['@id']),"application/ld+json", function(error, xhr) {

        //Parse xhr as if it was json
        jsonld.expand(JSON.parse(xhr.responseText),function (err, json) {
          if (!err) {

            //Stijlen ophalen
            json.forEach(function(resource) {
              var found = false;
              if (elmoName in resource) {
                elmoStyles[resource["@id"]]=resource[elmoName][0]["@value"]
              }
            });

            var availableNodes = {};
            json.forEach(function(x) { availableNodes[x[idKey]] = x; });

            //Find subject and insert
            var subject = json.filter(function(r) {return (r[idKey]===d['@id'])})[0];

            //Add nodes that are linked from the subject and available
            for (var property in subject) {
              if (property!==idKey && property!==elmoStyle) {
                for (var objectindex in subject[property]) {
                  if (availableNodes[subject[property][objectindex][idKey]]) {
                    if (!nodeMap[subject[property][objectindex][idKey]]) {
                      // startingpoint of new nodes = position starting node
                      addNode(availableNodes[subject[property][objectindex][idKey]],d.x,d.y);
                    }
                  }
                }
              }
            };
            //Add nodes that have the subject as target (duplicates will be filtered out by addNode function)
            json.forEach(function(resource) {
              var found = false;
              for (var property in resource) {
                if (property!=idKey && property!=elmoStyle) {
                  for (var objectindex in resource[property]) {
                    if (resource[property][objectindex][idKey]===d['@id']) {
                      found = true;
                    }
                  }
                }
              }
              if (found) {
                if (!nodeMap[resource[idKey]]) {
                  addNode(resource,d.x,d.y);
                }
              }
            });

            //Only add new lines
            json.forEach(function(resource) {
              for (var property in resource) {
                // Only display items that are uri's and exists as nodes
                if (property!==idKey && property!==elmoStyle) {
                  for (objectindex in resource[property]) {
                    if (nodeMap[resource[property][objectindex][idKey]]) {
                      var label = property.replace(regexLabelFromURI,"$2");;
                      var propertyUri = property;//getFullUri(property,json["@context"]);
                      if (availableNodes[propertyUri]) {
                        if (availableNodes[propertyUri][rdfsLabel]) {
                          label = availableNodes[propertyUri][rdfsLabel][0]["@value"];
                        }
                      }
                      if (linkMap[resource[idKey]+resource[property][objectindex][idKey]]) {
                        //Existing link, check if uri is different and label is different, add label to existing link
                        var el = linkMap[resource[idKey]+resource[property][objectindex][idKey]];
                        if ((el.uri!=property) && (el.label!=label)) {
                          el.label+= ", " + label;
                        }
                      } else {
                        var l = addLink(resource[idKey],resource[property][objectindex][idKey],property,label);
                        //Create network: set in & out-links
                        l.source.outLinks[l.uri] = l.source.outLinks[l.uri] || [];
                        l.source.outLinks[l.uri].push(l);
                        l.source.linkCount++;
                        l.source.parentLink = l;
                        l.target.inLinks[l.uri] = l.target.inLinks[l.uri] || [];
                        l.target.inLinks[l.uri].push(l);
                        l.target.linkCount++;
                        l.target.parentLink = l;
                      }
                    }
                  }
                }
              };
            });

            d.expanded = true;
            updateTitle(d);
            createAggregateNodes();
            update();
          }
        });
			})
		}
	} else {
		//TODO: Uncollapse aggregate
		d.expanded = true;
		//A bit dirty: make sure that the new nodes are visible
		d.links.forEach(function(x) {
			x.target.linkCount++;
			x.source.linkCount++;
		});
		update();
	}
}




/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _diagramglobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./diagramglobal.js */ "./src/diagramglobal.js");
//import Diagram from './diagram.js'
//import diagram from './diagram.js'


(function(){
var jsonApiSubject = "http://mak.zorgeloosvastgoed.nl/id/begrip/Koop";
var jsonApiIDSubject = "";
var jsonApiCall = "http://taxonomie.zorgeloosvastgoed.nl/resource?representation=http%3A%2F%2Fdotwebstack.org%2Fconfiguration%2FGraph&date=&subject=";
var uriEndpoint = "http://taxonomie.zorgeloosvastgoed.nl/resource?subject=";
var fragments = {};

//var D = new Diagram();
//D.start();
//diagram.init(jsonApiSubject, jsonApiIDSubject, jsonApiCall, uriEndpoint, fragments);

Object(_diagramglobal_js__WEBPACK_IMPORTED_MODULE_0__["initGraph"])(jsonApiSubject, jsonApiIDSubject, jsonApiCall, uriEndpoint, fragments);

module.exports = {
  run: function () {
    console.log('run from library');
  }
};

})()

/* harmony default export */ __webpack_exports__["default"] = (_diagramglobal_js__WEBPACK_IMPORTED_MODULE_0__["togglefullscreen"]);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ })

/******/ })["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9SREZWaXovd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vUkRGVml6Lyh3ZWJwYWNrKS9idWlsZGluL2hhcm1vbnktbW9kdWxlLmpzIiwid2VicGFjazovL1JERlZpei8uL3NyYy9kaWFncmFtZ2xvYmFsLmpzIiwid2VicGFjazovL1JERlZpei8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3ZCQTtBQUFBO0FBQUE7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsYUFBYTtBQUNiLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLGtDQUFrQyw4QkFBOEIsRUFBRTs7QUFFbEU7O0FBRUE7QUFDQSwrQ0FBK0MsbUNBQW1DO0FBQ2xGO0FBQ0EsNkNBQTZDLHFDQUFxQztBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTs7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QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsSUFBSTtBQUNKO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRXFDOzs7Ozs7Ozs7Ozs7O0FDanlCckM7QUFBQTtBQUFBO0FBQ0E7QUFDOEQ7O0FBRTlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVjLGlJQUFnQixFQUFDIiwiZmlsZSI6ImR3c3Zpei1saWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3JpZ2luYWxNb2R1bGUpIHtcblx0aWYgKCFvcmlnaW5hbE1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcblx0XHR2YXIgbW9kdWxlID0gT2JqZWN0LmNyZWF0ZShvcmlnaW5hbE1vZHVsZSk7XG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XG5cdFx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwibG9hZGVkXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJpZFwiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwiZXhwb3J0c1wiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlXG5cdFx0fSk7XG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XG5cdH1cblx0cmV0dXJuIG1vZHVsZTtcbn07XG4iLCJ2YXIganNvbkFwaVN1YmplY3QsIGpzb25BcGlJRFN1YmplY3QsIGpzb25BcGlDYWxsLCB1cmlFbmRwb2ludCwgZnJhZ21lbnRzO1xuXG52YXIgd2lkdGggPSAkKFwiI2dyYXBoXCIpLndpZHRoKCksXG4gICAgaGVpZ2h0ID0gNTAwLC8vJChcIiNncmFwaFwiKS5oZWlnaHQoKSxcblx0YXNwZWN0ID0gaGVpZ2h0L3dpZHRoO1xuXG4vL01heGltdW0gbnVtYmVyIG9mIG5vZGVzIGFsbG93ZWQgYmVmb3JlIGxpbmtzIGFuZCBub2RlcyBhcmUgYWdncmVnYXRlZFxudmFyIG1heE5vZGVzID0gNDtcblxuLy9SZWdleCBleHByZXNzaW9uIGZvciBjcmVhdGlvbiBsYWJlbCBmcm9tIFVSSVxudmFyIHJlZ2V4TGFiZWxGcm9tVVJJID0gbmV3IFJlZ0V4cChcIiguKylbI3wvXShbXi9dKykkXCIsXCJnXCIpO1xuXG4vL1NvbWUga2V5IGNvbnN0YW50c1xudmFyIGlkS2V5ID0gXCJAaWRcIjtcbnZhciBlbG1vU3R5bGUgPSBcImh0dHA6Ly9icDRtYzIub3JnL2VsbW8vZGVmI3N0eWxlXCI7XG52YXIgZWxtb05hbWUgPSBcImh0dHA6Ly9icDRtYzIub3JnL2VsbW8vZGVmI25hbWVcIjtcbnZhciByZGZzTGFiZWwgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSNsYWJlbFwiO1xudmFyIGh0bWxJbWFnZSA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbC92b2NhYiNpbWdcIlxuXG4vL0Z1bGwgc2NyZWVuIHRvZ2dsZVxudmFyIGZ1bGxTY3JlZW5GbGFnID0gZmFsc2U7XG5cbi8vIHpvb20gZmVhdHVyZXNcbnZhciB6b29tID0gZDMuYmVoYXZpb3Iuem9vbSgpXG5cdC5zY2FsZUV4dGVudChbMC4xLDEwXSlcblx0Lm9uKFwiem9vbVwiLHpvb21lZCk7XG5cbi8vIHN2ZyBncmFwaCBvbiB0aGUgYm9keVxudmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNncmFwaFwiKS5hcHBlbmQoXCJzdmdcIilcbiAgICAuYXR0cihcIndpZHRoXCIsIFwiMTAwJVwiKVxuICAgIC5hdHRyKFwiaGVpZ2h0XCIsIFwiNTAwXCIpXG5cdC5hdHRyKFwib3ZlcmZsb3dcIiwgXCJoaWRkZW5cIilcblx0LmFwcGVuZChcImdcIilcblx0XHQuY2FsbCh6b29tKVxuXHRcdC5vbihcImRibGNsaWNrLnpvb21cIixudWxsKTtcblxuLy8gZGV0YWlsYm94IGRpdlxudmFyIGRldGFpbEJveCA9IGQzLnNlbGVjdChcIiNncmFwaHRpdGxlXCIpO1xuXG4vLyBwcm9wZXJ0eWJveCBkaXZcbnZhciBwdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzdmcnKVswXS5jcmVhdGVTVkdQb2ludCgpO1xudmFyIHByb3BlcnR5Qm94ID0gZDMuc2VsZWN0KFwiI3Byb3BlcnR5Ym94XCIpO1xudmFyIGluZm9Cb3ggPSBwcm9wZXJ0eUJveC5hcHBlbmQoXCJkaXZcIik7XG5pbmZvQm94LmF0dHIoXCJjbGFzc1wiLFwiaW5mb2JveFwiKTtcbnZhciBwcm9wZXJ0eU5vZGUgPSBudWxsO1xudmFyIGluZm9Ob2RlID0gbnVsbDtcbnZhciBwcm9wZXJ0eUJveFZpc2libGUgPSBmYWxzZTtcblxuLy9SZWN0YW5nbGUgYXJlYSBmb3IgcGFubmluZ1xudmFyIHJlY3QgPSBzdmcuYXBwZW5kKFwicmVjdFwiKVxuICAgIC5hdHRyKFwid2lkdGhcIiwgXCIxMDAlXCIpXG4gICAgLmF0dHIoXCJoZWlnaHRcIiwgXCIxMDAlXCIpXG5cdC5hdHRyKFwiY2xhc3NcIixcImNhbnZhc1wiKTtcblxuLy9Db250YWluZXIgdGhhdCBob2xkcyBhbGwgdGhlIGdyYXBoaWNhbCBlbGVtZW50c1xudmFyIGNvbnRhaW5lciA9IHN2Zy5hcHBlbmQoXCJnXCIpO1xuXG4vL0ZsYWcgZm9yIElFMTAgYW5kIElFMTEgYnVnOiBTVkcgZWRnZXMgYXJlIG5vdCBzaG93aW5nIHdoZW4gcmVkcmF3blxudmFyIGJ1Z0lFID0gKChuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwicnY6MTFcIikhPS0xKSB8fCAobmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZihcIk1TSUUgMTBcIikhPS0xKSk7XG5cbi8vQXJyb3doZWFkIGRlZmluaXRpb25cbi8vKEFsbCBvdGhlciBlbmRwb2ludHMgc2hvdWxkIGJlIGRlZmluZWQgaW4gdGhpcyBzZWN0aW9uKVxuY29udGFpbmVyLmFwcGVuZCgnZGVmcycpLnNlbGVjdEFsbCgnbWFya2VyJylcbiAgICAgICAgLmRhdGEoWydlbmQnXSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgnbWFya2VyJylcbiAgICAgICAgLmF0dHIoJ2lkJyAgICAgICAgICAsICdBcnJvd0hlYWQnKVxuICAgICAgICAuYXR0cigndmlld0JveCcgICAgICwgJzAgLTUgMTAgMTAnKVxuICAgICAgICAuYXR0cigncmVmWCcgICAgICAgICwgMTApXG4gICAgICAgIC5hdHRyKCdyZWZZJyAgICAgICAgLCAwKVxuICAgICAgICAuYXR0cignbWFya2VyV2lkdGgnICwgNilcbiAgICAgICAgLmF0dHIoJ21hcmtlckhlaWdodCcsIDYpXG4gICAgICAgIC5hdHRyKCdvcmllbnQnICAgICAgLCAnYXV0bycpXG4gICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgLmF0dHIoJ2QnLCAnTTAsLTVMMTAsMEwwLDUnKTtcblxuLy9Gb3JjZSBkZWZpbml0aW9uXG52YXIgZm9yY2UgPSBkMy5sYXlvdXQuZm9yY2UoKVxuICAgIC5ncmF2aXR5KDApXG4gICAgLmRpc3RhbmNlKDE1MClcbiAgICAuY2hhcmdlKC0yMDApXG4gICAgLnNpemUoW3dpZHRoLCBoZWlnaHRdKVxuXHQub24oXCJ0aWNrXCIsdGljayk7XG5cbi8vSW5pdGlhbGlzaW5nIHNlbGVjdGlvbiBvZiBncmFwaGljYWwgZWxlbWVudHNcbi8vYWxsTGlua3MgPSBhbGwgdGhlIGN1cnJlbnQgdmlzaWJsZSBsaW5rc1xuLy9hbGxOb2RlcyA9IGFsbCB0aGUgY3VycmVudCB2aXNpYmxlIG5vZGVzXG4vL0FsbE5vZGVzIGFuZCBBbGxMaW5rcyBhcmUgdXNlZCB3aXRoaW4gdGhlIHRpY2sgZnVuY3Rpb25cbi8vcm9vdCBob2xkcyBhbGwgZGF0YSwgZXZlbiBkYXRhIHRoYXQgaGFzIGJlZW4gbWFkZSBpbnZpc2libGVcbnZhciBhbGxMaW5rcyA9IGNvbnRhaW5lci5zZWxlY3RBbGwoXCIubGlua1wiKSxcblx0YWxsTm9kZXMgPSBjb250YWluZXIuc2VsZWN0QWxsKFwiLm5vZGVcIiksXG5cdG5vZGVNYXAgPSB7fSxcblx0bGlua01hcCA9IHt9LFxuXHRyb290ID0ge30sXG5cdGN1cnJlbnROb2RlID0gbnVsbCxcbiAgZWxtb1N0eWxlcyA9IFtdO1xuXG4vL0ZldGNoIGRhdGEgdmlhIEFqYXgtY2FsbCBhbmQgcHJvY2VzcyAoYXNrIGZvciBqc29uLWxkKVxuZnVuY3Rpb24gaW5pdEdyYXBoKF9qc29uQXBpU3ViamVjdCwgX2pzb25BcGlJRFN1YmplY3QsIF9qc29uQXBpQ2FsbCwgX3VyaUVuZHBvaW50LCBfZnJhZ21lbnRzKSB7XG5cbiAganNvbkFwaVN1YmplY3QgPSBfanNvbkFwaVN1YmplY3Q7XG4gIGpzb25BcGlJRFN1YmplY3QgPSBfanNvbkFwaUlEU3ViamVjdDtcbiAganNvbkFwaUNhbGwgPSBfanNvbkFwaUNhbGw7XG4gIHVyaUVuZHBvaW50ID0gX3VyaUVuZHBvaW50O1xuICBmcmFnbWVudHMgPSBfZnJhZ21lbnRzO1xuXG4gIGQzLnhocihqc29uQXBpQ2FsbCtlbmNvZGVVUklDb21wb25lbnQoanNvbkFwaVN1YmplY3QpLFwiYXBwbGljYXRpb24vbGQranNvblwiLCBmdW5jdGlvbihlcnJvciwgeGhyKSB7XG5cbiAgICAvL1BhcnNlIHhociBhcyBpZiBpdCB3YXMganNvbiwgYW5kIGV4cGFuZCAobG9zZSBjb250ZXh0KVxuICAgIGpzb25sZC5leHBhbmQoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSxmdW5jdGlvbiAoZXJyLCBqc29uKSB7XG4gICAgICBpZiAoIWVycikge1xuXG4gICAgICAgIC8vU3RpamxlbiBvcGhhbGVuXG4gICAgICAgIGpzb24uZm9yRWFjaChmdW5jdGlvbihyZXNvdXJjZSkge1xuICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgIGlmIChlbG1vTmFtZSBpbiByZXNvdXJjZSkge1xuICAgICAgICAgICAgZWxtb1N0eWxlc1tyZXNvdXJjZVtcIkBpZFwiXV09cmVzb3VyY2VbZWxtb05hbWVdWzBdW1wiQHZhbHVlXCJdXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYXZhaWxhYmxlTm9kZXMgPSB7fTtcbiAgICAgICAganNvbi5mb3JFYWNoKGZ1bmN0aW9uKHgpIHsgYXZhaWxhYmxlTm9kZXNbeFtpZEtleV1dID0geDsgfSk7XG5cbiAgICAgICAgcm9vdC5ub2RlcyA9IFtdO1xuXG4gICAgICAgIC8vRmluZCBzdWJqZWN0IGFuZCBpbnNlcnQgKHN0YXJ0aW5ncG9pbnQgPSBtaWRkbGUgb2Ygc2NyZWVuKVxuICAgICAgICB2YXIgc3ViamVjdCA9IGpzb24uZmlsdGVyKGZ1bmN0aW9uKHIpIHtyZXR1cm4gKHJbaWRLZXldPT09anNvbkFwaVN1YmplY3QpfSlbMF07XG4gICAgICAgIGlmICghc3ViamVjdCkge1xuICAgICAgICAgIHN1YmplY3QgPSBqc29uLmZpbHRlcihmdW5jdGlvbihyKSB7cmV0dXJuIChyW2lkS2V5XT09PWpzb25BcGlJRFN1YmplY3QpfSlbMF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzdWJqZWN0KSB7XG4gICAgICAgICAgc3ViamVjdCA9IGpzb25bMF07XG4gICAgICAgIH1cbiAgICAgICAgYWRkTm9kZShzdWJqZWN0LHdpZHRoLzIsaGVpZ2h0LzIpO1xuXG4gICAgICAgIC8vQWRkIG5vZGVzIHRoYXQgYXJlIGxpbmtlZCBmcm9tIHRoZSBzdWJqZWN0IGFuZCBhdmFpbGFibGVcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gc3ViamVjdCkge1xuICAgICAgICAgIGlmIChwcm9wZXJ0eSE9PWlkS2V5ICYmIHByb3BlcnR5IT09ZWxtb1N0eWxlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBvYmplY3RpbmRleCBpbiBzdWJqZWN0W3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICBpZiAoYXZhaWxhYmxlTm9kZXNbc3ViamVjdFtwcm9wZXJ0eV1bb2JqZWN0aW5kZXhdW2lkS2V5XV0pIHtcbiAgICAgICAgICAgICAgICBpZiAoIW5vZGVNYXBbc3ViamVjdFtwcm9wZXJ0eV1bb2JqZWN0aW5kZXhdW2lkS2V5XV0pIHtcbiAgICAgICAgICAgICAgICAgIGFkZE5vZGUoYXZhaWxhYmxlTm9kZXNbc3ViamVjdFtwcm9wZXJ0eV1bb2JqZWN0aW5kZXhdW2lkS2V5XV0sd2lkdGgvMixoZWlnaHQvMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vQWRkIG5vZGVzIHRoYXQgaGF2ZSB0aGUgc3ViamVjdCBhcyB0YXJnZXQgKGR1cGxpY2F0ZXMgd2lsbCBiZSBmaWx0ZXJlZCBvdXQgYnkgYWRkTm9kZSBmdW5jdGlvbilcbiAgICAgICAganNvbi5mb3JFYWNoKGZ1bmN0aW9uKHJlc291cmNlKSB7XG4gICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcmVzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSE9aWRLZXkgJiYgcHJvcGVydHkhPWVsbW9TdHlsZSkge1xuICAgICAgICAgICAgICBmb3IgKHZhciBvYmplY3RpbmRleCBpbiByZXNvdXJjZVtwcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2VbcHJvcGVydHldW29iamVjdGluZGV4XVtpZEtleV09PT1qc29uQXBpU3ViamVjdCkge1xuICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgIGFkZE5vZGUocmVzb3VyY2Usd2lkdGgvMixoZWlnaHQvMik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvL1VwZGF0ZSBhbmQgZ2V0IGxpbmtzXG4gICAgICAgIHJvb3QubGlua3MgPSBbXTtcbiAgICAgICAganNvbi5mb3JFYWNoKGZ1bmN0aW9uKHJlc291cmNlKSB7XG4gICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcmVzb3VyY2UpIHtcbiAgICAgICAgICAgIC8vIE9ubHkgZGlzcGxheSBpdGVtcyB0aGF0IGFyZSB1cmkncyBhbmQgZXhpc3RzIGFzIG5vZGVzXG4gICAgICAgICAgICBpZiAocHJvcGVydHkhPT1pZEtleSAmJiBwcm9wZXJ0eSE9PWVsbW9TdHlsZSkge1xuICAgICAgICAgICAgICBmb3IgKG9iamVjdGluZGV4IGluIHJlc291cmNlW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlTWFwW3Jlc291cmNlW3Byb3BlcnR5XVtvYmplY3RpbmRleF1baWRLZXldXSkge1xuICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gcHJvcGVydHkucmVwbGFjZShyZWdleExhYmVsRnJvbVVSSSxcIiQyXCIpO1xuICAgICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5VXJpID0gcHJvcGVydHk7Ly9nZXRGdWxsVXJpKHByb3BlcnR5LGpzb25bXCJAY29udGV4dFwiXSk7XG4gICAgICAgICAgICAgICAgICBpZiAoYXZhaWxhYmxlTm9kZXNbcHJvcGVydHlVcmldKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdmFpbGFibGVOb2Rlc1twcm9wZXJ0eVVyaV1bcmRmc0xhYmVsXSkge1xuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsID0gYXZhaWxhYmxlTm9kZXNbcHJvcGVydHlVcmldW3JkZnNMYWJlbF1bMF1bXCJAdmFsdWVcIl07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGFkZExpbmsocmVzb3VyY2VbaWRLZXldLHJlc291cmNlW3Byb3BlcnR5XVtvYmplY3RpbmRleF1baWRLZXldLHByb3BlcnR5LGxhYmVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICAvL1NldCBmaXJzdCBub2RlIHRvIGZpeGVkXG4gICAgICAgIHJvb3Qubm9kZXNbMF0uZml4ZWQgPSB0cnVlO1xuICAgICAgICByb290Lm5vZGVzWzBdLmV4cGFuZGVkID0gdHJ1ZTtcbiAgICAgICAgdXBkYXRlVGl0bGUocm9vdC5ub2Rlc1swXSk7XG5cbiAgICAgICAgLy9DcmVhdGUgbmV0d29ya1xuICAgICAgICByb290LmxpbmtzLmZvckVhY2goZnVuY3Rpb24obCkge1xuICAgICAgICAgIGwuc291cmNlLm91dExpbmtzW2wudXJpXSA9IGwuc291cmNlLm91dExpbmtzW2wudXJpXSB8fCBbXTtcbiAgICAgICAgICBsLnNvdXJjZS5vdXRMaW5rc1tsLnVyaV0ucHVzaChsKTtcbiAgICAgICAgICBsLnNvdXJjZS5saW5rQ291bnQrKztcbiAgICAgICAgICBsLnNvdXJjZS5wYXJlbnRMaW5rID0gbDtcbiAgICAgICAgICBsLnRhcmdldC5pbkxpbmtzW2wudXJpXSA9IGwudGFyZ2V0LmluTGlua3NbbC51cmldIHx8IFtdO1xuICAgICAgICAgIGwudGFyZ2V0LmluTGlua3NbbC51cmldLnB1c2gobCk7XG4gICAgICAgICAgbC50YXJnZXQubGlua0NvdW50Kys7XG4gICAgICAgICAgbC50YXJnZXQucGFyZW50TGluayA9IGw7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNyZWF0ZUFnZ3JlZ2F0ZU5vZGVzKCk7XG4gICAgICAgIHVwZGF0ZSgpO1xuXG4gICAgICB9O1xuICAgIH0pO1xuXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGROb2RlKHJlc291cmNlLHgseSkge1xuXG4gIC8vT25seSBhZGQgYSBub2RlIGlmIGl0IGRvZXNuJ3QgZXhpc3RzIGFscmVhZHlcbiAgaWYgKCFub2RlTWFwW3Jlc291cmNlW2lkS2V5XV0pIHtcblxuICAgIHZhciBub2RlQ2xhc3MgPSBcIlwiO1xuICAgIGlmIChyZXNvdXJjZVtlbG1vU3R5bGVdKSB7XG4gICAgICBpZiAoZWxtb1N0eWxlc1tyZXNvdXJjZVtlbG1vU3R5bGVdWzBdW2lkS2V5XV0pIHtcbiAgICAgICAgbm9kZUNsYXNzID0gZWxtb1N0eWxlc1tyZXNvdXJjZVtlbG1vU3R5bGVdWzBdW2lkS2V5XV07XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBub2RlTGFiZWwgPSByZXNvdXJjZVtpZEtleV07XG4gICAgaWYgKHJlc291cmNlW3JkZnNMYWJlbF0pIHtcbiAgICAgIG5vZGVMYWJlbCA9IHJlc291cmNlW3JkZnNMYWJlbF1bMF1bXCJAdmFsdWVcIl07XG4gICAgfVxuICAgIHZhciBub2RlRGF0YSA9IHt9O1xuICAgIGZvciAodmFyIHByb3BlcnR5IGluIHJlc291cmNlKSB7XG4gICAgICBpZiAocHJvcGVydHkhPT1pZEtleSAmJiBwcm9wZXJ0eSE9cmRmc0xhYmVsICYmIChyZXNvdXJjZVtwcm9wZXJ0eV1bMF1bXCJAdmFsdWVcIl0pKSB7XG4gICAgICAgIG5vZGVEYXRhW3Byb3BlcnR5XT1yZXNvdXJjZVtwcm9wZXJ0eV1bMF1bXCJAdmFsdWVcIl07XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBub2RlID0ge1wiQGlkXCI6cmVzb3VyY2VbaWRLZXldXG4gICAgICAgICxcImxhYmVsXCI6bm9kZUxhYmVsXG4gICAgICAgICxcImNsYXNzXCI6bm9kZUNsYXNzXG4gICAgICAgICxcImRhdGFcIjogbm9kZURhdGFcbiAgICAgICAgLFwiZWxlbWVudFR5cGVcIjogXCJyZWN0XCJcbiAgICAgICAgfTtcbiAgICBpZiAocmVzb3VyY2VbaHRtbEltYWdlXSkge1xuICAgICAgbm9kZS5pbWcgPSByZXNvdXJjZVtodG1sSW1hZ2VdWzBdW1wiQHZhbHVlXCJdO1xuICAgICAgbm9kZS5lbGVtZW50VHlwZSA9IFwiaW1hZ2VcIjtcbiAgICB9XG4gICAgcm9vdC5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgIG5vZGVNYXBbcmVzb3VyY2VbaWRLZXldXSA9IG5vZGU7XG5cbiAgICAvLyBzdGFydGluZ3BvaW50IG9mIG5ldyBub2RlXG4gICAgbm9kZS54ID0geDtcbiAgICBub2RlLnkgPSB5O1xuICAgIC8vQ3JlYXRlIG5ldHdvcms6IGluaXRpYWxpemUgbmV3IG5vZGVcbiAgICBub2RlLmluTGlua3MgPSB7fTtcbiAgICBub2RlLm91dExpbmtzID0ge307XG4gICAgbm9kZS5saW5rQ291bnQgPSAwO1xuICAgIG5vZGUucGFyZW50TGluaztcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGFkZExpbmsoc291cmNlVXJpLHRhcmdldFVyaSxwcm9wZXJ0eVVyaSxwcm9wZXJ0eUxhYmVsKSB7XG5cbiAgaWYgKGxpbmtNYXBbc291cmNlVXJpK3RhcmdldFVyaV0pIHtcbiAgICAvL0xpbmsgYWxyZWFkeSBleGlzdHMsIGFkZCBsYWJlbCB0byBleGlzdGluZyBsaW5rXG4gICAgbGlua01hcFtzb3VyY2VVcmkrdGFyZ2V0VXJpXS5sYWJlbCs9IFwiLCBcIitwcm9wZXJ0eUxhYmVsO1xuICAgIHJldHVybiBsaW5rTWFwW3NvdXJjZVVyaSt0YXJnZXRVcmldXG4gIH0gZWxzZSB7XG4gICAgLy9OZXcgbGlua1xuICAgIHZhciBsID0ge1wiaWRcIjpzb3VyY2VVcmkrdGFyZ2V0VXJpXG4gICAgICAgICAgICAsXCJzb3VyY2VcIjpub2RlTWFwW3NvdXJjZVVyaV1cbiAgICAgICAgICAgICxcInRhcmdldFwiOm5vZGVNYXBbdGFyZ2V0VXJpXVxuICAgICAgICAgICAgLFwidXJpXCI6cHJvcGVydHlVcmlcbiAgICAgICAgICAgICxcImxhYmVsXCI6cHJvcGVydHlMYWJlbFxuICAgICAgICAgICAgfTtcbiAgICBsaW5rTWFwW2wuaWRdPWw7XG4gICAgcm9vdC5saW5rcy5wdXNoKGwpO1xuICAgIHJldHVybiBsO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gbW92ZVByb3BlcnR5Qm94KCkge1xuXHRpZiAocHJvcGVydHlCb3hWaXNpYmxlICYmIHByb3BlcnR5Tm9kZSkge1xuXHRcdGlmIChwcm9wZXJ0eU5vZGUuYXJlY3QpIHtcblx0XHRcdHByb3BlcnR5Qm94LnN0eWxlKFwiZGlzcGxheVwiLFwiYmxvY2tcIik7XG5cdFx0XHQvL0dldCBhYnNvbHV0ZSBwb3NpdGlvblxuXHRcdFx0dmFyIG1hdHJpeCAgPSBwcm9wZXJ0eU5vZGUuYXJlY3QuZ2V0U2NyZWVuQ1RNKCk7XG5cdFx0XHRpZiAocHJvcGVydHlOb2RlLmFyZWN0Lm5vZGVOYW1lPT09J3JlY3QnKSB7XG5cdFx0XHRcdHB0LnggPSBwcm9wZXJ0eU5vZGUuYXJlY3QueC5hbmltVmFsLnZhbHVlK3Byb3BlcnR5Tm9kZS5hcmVjdC53aWR0aC5hbmltVmFsLnZhbHVlO1xuXHRcdFx0XHRwdC55ID0gcHJvcGVydHlOb2RlLmFyZWN0LnkuYW5pbVZhbC52YWx1ZTtcblx0XHRcdH1cblx0XHRcdGlmIChwcm9wZXJ0eU5vZGUuYXJlY3Qubm9kZU5hbWU9PT0nY2lyY2xlJykge1xuXHRcdFx0XHRwdC54ID0gcHJvcGVydHlOb2RlLmFyZWN0LmN4LmFuaW1WYWwudmFsdWUrcHJvcGVydHlOb2RlLmFyZWN0LnIuYW5pbVZhbC52YWx1ZTtcblx0XHRcdFx0cHQueSA9IHByb3BlcnR5Tm9kZS5hcmVjdC5jeS5hbmltVmFsLnZhbHVlLXByb3BlcnR5Tm9kZS5hcmVjdC5yLmFuaW1WYWwudmFsdWU7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZGl2cmVjdCA9IHB0Lm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHRcdFx0Ly9Db3JyZWN0IGZvciBvZmZzZXQgYW5kIHNjcm9sbFxuXHRcdFx0dmFyIHRoZVggPSBkaXZyZWN0LngtJCgnI2dyYXBoY2FudmFzJykub2Zmc2V0KCkubGVmdCskKHdpbmRvdykuc2Nyb2xsTGVmdCgpO1xuXHRcdFx0dmFyIHRoZVkgPSBkaXZyZWN0LnktJCgnI2dyYXBoY2FudmFzJykub2Zmc2V0KCkudG9wKyQod2luZG93KS5zY3JvbGxUb3AoKTtcblx0XHRcdC8vU2V0IHBvc2l0aW9uXG5cdFx0XHRwcm9wZXJ0eUJveC5zdHlsZShcImxlZnRcIix0aGVYK1wicHhcIik7XG5cdFx0XHRwcm9wZXJ0eUJveC5zdHlsZShcInRvcFwiLHRoZVkrXCJweFwiKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbW91c2VvdmVyTm9kZShkKSB7XG5cdGlmICghcHJvcGVydHlCb3hWaXNpYmxlKSB7XG5cdFx0cHJvcGVydHlOb2RlID0gZDtcblx0XHRwcm9wZXJ0eUJveFZpc2libGUgPSB0cnVlO1xuXHRcdG1vdmVQcm9wZXJ0eUJveCgpO1xuXHRcdGlmIChpbmZvTm9kZSE9cHJvcGVydHlOb2RlKSB7XG5cdFx0XHR2YXIgaHRtbD0nJztcblx0XHRcdGluZm9Cb3guaHRtbChodG1sKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbW91c2VvdXROb2RlKGQpIHtcblx0aWYgKHByb3BlcnR5Qm94VmlzaWJsZSkge1xuXHRcdHByb3BlcnR5Qm94VmlzaWJsZSA9IGZhbHNlO1xuXHRcdHByb3BlcnR5Qm94LnN0eWxlKFwiZGlzcGxheVwiLFwibm9uZVwiKTtcblx0XHRpZiAoaW5mb05vZGUhPXByb3BlcnR5Tm9kZSkge1xuXHRcdFx0dmFyIGh0bWw9Jyc7XG5cdFx0XHRpbmZvQm94Lmh0bWwoaHRtbCk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIG1vdXNlb3ZlclByb3BlcnR5Qm94KCkge1xuXHRpZiAoIXByb3BlcnR5Qm94VmlzaWJsZSkge1xuXHRcdHByb3BlcnR5Qm94LnN0eWxlKFwiZGlzcGxheVwiLFwiYmxvY2tcIik7XG5cdFx0cHJvcGVydHlCb3hWaXNpYmxlID0gdHJ1ZTtcblx0fVxufVxuXG5mdW5jdGlvbiBtb3VzZW91dFByb3BlcnR5Qm94KCkge1xuXHRwcm9wZXJ0eUJveC5zdHlsZShcImRpc3BsYXlcIixcIm5vbmVcIik7XG5cdHByb3BlcnR5Qm94VmlzaWJsZSA9IGZhbHNlO1xuXHRpZiAoaW5mb05vZGUhPXByb3BlcnR5Tm9kZSkge1xuXHRcdHZhciBodG1sPScnO1xuXHRcdGluZm9Cb3guaHRtbChodG1sKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVBZ2dyZWdhdGVOb2RlcygpIHtcblxuXHQvL0FkZCBhbiBhZ2dyZWdhdGVOb2RlIGZvciBhbnkgbm9kZSB0aGF0IGhhcyBtb3JlIHRoYW4gbWF4Tm9kZXMgb3V0Z29pbmcgT1IgaW5nb2luZyBsaW5rc1xuXHRyb290Lm5vZGVzLmZvckVhY2goZnVuY3Rpb24obikge1xuXHRcdGlmICghbi5hZ2dyZWdhdGVOb2RlKSB7XG5cdFx0XHRPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhuLm91dExpbmtzKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcblx0XHRcdFx0dmFyIGQgPSBuLm91dExpbmtzW3Byb3BdO1xuXHRcdFx0XHRpZiAoZC5sZW5ndGg+PW1heE5vZGVzKSB7XG5cdFx0XHRcdFx0aWYgKCFub2RlTWFwW25bXCJAaWRcIl0rZFswXS51cmldKSB7XG5cdFx0XHRcdFx0XHR2YXIgYU5vZGUgPSB7XCJAaWRcIjpuW1wiQGlkXCJdK2RbMF0udXJpLGRhdGE6e30sbGFiZWw6ZFswXS5sYWJlbCx1cmk6ZFswXS51cmksZWxlbWVudFR5cGU6XCJjaXJjbGVcIixhZ2dyZWdhdGVOb2RlOnRydWUsaW5ib3VuZDpmYWxzZSxjb3VudDpkLmxlbmd0aCxsaW5rczpkfTtcblx0XHRcdFx0XHRcdHJvb3Qubm9kZXMucHVzaChhTm9kZSk7XG5cdFx0XHRcdFx0XHRyb290LmxpbmtzLnB1c2goe2lkOm5bXCJAaWRcIl0rZFswXS51cmksc291cmNlOm4sdGFyZ2V0OmFOb2RlLGxhYmVsOmRbMF0ubGFiZWwsdXJpOmRbMF0udXJpfSk7XG5cdFx0XHRcdFx0XHRub2RlTWFwW2FOb2RlW1wiQGlkXCJdXT1hTm9kZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobi5pbkxpbmtzKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcblx0XHRcdFx0dmFyIGQgPSBuLmluTGlua3NbcHJvcF07XG5cdFx0XHRcdGlmIChkLmxlbmd0aD49bWF4Tm9kZXMpIHtcblx0XHRcdFx0XHRpZiAoIW5vZGVNYXBbbltcIkBpZFwiXStkWzBdLnVyaV0pIHtcblx0XHRcdFx0XHRcdHZhciBhTm9kZSA9IHtcIkBpZFwiOm5bXCJAaWRcIl0rZFswXS51cmksZGF0YTp7fSxsYWJlbDpkWzBdLmxhYmVsLHVyaTpkWzBdLnVyaSxlbGVtZW50VHlwZTpcImNpcmNsZVwiLGFnZ3JlZ2F0ZU5vZGU6dHJ1ZSxpbmJvdW5kOnRydWUsY291bnQ6ZC5sZW5ndGgsbGlua3M6ZH07XG5cdFx0XHRcdFx0XHRyb290Lm5vZGVzLnB1c2goYU5vZGUpO1xuXHRcdFx0XHRcdFx0cm9vdC5saW5rcy5wdXNoKHtpZDpuW1wiQGlkXCJdK2RbMF0udXJpLHNvdXJjZTphTm9kZSx0YXJnZXQ6bixsYWJlbDpkWzBdLmxhYmVsLHVyaTpkWzBdLnVyaX0pO1xuXHRcdFx0XHRcdFx0bm9kZU1hcFthTm9kZVtcIkBpZFwiXV09YU5vZGU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xuXHQvL0RvIGEgcmVjb3VudCBvZiBudW1iZXIgb2YgY29ubmVjdGlvbnNcblx0Ly8oY291bnQgaXMgbnVtYmVyIG9mIGNvbm5lY3Rpb25zIG1pbnVzIHRoZSBjb25uZWN0aW9ucyB0aGF0IHJlbWFpbiB2aXNpYmxlXG5cdHJvb3Qubm9kZXMuZm9yRWFjaChmdW5jdGlvbihuKSB7XG5cdFx0aWYgKG4uYWdncmVnYXRlTm9kZSkge1xuXHRcdFx0bi5jb3VudCA9IG4ubGlua3MuZmlsdGVyKGZ1bmN0aW9uKGQpIHtyZXR1cm4gKChkLnRhcmdldC5saW5rQ291bnQ8PTEpIHx8IChkLnNvdXJjZS5saW5rQ291bnQ8PTEpKX0pLmxlbmd0aDtcblx0XHR9XG5cdH0pO1xufVxuXG52YXIgbm9kZV9kcmFnID0gZDMuYmVoYXZpb3IuZHJhZygpXG5cdC5vbihcImRyYWdzdGFydFwiLCBkcmFnc3RhcnQpXG5cdC5vbihcImRyYWdcIiwgZHJhZ21vdmUpXG5cdC5vbihcImRyYWdlbmRcIiwgZHJhZ2VuZCk7XG5cbmZ1bmN0aW9uIHVwZGF0ZVRpdGxlKGQpIHtcblx0dmFyIGh0bWwgPSAnPGgzIGNsYXNzPVwicGFuZWwtdGl0bGVcIj48YSBzdHlsZT1cImZvbnQtc2l6ZToxNnB4XCIgaHJlZj1cIicrdXJpRW5kcG9pbnQrZW5jb2RlVVJJQ29tcG9uZW50KGRbJ0BpZCddKSsnXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLW5ldy13aW5kb3dcIi8+PC9hPiAnK2QubGFiZWw7XG5cdGlmICghZC5leHBhbmRlZCkge1xuXHRcdGh0bWwrPScgPGEgb25jbGljaz1cImV4cGFuZCgpO1wiIGNsYXNzPVwiYmFkZ2VcIiBzdHlsZT1cImZvbnQtc2l6ZToxMnB4XCI+Jztcblx0XHRpZiAoZC5kYXRhWydjb3VudCddKSB7XG5cdFx0XHRodG1sKz1kLmRhdGFbJ2NvdW50J11cblx0XHR9O1xuXHRcdGh0bWwrPSc8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tem9vbS1pblwiLz48L2E+Jztcblx0fVxuXHRodG1sKz0nPHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWZ1bGxzY3JlZW5cIiBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlO3JpZ2h0OjEwcHg7bWFyZ2luLXRvcDoxMHB4O2N1cnNvcjpwb2ludGVyXCIgb25jbGljaz1cIlJERlZpei50b2dnbGVmdWxsc2NyZWVuKClcIi8+Jztcblx0aHRtbCs9JzwvaDM+Jztcblx0ZGV0YWlsQm94Lmh0bWwoaHRtbCk7XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZWZ1bGxzY3JlZW4oKSB7XG5cdGlmIChmdWxsU2NyZWVuRmxhZykge1xuXHRcdCQoJyNncmFwaGNhbnZhcycpLmNzcyh7cG9zaXRpb246J3JlbGF0aXZlJyxsZWZ0OicnLHRvcDonJyx3aWR0aDonJyxoZWlnaHQ6JycsekluZGV4OicnfSk7XG5cdFx0Ly9kMy5zZWxlY3QoJyNncmFwaGNhbnZhcycpLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsXCJyZWxhdGl2ZVwiKTtcblx0fSBlbHNlIHtcblx0XHQkKCcjZ3JhcGhjYW52YXMnKS5jc3Moe3Bvc2l0aW9uOidhYnNvbHV0ZScsbGVmdDowLHRvcDowLHdpZHRoOiAkKHdpbmRvdykud2lkdGgoKSwgaGVpZ2h0OiAkKHdpbmRvdykuaGVpZ2h0KCksIHpJbmRleDogMTAwMH0pO1xuXHRcdC8vZDMuc2VsZWN0KCcjZ3JhcGhjYW52YXMnKS5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLFwicG9zaXRpb246YWJzb2x1dGU7bGVmdDowO3RvcDowO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCVcIik7XG5cdFx0ZDMuc2VsZWN0KFwiI2dyYXBoXCIpLnNlbGVjdChcInN2Z1wiKS5hdHRyKFwiaGVpZ2h0XCIsJCh3aW5kb3cpLmhlaWdodCgpLTEwMCk7XG5cdH1cblx0ZnVsbFNjcmVlbkZsYWcgPSAhZnVsbFNjcmVlbkZsYWc7XG59XG5cbmZ1bmN0aW9uIGRyYWdzdGFydChkKSB7XG5cdGQzLmV2ZW50LnNvdXJjZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRmb3JjZS5zdG9wKCk7XG5cdGN1cnJlbnROb2RlID0gZDtcblx0dXBkYXRlVGl0bGUoZCk7XG59XG5mdW5jdGlvbiBkcmFnbW92ZShkKSB7XG5cdGQucHggKz0gZDMuZXZlbnQuZHg7XG5cdGQucHkgKz0gZDMuZXZlbnQuZHk7XG5cdGQueCArPSBkMy5ldmVudC5keDtcblx0ZC55ICs9IGQzLmV2ZW50LmR5O1xuXHR0aWNrKCk7XG59XG5mdW5jdGlvbiBkcmFnZW5kKGQpIHtcblx0ZC5maXhlZCA9IHRydWU7XG5cdHRpY2soKTtcblx0Zm9yY2UucmVzdW1lKCk7XG59XG5cbmZ1bmN0aW9uIHpvb21lZCgpIHtcblx0Y29udGFpbmVyLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBkMy5ldmVudC50cmFuc2xhdGUgKyBcIilzY2FsZShcIiArIGQzLmV2ZW50LnNjYWxlICsgXCIpXCIpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGUoKSB7XG5cblx0Ly9LZWVwIG9ubHkgdGhlIHZpc2libGUgbm9kZXNcblx0dmFyIG5vZGVzID0gcm9vdC5ub2Rlcy5maWx0ZXIoZnVuY3Rpb24oZCkge1xuXHRcdHJldHVybiBkLmFnZ3JlZ2F0ZU5vZGUgPyAoIWQuZXhwYW5kZWQpICYmIChkLmNvdW50PjApIDogKChkLmxpbmtDb3VudD4xKSB8fCAoKGQucGFyZW50TGluay5zb3VyY2Uub3V0TGlua3NbZC5wYXJlbnRMaW5rLnVyaV0ubGVuZ3RoIDwgbWF4Tm9kZXMpICYmIChkLnBhcmVudExpbmsudGFyZ2V0LmluTGlua3NbZC5wYXJlbnRMaW5rLnVyaV0ubGVuZ3RoIDwgbWF4Tm9kZXMpKSlcblx0fSk7XG5cdHZhciBsaW5rcyA9IHJvb3QubGlua3M7XG5cdC8vS2VlcCBvbmx5IHRoZSB2aXNpYmxlIGxpbmtzXG5cdGxpbmtzID0gcm9vdC5saW5rcy5maWx0ZXIoZnVuY3Rpb24oZCkge1xuXHRcdHJldHVybiBkLnNvdXJjZS5hZ2dyZWdhdGVOb2RlID8gKCFkLnNvdXJjZS5leHBhbmRlZCkgJiYgKGQuc291cmNlLmNvdW50PjApIDogZC50YXJnZXQuYWdncmVnYXRlTm9kZSA/ICghZC50YXJnZXQuZXhwYW5kZWQpICYmIChkLnRhcmdldC5jb3VudD4wKSA6ICgoKGQuc291cmNlLmxpbmtDb3VudD4xKSAmJiAoZC50YXJnZXQubGlua0NvdW50PjEpKSB8fCAoKGQuc291cmNlLm91dExpbmtzW2QudXJpXS5sZW5ndGggPCBtYXhOb2RlcykgJiYgKGQudGFyZ2V0LmluTGlua3NbZC51cmldLmxlbmd0aCA8IG1heE5vZGVzKSkpXG5cdH0pO1xuXG5cdC8vIFVwZGF0ZSB0aGUgbGlua3Ncblx0YWxsTGlua3MgPSBhbGxMaW5rcy5kYXRhKGxpbmtzLGZ1bmN0aW9uKGQpIHtyZXR1cm4gZC5pZH0pO1xuXG5cdC8vIEV4aXQgYW55IG9sZCBsaW5rcy5cblx0YWxsTGlua3MuZXhpdCgpLnJlbW92ZSgpO1xuXG5cdC8vIEVudGVyIGFueSBuZXcgbGlua3MuXG5cdHZhciBuZXdMaW5rcyA9IGFsbExpbmtzXG5cdFx0LmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gXCJsaW5rXCIrKGQuc291cmNlW1wiY2xhc3NcIl0gPyBcIiB0XCIrZC5zb3VyY2VbXCJjbGFzc1wiXSA6IFwiXCIpKyhkLnRhcmdldFtcImNsYXNzXCJdID8gXCIgdFwiK2QudGFyZ2V0W1wiY2xhc3NcIl0gOiBcIlwiKSB9KTtcblxuXHRuZXdMaW5rcy5hcHBlbmQoXCJsaW5lXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLFwiYm9yZGVyXCIpXG5cdG5ld0xpbmtzLmFwcGVuZChcImxpbmVcIilcblx0XHQuc3R5bGUoXCJtYXJrZXItZW5kXCIsIFwidXJsKCNBcnJvd0hlYWQpXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLFwic3Ryb2tlXCIpO1xuXHRuZXdMaW5rcy5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0LmF0dHIoXCJkeFwiLCAwKVxuXHRcdC5hdHRyKFwiZHlcIiwgMClcblx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLFwic3Ryb2tlLXRleHRcIilcblx0XHQudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkLmxhYmVsIH0pO1xuXG5cdC8vIFVwZGF0ZSB0aGUgbm9kZXNcblx0YWxsTm9kZXMgPSBhbGxOb2Rlcy5kYXRhKG5vZGVzLGZ1bmN0aW9uKGQpIHtyZXR1cm4gZFtcIkBpZFwiXX0pO1xuXG5cdC8vIFVwZGF0ZSB0ZXh0IChjb3VudCBvZiBhbiBhZ2dyZWdhdGVOb2RlIG1pZ2h0IGNoYW5nZSlcblx0YWxsTm9kZXMuc2VsZWN0KFwidGV4dFwiKS50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuYWdncmVnYXRlTm9kZSA/IGQuY291bnQgOiBkLmxhYmVsIH0pO1xuXG5cdC8vIEV4aXQgYW55IG9sZCBub2Rlcy5cblx0YWxsTm9kZXMuZXhpdCgpLnJlbW92ZSgpO1xuXG5cdC8vIEVudGVyIGFueSBuZXcgbm9kZXMuXG5cdHZhciBuZXdOb2RlcyA9IGFsbE5vZGVzXG5cdFx0LmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gKGRbXCJjbGFzc1wiXSA/IFwibm9kZSB0XCIrZFtcImNsYXNzXCJdIDogXCJub2RlXCIpfSlcblx0XHQub24oXCJtb3VzZW92ZXJcIixtb3VzZW92ZXJOb2RlKVxuXHRcdC5vbihcIm1vdXNlb3V0XCIsbW91c2VvdXROb2RlKVxuXHRcdC5jYWxsKG5vZGVfZHJhZyk7XG5cbiAgbmV3Tm9kZXMuYXBwZW5kKFwidGV4dFwiKVxuXHRcdC5hdHRyKFwiZHhcIiwgMClcblx0XHQuYXR0cihcImR5XCIsIGZ1bmN0aW9uKGQpIHtyZXR1cm4gZC5lbGVtZW50VHlwZT09PVwiaW1hZ2VcIiA/IDQwIDogMH0pXG5cdFx0LmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIixcIm5vZGUtdGV4dFwiKVxuXHRcdC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuYWdncmVnYXRlTm9kZSA/IGQuY291bnQgOiBkLmxhYmVsIH0pXG5cdFx0LmVhY2goZnVuY3Rpb24oZCkge2QucmVjdCA9IHRoaXMuZ2V0QkJveCgpO1x0ZC5yZWN0LnkgPSBkLnJlY3QueSAtIChkLmVsZW1lbnRUeXBlPT09XCJpbWFnZVwiID8gNDAgOiAwKTt9KTtcblxuICBuZXdOb2Rlcy5maWx0ZXIoZnVuY3Rpb24oZCkge3JldHVybiBkLmVsZW1lbnRUeXBlPT09XCJpbWFnZVwifSkuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgLmF0dHIoXCJjeFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnJlY3QueCtkLnJlY3Qud2lkdGgvMn0pXG4gICAgLmF0dHIoXCJjeVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnJlY3QueStkLnJlY3QuaGVpZ2h0LzIrNH0pXG4gICAgLmF0dHIoXCJyXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIDMwIH0pXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkKSB7IHJldHVybiAoZFtcImNsYXNzXCJdID8gXCJzXCIrZFtcImNsYXNzXCJdIDogXCJkZWZhdWx0XCIpIH0pO1xuICBuZXdOb2Rlcy5maWx0ZXIoZnVuY3Rpb24oZCkge3JldHVybiBkLmVsZW1lbnRUeXBlPT09XCJpbWFnZVwifSkuYXBwZW5kKFwiZGVmc1wiKS5hcHBlbmQoXCJwYXR0ZXJuXCIpXG4gICAgLmF0dHIoXCJpZFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBcInBhdHRlcm5fXCIgKyBkW1wiQGlkXCJdfSlcbiAgICAuYXR0cihcInhcIiwgXCIwJVwiKVxuICAgIC5hdHRyKFwieVwiLCBcIjAlXCIpXG4gICAgLmF0dHIoXCJ2aWV3Qm94XCIsXCIwIDAgMTAwIDEwMFwiKVxuICAgIC5hdHRyKFwid2lkdGhcIiwgXCIxMDAlXCIpXG4gICAgLmF0dHIoXCJoZWlnaHRcIiwgXCIxMDAlXCIpXG4gICAgLmFwcGVuZChcImltYWdlXCIpXG4gICAgICAuYXR0cihcInhcIixcIjAlXCIpXG4gICAgICAuYXR0cihcInlcIixcIjAlXCIpXG4gICAgICAuYXR0cihcIndpZHRoXCIsXCIxMDBcIilcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsXCIxMDBcIilcbiAgICAgIC5hdHRyKFwieGxpbms6aHJlZlwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmltZ30pO1xuICBuZXdOb2Rlcy5maWx0ZXIoZnVuY3Rpb24oZCkge3JldHVybiBkLmVsZW1lbnRUeXBlPT09XCJpbWFnZVwifSkuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgLmF0dHIoXCJjeFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnJlY3QueCtkLnJlY3Qud2lkdGgvMn0pXG4gICAgLmF0dHIoXCJjeVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnJlY3QueStkLnJlY3QuaGVpZ2h0LzIrNH0pXG4gICAgLmF0dHIoXCJyXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIDI1IH0pXG4gICAgLmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHtyZXR1cm4gXCJ1cmwoI3BhdHRlcm5fXCIrZFtcIkBpZFwiXStcIilcIn0pXG4gICAgLmVhY2goZnVuY3Rpb24oZCkge2QuYXJlY3QgPSB0aGlzO30pO1xuXG5cdG5ld05vZGVzLmZpbHRlcihmdW5jdGlvbihkKSB7cmV0dXJuIGQuZWxlbWVudFR5cGU9PT1cInJlY3RcIn0pLmFwcGVuZChcInJlY3RcIilcblx0XHQuYXR0cihcInhcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5yZWN0LngtNX0pXG5cdFx0LmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQucmVjdC55LTV9KVxuXHRcdC5hdHRyKFwid2lkdGhcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5yZWN0LndpZHRoKzEwIH0pXG5cdFx0LmF0dHIoXCJoZWlnaHRcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5yZWN0LmhlaWdodCsxMCB9KVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gKGRbXCJjbGFzc1wiXSA/IFwic1wiK2RbXCJjbGFzc1wiXSA6IFwiZGVmYXVsdFwiKSB9KVxuXHRcdC5lYWNoKGZ1bmN0aW9uKGQpIHtkLmFyZWN0ID0gdGhpczt9KTtcblxuXHRuZXdOb2Rlcy5maWx0ZXIoZnVuY3Rpb24oZCkge3JldHVybiBkLmVsZW1lbnRUeXBlPT09XCJjaXJjbGVcIn0pLmFwcGVuZChcImNpcmNsZVwiKVxuXHRcdC5hdHRyKFwiY3hcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5yZWN0LngrNX0pXG5cdFx0LmF0dHIoXCJjeVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnJlY3QueSs1fSlcblx0XHQuYXR0cihcInJcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gNStkLnJlY3QuaGVpZ2h0LzIgfSlcblx0XHQuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIChkW1wiY2xhc3NcIl0gPyBcInNcIitkW1wiY2xhc3NcIl0gOiBcImRlZmF1bHRcIikgfSlcblx0XHQuZWFjaChmdW5jdGlvbihkKSB7ZC5hcmVjdCA9IHRoaXM7fSk7XG5cblx0Zm9yY2Vcblx0XHQubm9kZXMobm9kZXMpXG5cdFx0LmxpbmtzKGxpbmtzKVxuXHRcdC5zdGFydCgpO1xuXG59XG5cbmZ1bmN0aW9uIHRvZ2dsZW5vZGUoc2hvdyxub2RlY2xhc3MpIHtcblx0dmFyIHNlbGVjdGVkbm9kZXMgPSBjb250YWluZXIuc2VsZWN0QWxsKFwiLnRcIitub2RlY2xhc3MpXG5cdHNlbGVjdGVkbm9kZXMuc3R5bGUoXCJ2aXNpYmlsaXR5XCIsc2hvdyA/IFwidmlzaWJsZVwiIDogXCJoaWRkZW5cIik7XG59XG5cbmZ1bmN0aW9uIGNsaWNrUHJvcGVydHlCb3goKSB7XG5cdGlmIChwcm9wZXJ0eU5vZGUpIHtcblx0XHRkYmxjbGljayhwcm9wZXJ0eU5vZGUpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGV4cGFuZE9uZUl0ZW0oaWQpIHtcblx0dmFyIHNlbGVjdGVkID0gbm9kZU1hcFtpZF07XG5cdGlmIChzZWxlY3RlZCkge1xuXHRcdHNlbGVjdGVkLmxpbmtDb3VudCsrO1xuXHR9XG5cdGlmIChwcm9wZXJ0eU5vZGUpIHtcblx0XHRpZiAocHJvcGVydHlOb2RlLmFnZ3JlZ2F0ZU5vZGUpIHtcblx0XHRcdHByb3BlcnR5Tm9kZS5jb3VudC09MTtcblx0XHRcdGNsaWNrSW5mb0JveCgpO1xuXHRcdH1cblx0fVxuXHR1cGRhdGUoKTtcbn1cblxuZnVuY3Rpb24gY2xpY2tJbmZvQm94KCkge1xuXHRpZiAocHJvcGVydHlOb2RlKSB7XG5cdFx0aW5mb05vZGUgPSBwcm9wZXJ0eU5vZGU7XG5cdFx0aWYgKHByb3BlcnR5Tm9kZS5hZ2dyZWdhdGVOb2RlKSB7XG5cdFx0XHR2YXIgaHRtbD0gJzx0YWJsZSBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6I0YwRjBGMDtcIj4nO1xuXHRcdFx0cHJvcGVydHlOb2RlLmxpbmtzLmZvckVhY2goZnVuY3Rpb24oeCkge1xuXHRcdFx0XHRpZiAocHJvcGVydHlOb2RlLmluYm91bmQpIHtcblx0XHRcdFx0XHRpZiAoeC5zb3VyY2UubGlua0NvdW50PD0xKSB7IC8vSGFjazogbGlua0NvdW50IGlzIG1pc3VzZWQgdG8gc2hvdyBub2RlcyBmcm9tIGFnZ3JlZ2F0aW9uIVxuXHRcdFx0XHRcdFx0aHRtbCArPSAnPHRyPjx0ZD48YSBvbmNsaWNrPVwiZXhwYW5kT25lSXRlbSh0aGlzLmhyZWYpO3JldHVybiBmYWxzZTtcIiBocmVmPVwiJyArIHguc291cmNlWydAaWQnXSArICdcIj4nICsgeC5zb3VyY2UubGFiZWwgKyAnPC9hPjwvdGQ+PC90cj4nO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoeC50YXJnZXQubGlua0NvdW50PD0xKSB7IC8vSGFjazogbGlua0NvdW50IGlzIG1pc3VzZWQgdG8gc2hvdyBub2RlcyBmcm9tIGFnZ3JlZ2F0aW9uIVxuXHRcdFx0XHRcdFx0aHRtbCArPSAnPHRyPjx0ZD48YSBvbmNsaWNrPVwiZXhwYW5kT25lSXRlbSh0aGlzLmhyZWYpO3JldHVybiBmYWxzZTtcIiBocmVmPVwiJyArIHgudGFyZ2V0WydAaWQnXSArICdcIj4nICsgeC50YXJnZXQubGFiZWwgKyAnPC9hPjwvdGQ+PC90cj4nO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRodG1sICs9IFwiPC90YWJsZT5cIjtcblx0XHRcdGluZm9Cb3guaHRtbChodG1sKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIGh0bWwgPSAnPHRhYmxlPic7XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gcHJvcGVydHlOb2RlLmRhdGEpIHtcbiAgICAgICAgdmFyIGxhYmVsPSBrZXk7XG4gICAgICAgIGlmIChmcmFnbWVudHNba2V5XSkge1xuICAgICAgICAgIGxhYmVsPSBmcmFnbWVudHNba2V5XS5sYWJlbDtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGxhYmVsIT09XCJcIikge1xuXHRcdFx0XHQgIGh0bWwgKz0gJzx0cj48dGQ+JytsYWJlbCsnPC90ZD48dGQgY2xhc3M9XCJkYXRhXCI+Jytwcm9wZXJ0eU5vZGUuZGF0YVtrZXldK1wiPC90ZD48L3RyPlwiO1xuICAgICAgICB9XG5cdFx0XHR9XG5cdFx0XHRodG1sICs9IFwiPC90YWJsZT5cIjtcblx0XHRcdGluZm9Cb3guaHRtbChodG1sKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gdGljayhlKSB7XG5cdC8vRXh0cmE6IENhbGN1bGF0ZSBjaGFuZ2Vcblx0aWYgKHR5cGVvZiBlICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHR2YXIgayA9IDYgKiBlLmFscGhhO1xuXHR9XG5cdGFsbExpbmtzLmVhY2goZnVuY3Rpb24oZCkge1xuXHRcdC8vRXh0cmE6IHRvIGZvcm0gYSBraW5kIG9mIHRyZWVcblx0XHRpZiAodHlwZW9mIGUgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0ZC5zb3VyY2UueSArPSBrO1xuXHRcdFx0ZC50YXJnZXQueSAtPSBrO1xuXHRcdH1cblxuXHRcdC8vQ2FsY3VsYXRpbmcgdGhlIGVkZ2Ugb2YgdGhlIHJlY3RhbmdsZVxuXHRcdC8vKzEgdG8gYXZvaWQgZGl2aWRlIGJ5IHplcm9cblx0XHR2YXIgZHggPSBNYXRoLmFicyhkLnRhcmdldC54IC0gZC5zb3VyY2UueCkrMSxcblx0XHRcdGR5ID0gTWF0aC5hYnMoZC50YXJnZXQueSAtIGQuc291cmNlLnkpKzEsXG5cdFx0XHRkZHggPSBkLnRhcmdldC54IDwgZC5zb3VyY2UueCA/IGR4IDogLWR4LFxuXHRcdFx0ZGR5ID0gZC50YXJnZXQueSA8IGQuc291cmNlLnkgPyBkeSA6IC1keSxcblx0XHRcdHh0ID0gZC50YXJnZXQueCsoZC5zb3VyY2UueCA8IGQudGFyZ2V0LnggPyBNYXRoLm1heChkLnRhcmdldC5yZWN0LngtNSwoZC50YXJnZXQucmVjdC55LTUpKmR4L2R5KSA6IE1hdGgubWluKGQudGFyZ2V0LnJlY3QueC01K2QudGFyZ2V0LnJlY3Qud2lkdGgrMTAsLShkLnRhcmdldC5yZWN0LnktNSkqZHgvZHkpKSxcblx0XHRcdHl0ID0gZC50YXJnZXQueSsoZC5zb3VyY2UueSA8IGQudGFyZ2V0LnkgPyBNYXRoLm1heChkLnRhcmdldC5yZWN0LnktNSwoZC50YXJnZXQucmVjdC54LTUpKmR5L2R4KSA6IE1hdGgubWluKGQudGFyZ2V0LnJlY3QueS01K2QudGFyZ2V0LnJlY3QuaGVpZ2h0KzEwLC0oZC50YXJnZXQucmVjdC54LTUpKmR5L2R4KSksXG5cdFx0XHR4cyA9IGQuc291cmNlLngrKGQudGFyZ2V0LnggPCBkLnNvdXJjZS54ID8gTWF0aC5tYXgoZC5zb3VyY2UucmVjdC54LTUsKGQuc291cmNlLnJlY3QueS01KSpkeC9keSkgOiBNYXRoLm1pbihkLnNvdXJjZS5yZWN0LngtNStkLnNvdXJjZS5yZWN0LndpZHRoKzEwLC0oZC5zb3VyY2UucmVjdC55LTUpKmR4L2R5KSksXG5cdFx0XHR5cyA9IGQuc291cmNlLnkrKGQudGFyZ2V0LnkgPCBkLnNvdXJjZS55ID8gTWF0aC5tYXgoZC5zb3VyY2UucmVjdC55LTUsKGQuc291cmNlLnJlY3QueC01KSpkeS9keCkgOiBNYXRoLm1pbihkLnNvdXJjZS5yZWN0LnktNStkLnNvdXJjZS5yZWN0LmhlaWdodCsxMCwtKGQuc291cmNlLnJlY3QueC01KSpkeS9keCkpO1xuXG5cdFx0XHRpZiAoZC50YXJnZXQuZWxlbWVudFR5cGU9PT1cImNpcmNsZVwiKSB7XG5cdFx0XHRcdHZhciBwbCA9IE1hdGguc3FydCgoZGR4KmRkeCkrKGRkeSpkZHkpKSxcblx0XHRcdFx0XHRyYWQgPSA1K2QudGFyZ2V0LnJlY3QuaGVpZ2h0LzI7XG5cdFx0XHRcdHh0ID0gZC50YXJnZXQueCsoKGRkeCpyYWQpL3BsKSsyO1xuXHRcdFx0XHR5dCA9IGQudGFyZ2V0LnkrKChkZHkqcmFkKS9wbCktNTtcblx0XHRcdH1cblx0XHRcdGlmIChkLnNvdXJjZS5lbGVtZW50VHlwZT09PVwiY2lyY2xlXCIpIHtcblx0XHRcdFx0dmFyIHBsID0gTWF0aC5zcXJ0KChkZHgqZGR4KSsoZGR5KmRkeSkpLFxuXHRcdFx0XHRcdHJhZCA9IDUrZC5zb3VyY2UucmVjdC5oZWlnaHQvMjtcblx0XHRcdFx0eHMgPSBkLnNvdXJjZS54LSgoZGR4KnJhZCkvcGwpO1xuXHRcdFx0XHR5cyA9IGQuc291cmNlLnktKChkZHkqcmFkKS9wbCktNTtcblx0XHRcdH1cblxuICAgICAgaWYgKGQudGFyZ2V0LmVsZW1lbnRUeXBlPT09XCJpbWFnZVwiKSB7XG4gICAgICAgICAgdmFyIHBsID0gTWF0aC5zcXJ0KChkZHgqZGR4KSsoZGR5KmRkeSkpLFxuICAgICAgICAgIHJhZCA9IDMwO1xuICAgICAgICAgIHh0ID0gZC50YXJnZXQueCsoKGRkeCpyYWQpL3BsKTtcbiAgICAgICAgICB5dCA9IGQudGFyZ2V0LnkrKChkZHkqcmFkKS9wbCk7XG4gICAgICB9XG4gICAgICBpZiAoZC5zb3VyY2UuZWxlbWVudFR5cGU9PT1cImltYWdlXCIpIHtcbiAgICAgICAgICB2YXIgcGwgPSBNYXRoLnNxcnQoKGRkeCpkZHgpKyhkZHkqZGR5KSksXG4gICAgICAgICAgcmFkID0gMzA7XG4gICAgICAgICAgeHMgPSBkLnNvdXJjZS54LSgoZGR4KnJhZCkvcGwpO1xuICAgICAgICAgIHlzID0gZC5zb3VyY2UueS0oKGRkeSpyYWQpL3BsKTtcbiAgICAgIH1cblxuXHRcdC8vQ2hhbmdlIHRoZSBwb3NpdGlvbiBvZiB0aGUgbGluZXMsIHRvIG1hdGNoIHRoZSBib3JkZXIgb2YgdGhlIHJlY3RhbmdsZSBpbnN0ZWFkIG9mIHRoZSBjZW50cmUgb2YgdGhlIHJlY3RhbmdsZVxuXHRcdGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoXCJsaW5lXCIpXG5cdFx0XHQuYXR0cihcIngxXCIseHMpXG5cdFx0XHQuYXR0cihcInkxXCIseXMpXG5cdFx0XHQuYXR0cihcIngyXCIseHQpXG5cdFx0XHQuYXR0cihcInkyXCIseXQpO1xuXG5cdFx0Ly9Sb3RhdGUgdGhlIHRleHQgdG8gbWF0Y2ggdGhlIGFuZ2xlIG9mIHRoZSBsaW5lc1xuXHRcdHZhciB0eCA9IHhzKyh4dC14cykqMi8zLCAvL3NldCBsYWJlbCBhdCAyLzMgb2YgZWRnZSAodG8gc29sdmUgc2l0dWF0aW9uIHdpdGggb3ZlcmxhcHBpbmcgZWRnZXMpXG5cdFx0XHR0eSA9IHlzKyh5dC15cykqMi8zO1xuXHRcdGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG5cdFx0XHQuYXR0cihcInhcIix0eClcblx0XHRcdC5hdHRyKFwieVwiLHR5LTMpXG5cdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLFwicm90YXRlKFwiK01hdGguYXRhbihkZHkvZGR4KSo1NytcIiBcIit0eCtcIiBcIit0eStcIilcIik7XG5cblx0XHQvL0lFMTAgYW5kIElFMTEgYnVnZml4XG5cdFx0aWYgKGJ1Z0lFKSB7XG5cdFx0XHR0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMsdGhpcyk7XG5cdFx0fVxuXHR9KVxuXG4gICAgYWxsTm9kZXMuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIGQueCArIFwiLFwiICsgZC55ICsgXCIpXCI7IH0pO1xuXHRtb3ZlUHJvcGVydHlCb3goKTtcblxufVxuXG5mdW5jdGlvbiBleHBhbmQoKSB7XG5cdGlmIChjdXJyZW50Tm9kZSkge1xuXHRcdGRibGNsaWNrKGN1cnJlbnROb2RlKVxuXHR9XG59XG5cbmZ1bmN0aW9uIGRibGNsaWNrKGQpIHtcblx0Ly8gRml4ZWQgcG9zaXRpb24gb2YgYSBub2RlIGNhbiBiZSByZWxheGVkIGFmdGVyIGEgdXNlciBkb3VibGVjbGlja3MgQU5EIHRoZSBub2RlIGhhcyBiZWVuIGV4cGFuZGVkXG5cdGQuZml4ZWQgPSBkLmV4cGFuZGVkID8gIWQuZml4ZWQgOiBkLmZpeGVkO1xuXG5cdC8vQ2hlY2sgZm9yIGFnZ3JlZ2F0ZSBub2RlXG5cdGlmICghZC5hZ2dyZWdhdGVOb2RlKSB7XG5cdFx0Ly9Pbmx5IHF1ZXJ5IGlmIHRoZSBub2RlcyBoYXNuJ3QgYmVlbiBleHBhbmRlZCB5ZXRcblx0XHRpZiAoIWQuZXhwYW5kZWQpIHtcblx0XHRcdC8vRmV0Y2ggbmV3IGRhdGEgdmlhIEFqYXggY2FsbFxuICAgICAgZDMueGhyKGpzb25BcGlDYWxsK2VuY29kZVVSSUNvbXBvbmVudChkWydAaWQnXSksXCJhcHBsaWNhdGlvbi9sZCtqc29uXCIsIGZ1bmN0aW9uKGVycm9yLCB4aHIpIHtcblxuICAgICAgICAvL1BhcnNlIHhociBhcyBpZiBpdCB3YXMganNvblxuICAgICAgICBqc29ubGQuZXhwYW5kKEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCksZnVuY3Rpb24gKGVyciwganNvbikge1xuICAgICAgICAgIGlmICghZXJyKSB7XG5cbiAgICAgICAgICAgIC8vU3RpamxlbiBvcGhhbGVuXG4gICAgICAgICAgICBqc29uLmZvckVhY2goZnVuY3Rpb24ocmVzb3VyY2UpIHtcbiAgICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgIGlmIChlbG1vTmFtZSBpbiByZXNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGVsbW9TdHlsZXNbcmVzb3VyY2VbXCJAaWRcIl1dPXJlc291cmNlW2VsbW9OYW1lXVswXVtcIkB2YWx1ZVwiXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGF2YWlsYWJsZU5vZGVzID0ge307XG4gICAgICAgICAgICBqc29uLmZvckVhY2goZnVuY3Rpb24oeCkgeyBhdmFpbGFibGVOb2Rlc1t4W2lkS2V5XV0gPSB4OyB9KTtcblxuICAgICAgICAgICAgLy9GaW5kIHN1YmplY3QgYW5kIGluc2VydFxuICAgICAgICAgICAgdmFyIHN1YmplY3QgPSBqc29uLmZpbHRlcihmdW5jdGlvbihyKSB7cmV0dXJuIChyW2lkS2V5XT09PWRbJ0BpZCddKX0pWzBdO1xuXG4gICAgICAgICAgICAvL0FkZCBub2RlcyB0aGF0IGFyZSBsaW5rZWQgZnJvbSB0aGUgc3ViamVjdCBhbmQgYXZhaWxhYmxlXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBzdWJqZWN0KSB7XG4gICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSE9PWlkS2V5ICYmIHByb3BlcnR5IT09ZWxtb1N0eWxlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgb2JqZWN0aW5kZXggaW4gc3ViamVjdFtwcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICAgIGlmIChhdmFpbGFibGVOb2Rlc1tzdWJqZWN0W3Byb3BlcnR5XVtvYmplY3RpbmRleF1baWRLZXldXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW5vZGVNYXBbc3ViamVjdFtwcm9wZXJ0eV1bb2JqZWN0aW5kZXhdW2lkS2V5XV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAvLyBzdGFydGluZ3BvaW50IG9mIG5ldyBub2RlcyA9IHBvc2l0aW9uIHN0YXJ0aW5nIG5vZGVcbiAgICAgICAgICAgICAgICAgICAgICBhZGROb2RlKGF2YWlsYWJsZU5vZGVzW3N1YmplY3RbcHJvcGVydHldW29iamVjdGluZGV4XVtpZEtleV1dLGQueCxkLnkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy9BZGQgbm9kZXMgdGhhdCBoYXZlIHRoZSBzdWJqZWN0IGFzIHRhcmdldCAoZHVwbGljYXRlcyB3aWxsIGJlIGZpbHRlcmVkIG91dCBieSBhZGROb2RlIGZ1bmN0aW9uKVxuICAgICAgICAgICAganNvbi5mb3JFYWNoKGZ1bmN0aW9uKHJlc291cmNlKSB7XG4gICAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiByZXNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSE9aWRLZXkgJiYgcHJvcGVydHkhPWVsbW9TdHlsZSkge1xuICAgICAgICAgICAgICAgICAgZm9yICh2YXIgb2JqZWN0aW5kZXggaW4gcmVzb3VyY2VbcHJvcGVydHldKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZVtwcm9wZXJ0eV1bb2JqZWN0aW5kZXhdW2lkS2V5XT09PWRbJ0BpZCddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgIGlmICghbm9kZU1hcFtyZXNvdXJjZVtpZEtleV1dKSB7XG4gICAgICAgICAgICAgICAgICBhZGROb2RlKHJlc291cmNlLGQueCxkLnkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vT25seSBhZGQgbmV3IGxpbmVzXG4gICAgICAgICAgICBqc29uLmZvckVhY2goZnVuY3Rpb24ocmVzb3VyY2UpIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcmVzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAvLyBPbmx5IGRpc3BsYXkgaXRlbXMgdGhhdCBhcmUgdXJpJ3MgYW5kIGV4aXN0cyBhcyBub2Rlc1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSE9PWlkS2V5ICYmIHByb3BlcnR5IT09ZWxtb1N0eWxlKSB7XG4gICAgICAgICAgICAgICAgICBmb3IgKG9iamVjdGluZGV4IGluIHJlc291cmNlW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZU1hcFtyZXNvdXJjZVtwcm9wZXJ0eV1bb2JqZWN0aW5kZXhdW2lkS2V5XV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBwcm9wZXJ0eS5yZXBsYWNlKHJlZ2V4TGFiZWxGcm9tVVJJLFwiJDJcIik7O1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVVyaSA9IHByb3BlcnR5Oy8vZ2V0RnVsbFVyaShwcm9wZXJ0eSxqc29uW1wiQGNvbnRleHRcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChhdmFpbGFibGVOb2Rlc1twcm9wZXJ0eVVyaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdmFpbGFibGVOb2Rlc1twcm9wZXJ0eVVyaV1bcmRmc0xhYmVsXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbCA9IGF2YWlsYWJsZU5vZGVzW3Byb3BlcnR5VXJpXVtyZGZzTGFiZWxdWzBdW1wiQHZhbHVlXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICBpZiAobGlua01hcFtyZXNvdXJjZVtpZEtleV0rcmVzb3VyY2VbcHJvcGVydHldW29iamVjdGluZGV4XVtpZEtleV1dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL0V4aXN0aW5nIGxpbmssIGNoZWNrIGlmIHVyaSBpcyBkaWZmZXJlbnQgYW5kIGxhYmVsIGlzIGRpZmZlcmVudCwgYWRkIGxhYmVsIHRvIGV4aXN0aW5nIGxpbmtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbCA9IGxpbmtNYXBbcmVzb3VyY2VbaWRLZXldK3Jlc291cmNlW3Byb3BlcnR5XVtvYmplY3RpbmRleF1baWRLZXldXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZWwudXJpIT1wcm9wZXJ0eSkgJiYgKGVsLmxhYmVsIT1sYWJlbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZWwubGFiZWwrPSBcIiwgXCIgKyBsYWJlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSBhZGRMaW5rKHJlc291cmNlW2lkS2V5XSxyZXNvdXJjZVtwcm9wZXJ0eV1bb2JqZWN0aW5kZXhdW2lkS2V5XSxwcm9wZXJ0eSxsYWJlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL0NyZWF0ZSBuZXR3b3JrOiBzZXQgaW4gJiBvdXQtbGlua3NcbiAgICAgICAgICAgICAgICAgICAgICAgIGwuc291cmNlLm91dExpbmtzW2wudXJpXSA9IGwuc291cmNlLm91dExpbmtzW2wudXJpXSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGwuc291cmNlLm91dExpbmtzW2wudXJpXS5wdXNoKGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbC5zb3VyY2UubGlua0NvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICBsLnNvdXJjZS5wYXJlbnRMaW5rID0gbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGwudGFyZ2V0LmluTGlua3NbbC51cmldID0gbC50YXJnZXQuaW5MaW5rc1tsLnVyaV0gfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICBsLnRhcmdldC5pbkxpbmtzW2wudXJpXS5wdXNoKGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbC50YXJnZXQubGlua0NvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICBsLnRhcmdldC5wYXJlbnRMaW5rID0gbDtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZC5leHBhbmRlZCA9IHRydWU7XG4gICAgICAgICAgICB1cGRhdGVUaXRsZShkKTtcbiAgICAgICAgICAgIGNyZWF0ZUFnZ3JlZ2F0ZU5vZGVzKCk7XG4gICAgICAgICAgICB1cGRhdGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXHRcdFx0fSlcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Ly9UT0RPOiBVbmNvbGxhcHNlIGFnZ3JlZ2F0ZVxuXHRcdGQuZXhwYW5kZWQgPSB0cnVlO1xuXHRcdC8vQSBiaXQgZGlydHk6IG1ha2Ugc3VyZSB0aGF0IHRoZSBuZXcgbm9kZXMgYXJlIHZpc2libGVcblx0XHRkLmxpbmtzLmZvckVhY2goZnVuY3Rpb24oeCkge1xuXHRcdFx0eC50YXJnZXQubGlua0NvdW50Kys7XG5cdFx0XHR4LnNvdXJjZS5saW5rQ291bnQrKztcblx0XHR9KTtcblx0XHR1cGRhdGUoKTtcblx0fVxufVxuXG5leHBvcnQge2luaXRHcmFwaCwgdG9nZ2xlZnVsbHNjcmVlbn07XG4iLCIvL2ltcG9ydCBEaWFncmFtIGZyb20gJy4vZGlhZ3JhbS5qcydcbi8vaW1wb3J0IGRpYWdyYW0gZnJvbSAnLi9kaWFncmFtLmpzJ1xuaW1wb3J0IHtpbml0R3JhcGgsIHRvZ2dsZWZ1bGxzY3JlZW59IGZyb20gJy4vZGlhZ3JhbWdsb2JhbC5qcydcblxuKGZ1bmN0aW9uKCl7XG52YXIganNvbkFwaVN1YmplY3QgPSBcImh0dHA6Ly9tYWsuem9yZ2Vsb29zdmFzdGdvZWQubmwvaWQvYmVncmlwL0tvb3BcIjtcbnZhciBqc29uQXBpSURTdWJqZWN0ID0gXCJcIjtcbnZhciBqc29uQXBpQ2FsbCA9IFwiaHR0cDovL3RheG9ub21pZS56b3JnZWxvb3N2YXN0Z29lZC5ubC9yZXNvdXJjZT9yZXByZXNlbnRhdGlvbj1odHRwJTNBJTJGJTJGZG90d2Vic3RhY2sub3JnJTJGY29uZmlndXJhdGlvbiUyRkdyYXBoJmRhdGU9JnN1YmplY3Q9XCI7XG52YXIgdXJpRW5kcG9pbnQgPSBcImh0dHA6Ly90YXhvbm9taWUuem9yZ2Vsb29zdmFzdGdvZWQubmwvcmVzb3VyY2U/c3ViamVjdD1cIjtcbnZhciBmcmFnbWVudHMgPSB7fTtcblxuLy92YXIgRCA9IG5ldyBEaWFncmFtKCk7XG4vL0Quc3RhcnQoKTtcbi8vZGlhZ3JhbS5pbml0KGpzb25BcGlTdWJqZWN0LCBqc29uQXBpSURTdWJqZWN0LCBqc29uQXBpQ2FsbCwgdXJpRW5kcG9pbnQsIGZyYWdtZW50cyk7XG5cbmluaXRHcmFwaChqc29uQXBpU3ViamVjdCwganNvbkFwaUlEU3ViamVjdCwganNvbkFwaUNhbGwsIHVyaUVuZHBvaW50LCBmcmFnbWVudHMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ3J1biBmcm9tIGxpYnJhcnknKTtcbiAgfVxufTtcblxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCB0b2dnbGVmdWxsc2NyZWVuO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==