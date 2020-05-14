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

/***/ "./src/diagramglobal.js":
/*!******************************!*\
  !*** ./src/diagramglobal.js ***!
  \******************************/
/*! exports provided: initGraph, togglefullscreen, mouseoverPropertyBox, mouseoutPropertyBox, clickInfoBox, clickPropertyBox, expand, hideNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initGraph", function() { return initGraph; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "togglefullscreen", function() { return togglefullscreen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mouseoverPropertyBox", function() { return mouseoverPropertyBox; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mouseoutPropertyBox", function() { return mouseoutPropertyBox; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clickInfoBox", function() { return clickInfoBox; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clickPropertyBox", function() { return clickPropertyBox; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "expand", function() { return expand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hideNode", function() { return hideNode; });
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
		html+=' <a onclick="RDFViz.expand();" class="badge" style="font-size:12px">';
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
		return d.aggregateNode ? (!d.expanded) && (d.count>0) : ((!d.hide) && ((d.linkCount>1) || ((d.parentLink.source.outLinks[d.parentLink.uri].length < maxNodes) && (d.parentLink.target.inLinks[d.parentLink.uri].length < maxNodes))))
	});
	var links = root.links;
	//Keep only the visible links
	links = root.links.filter(function(d) {
		return d.source.aggregateNode ? (!d.source.expanded) && (d.source.count>0) : d.target.aggregateNode ? (!d.target.expanded) && (d.target.count>0) : (!d.source.hide) && (!d.target.hide) && (((d.source.linkCount>1) && (d.target.linkCount>1)) || ((d.source.outLinks[d.uri].length < maxNodes) && (d.target.inLinks[d.uri].length < maxNodes)))
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

function hideNode() {
  if (currentNode) {
    //Only hide if the node is a leaf-node
    currentNode.hide = true;
    mouseoutPropertyBox();
    update()
  }
}




/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: togglefullscreen, mouseoverPropertyBox, mouseoutPropertyBox, clickInfoBox, clickPropertyBox, expand, hideNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _diagramglobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./diagramglobal.js */ "./src/diagramglobal.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "togglefullscreen", function() { return _diagramglobal_js__WEBPACK_IMPORTED_MODULE_0__["togglefullscreen"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mouseoverPropertyBox", function() { return _diagramglobal_js__WEBPACK_IMPORTED_MODULE_0__["mouseoverPropertyBox"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mouseoutPropertyBox", function() { return _diagramglobal_js__WEBPACK_IMPORTED_MODULE_0__["mouseoutPropertyBox"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "clickInfoBox", function() { return _diagramglobal_js__WEBPACK_IMPORTED_MODULE_0__["clickInfoBox"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "clickPropertyBox", function() { return _diagramglobal_js__WEBPACK_IMPORTED_MODULE_0__["clickPropertyBox"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "expand", function() { return _diagramglobal_js__WEBPACK_IMPORTED_MODULE_0__["expand"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "hideNode", function() { return _diagramglobal_js__WEBPACK_IMPORTED_MODULE_0__["hideNode"]; });

//import Diagram from './diagram.js'
//import diagram from './diagram.js'


var jsonApiSubject = "http://example.org/id/JaneDoe"; //URI of the subject that is the center of the graph
var jsonApiIDSubject = ""; //Not used
var jsonApiCall = "http://localhost:8080/test.json?subject="; //Graph that contains the data (or a JSON-LD service that can be queried)
var uriEndpoint = "http://localhost:8080?subject="; //Endpoint that can be used to navigate to (empty means that the original URI is used as endpoint)
var fragments = {};

//var D = new Diagram();
//D.start();
//diagram.init(jsonApiSubject, jsonApiIDSubject, jsonApiCall, uriEndpoint, fragments);

Object(_diagramglobal_js__WEBPACK_IMPORTED_MODULE_0__["initGraph"])(jsonApiSubject, jsonApiIDSubject, jsonApiCall, uriEndpoint, fragments);




/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9SREZWaXovd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vUkRGVml6Ly4vc3JjL2RpYWdyYW1nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vUkRGVml6Ly4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixhQUFhO0FBQ2IsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0Esa0NBQWtDLDhCQUE4QixFQUFFOztBQUVsRTs7QUFFQTtBQUNBLCtDQUErQyxtQ0FBbUM7QUFDbEY7QUFDQSw2Q0FBNkMscUNBQXFDO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDQTtBQUNBOztBQUVrSTs7Ozs7Ozs7Ozs7OztBQzF5QmxJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUMySjs7QUFFM0oscURBQXFEO0FBQ3JELDBCQUEwQjtBQUMxQiw2REFBNkQ7QUFDN0QsbURBQW1EO0FBQ25EOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtRUFBUzs7QUFFOEciLCJmaWxlIjoiZHdzdml6LWxpYi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwidmFyIGpzb25BcGlTdWJqZWN0LCBqc29uQXBpSURTdWJqZWN0LCBqc29uQXBpQ2FsbCwgdXJpRW5kcG9pbnQsIGZyYWdtZW50cztcblxudmFyIHdpZHRoID0gJChcIiNncmFwaFwiKS53aWR0aCgpLFxuICAgIGhlaWdodCA9IDUwMCwvLyQoXCIjZ3JhcGhcIikuaGVpZ2h0KCksXG5cdGFzcGVjdCA9IGhlaWdodC93aWR0aDtcblxuLy9NYXhpbXVtIG51bWJlciBvZiBub2RlcyBhbGxvd2VkIGJlZm9yZSBsaW5rcyBhbmQgbm9kZXMgYXJlIGFnZ3JlZ2F0ZWRcbnZhciBtYXhOb2RlcyA9IDQ7XG5cbi8vUmVnZXggZXhwcmVzc2lvbiBmb3IgY3JlYXRpb24gbGFiZWwgZnJvbSBVUklcbnZhciByZWdleExhYmVsRnJvbVVSSSA9IG5ldyBSZWdFeHAoXCIoLispWyN8L10oW14vXSspJFwiLFwiZ1wiKTtcblxuLy9Tb21lIGtleSBjb25zdGFudHNcbnZhciBpZEtleSA9IFwiQGlkXCI7XG52YXIgZWxtb1N0eWxlID0gXCJodHRwOi8vYnA0bWMyLm9yZy9lbG1vL2RlZiNzdHlsZVwiO1xudmFyIGVsbW9OYW1lID0gXCJodHRwOi8vYnA0bWMyLm9yZy9lbG1vL2RlZiNuYW1lXCI7XG52YXIgcmRmc0xhYmVsID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjbGFiZWxcIjtcbnZhciBodG1sSW1hZ2UgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwvdm9jYWIjaW1nXCJcblxuLy9GdWxsIHNjcmVlbiB0b2dnbGVcbnZhciBmdWxsU2NyZWVuRmxhZyA9IGZhbHNlO1xuXG4vLyB6b29tIGZlYXR1cmVzXG52YXIgem9vbSA9IGQzLmJlaGF2aW9yLnpvb20oKVxuXHQuc2NhbGVFeHRlbnQoWzAuMSwxMF0pXG5cdC5vbihcInpvb21cIix6b29tZWQpO1xuXG4vLyBzdmcgZ3JhcGggb24gdGhlIGJvZHlcbnZhciBzdmcgPSBkMy5zZWxlY3QoXCIjZ3JhcGhcIikuYXBwZW5kKFwic3ZnXCIpXG4gICAgLmF0dHIoXCJ3aWR0aFwiLCBcIjEwMCVcIilcbiAgICAuYXR0cihcImhlaWdodFwiLCBcIjUwMFwiKVxuXHQuYXR0cihcIm92ZXJmbG93XCIsIFwiaGlkZGVuXCIpXG5cdC5hcHBlbmQoXCJnXCIpXG5cdFx0LmNhbGwoem9vbSlcblx0XHQub24oXCJkYmxjbGljay56b29tXCIsbnVsbCk7XG5cbi8vIGRldGFpbGJveCBkaXZcbnZhciBkZXRhaWxCb3ggPSBkMy5zZWxlY3QoXCIjZ3JhcGh0aXRsZVwiKTtcblxuLy8gcHJvcGVydHlib3ggZGl2XG52YXIgcHQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3ZnJylbMF0uY3JlYXRlU1ZHUG9pbnQoKTtcbnZhciBwcm9wZXJ0eUJveCA9IGQzLnNlbGVjdChcIiNwcm9wZXJ0eWJveFwiKTtcbnZhciBpbmZvQm94ID0gcHJvcGVydHlCb3guYXBwZW5kKFwiZGl2XCIpO1xuaW5mb0JveC5hdHRyKFwiY2xhc3NcIixcImluZm9ib3hcIik7XG52YXIgcHJvcGVydHlOb2RlID0gbnVsbDtcbnZhciBpbmZvTm9kZSA9IG51bGw7XG52YXIgcHJvcGVydHlCb3hWaXNpYmxlID0gZmFsc2U7XG5cbi8vUmVjdGFuZ2xlIGFyZWEgZm9yIHBhbm5pbmdcbnZhciByZWN0ID0gc3ZnLmFwcGVuZChcInJlY3RcIilcbiAgICAuYXR0cihcIndpZHRoXCIsIFwiMTAwJVwiKVxuICAgIC5hdHRyKFwiaGVpZ2h0XCIsIFwiMTAwJVwiKVxuXHQuYXR0cihcImNsYXNzXCIsXCJjYW52YXNcIik7XG5cbi8vQ29udGFpbmVyIHRoYXQgaG9sZHMgYWxsIHRoZSBncmFwaGljYWwgZWxlbWVudHNcbnZhciBjb250YWluZXIgPSBzdmcuYXBwZW5kKFwiZ1wiKTtcblxuLy9GbGFnIGZvciBJRTEwIGFuZCBJRTExIGJ1ZzogU1ZHIGVkZ2VzIGFyZSBub3Qgc2hvd2luZyB3aGVuIHJlZHJhd25cbnZhciBidWdJRSA9ICgobmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZihcInJ2OjExXCIpIT0tMSkgfHwgKG5hdmlnYXRvci5hcHBWZXJzaW9uLmluZGV4T2YoXCJNU0lFIDEwXCIpIT0tMSkpO1xuXG4vL0Fycm93aGVhZCBkZWZpbml0aW9uXG4vLyhBbGwgb3RoZXIgZW5kcG9pbnRzIHNob3VsZCBiZSBkZWZpbmVkIGluIHRoaXMgc2VjdGlvbilcbmNvbnRhaW5lci5hcHBlbmQoJ2RlZnMnKS5zZWxlY3RBbGwoJ21hcmtlcicpXG4gICAgICAgIC5kYXRhKFsnZW5kJ10pXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ21hcmtlcicpXG4gICAgICAgIC5hdHRyKCdpZCcgICAgICAgICAgLCAnQXJyb3dIZWFkJylcbiAgICAgICAgLmF0dHIoJ3ZpZXdCb3gnICAgICAsICcwIC01IDEwIDEwJylcbiAgICAgICAgLmF0dHIoJ3JlZlgnICAgICAgICAsIDEwKVxuICAgICAgICAuYXR0cigncmVmWScgICAgICAgICwgMClcbiAgICAgICAgLmF0dHIoJ21hcmtlcldpZHRoJyAsIDYpXG4gICAgICAgIC5hdHRyKCdtYXJrZXJIZWlnaHQnLCA2KVxuICAgICAgICAuYXR0cignb3JpZW50JyAgICAgICwgJ2F1dG8nKVxuICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAgIC5hdHRyKCdkJywgJ00wLC01TDEwLDBMMCw1Jyk7XG5cbi8vRm9yY2UgZGVmaW5pdGlvblxudmFyIGZvcmNlID0gZDMubGF5b3V0LmZvcmNlKClcbiAgICAuZ3Jhdml0eSgwKVxuICAgIC5kaXN0YW5jZSgxNTApXG4gICAgLmNoYXJnZSgtMjAwKVxuICAgIC5zaXplKFt3aWR0aCwgaGVpZ2h0XSlcblx0Lm9uKFwidGlja1wiLHRpY2spO1xuXG4vL0luaXRpYWxpc2luZyBzZWxlY3Rpb24gb2YgZ3JhcGhpY2FsIGVsZW1lbnRzXG4vL2FsbExpbmtzID0gYWxsIHRoZSBjdXJyZW50IHZpc2libGUgbGlua3Ncbi8vYWxsTm9kZXMgPSBhbGwgdGhlIGN1cnJlbnQgdmlzaWJsZSBub2Rlc1xuLy9BbGxOb2RlcyBhbmQgQWxsTGlua3MgYXJlIHVzZWQgd2l0aGluIHRoZSB0aWNrIGZ1bmN0aW9uXG4vL3Jvb3QgaG9sZHMgYWxsIGRhdGEsIGV2ZW4gZGF0YSB0aGF0IGhhcyBiZWVuIG1hZGUgaW52aXNpYmxlXG52YXIgYWxsTGlua3MgPSBjb250YWluZXIuc2VsZWN0QWxsKFwiLmxpbmtcIiksXG5cdGFsbE5vZGVzID0gY29udGFpbmVyLnNlbGVjdEFsbChcIi5ub2RlXCIpLFxuXHRub2RlTWFwID0ge30sXG5cdGxpbmtNYXAgPSB7fSxcblx0cm9vdCA9IHt9LFxuXHRjdXJyZW50Tm9kZSA9IG51bGwsXG4gIGVsbW9TdHlsZXMgPSBbXTtcblxuLy9GZXRjaCBkYXRhIHZpYSBBamF4LWNhbGwgYW5kIHByb2Nlc3MgKGFzayBmb3IganNvbi1sZClcbmZ1bmN0aW9uIGluaXRHcmFwaChfanNvbkFwaVN1YmplY3QsIF9qc29uQXBpSURTdWJqZWN0LCBfanNvbkFwaUNhbGwsIF91cmlFbmRwb2ludCwgX2ZyYWdtZW50cykge1xuXG4gIGpzb25BcGlTdWJqZWN0ID0gX2pzb25BcGlTdWJqZWN0O1xuICBqc29uQXBpSURTdWJqZWN0ID0gX2pzb25BcGlJRFN1YmplY3Q7XG4gIGpzb25BcGlDYWxsID0gX2pzb25BcGlDYWxsO1xuICB1cmlFbmRwb2ludCA9IF91cmlFbmRwb2ludDtcbiAgZnJhZ21lbnRzID0gX2ZyYWdtZW50cztcblxuICBkMy54aHIoanNvbkFwaUNhbGwrZW5jb2RlVVJJQ29tcG9uZW50KGpzb25BcGlTdWJqZWN0KSxcImFwcGxpY2F0aW9uL2xkK2pzb25cIiwgZnVuY3Rpb24oZXJyb3IsIHhocikge1xuXG4gICAgLy9QYXJzZSB4aHIgYXMgaWYgaXQgd2FzIGpzb24sIGFuZCBleHBhbmQgKGxvc2UgY29udGV4dClcbiAgICBqc29ubGQuZXhwYW5kKEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCksZnVuY3Rpb24gKGVyciwganNvbikge1xuICAgICAgaWYgKCFlcnIpIHtcblxuICAgICAgICAvL1N0aWpsZW4gb3BoYWxlblxuICAgICAgICBqc29uLmZvckVhY2goZnVuY3Rpb24ocmVzb3VyY2UpIHtcbiAgICAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoZWxtb05hbWUgaW4gcmVzb3VyY2UpIHtcbiAgICAgICAgICAgIGVsbW9TdHlsZXNbcmVzb3VyY2VbXCJAaWRcIl1dPXJlc291cmNlW2VsbW9OYW1lXVswXVtcIkB2YWx1ZVwiXVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGF2YWlsYWJsZU5vZGVzID0ge307XG4gICAgICAgIGpzb24uZm9yRWFjaChmdW5jdGlvbih4KSB7IGF2YWlsYWJsZU5vZGVzW3hbaWRLZXldXSA9IHg7IH0pO1xuXG4gICAgICAgIHJvb3Qubm9kZXMgPSBbXTtcblxuICAgICAgICAvL0ZpbmQgc3ViamVjdCBhbmQgaW5zZXJ0IChzdGFydGluZ3BvaW50ID0gbWlkZGxlIG9mIHNjcmVlbilcbiAgICAgICAgdmFyIHN1YmplY3QgPSBqc29uLmZpbHRlcihmdW5jdGlvbihyKSB7cmV0dXJuIChyW2lkS2V5XT09PWpzb25BcGlTdWJqZWN0KX0pWzBdO1xuICAgICAgICBpZiAoIXN1YmplY3QpIHtcbiAgICAgICAgICBzdWJqZWN0ID0ganNvbi5maWx0ZXIoZnVuY3Rpb24ocikge3JldHVybiAocltpZEtleV09PT1qc29uQXBpSURTdWJqZWN0KX0pWzBdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc3ViamVjdCkge1xuICAgICAgICAgIHN1YmplY3QgPSBqc29uWzBdO1xuICAgICAgICB9XG4gICAgICAgIGFkZE5vZGUoc3ViamVjdCx3aWR0aC8yLGhlaWdodC8yKTtcblxuICAgICAgICAvL0FkZCBub2RlcyB0aGF0IGFyZSBsaW5rZWQgZnJvbSB0aGUgc3ViamVjdCBhbmQgYXZhaWxhYmxlXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHN1YmplY3QpIHtcbiAgICAgICAgICBpZiAocHJvcGVydHkhPT1pZEtleSAmJiBwcm9wZXJ0eSE9PWVsbW9TdHlsZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgb2JqZWN0aW5kZXggaW4gc3ViamVjdFtwcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgaWYgKGF2YWlsYWJsZU5vZGVzW3N1YmplY3RbcHJvcGVydHldW29iamVjdGluZGV4XVtpZEtleV1dKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFub2RlTWFwW3N1YmplY3RbcHJvcGVydHldW29iamVjdGluZGV4XVtpZEtleV1dKSB7XG4gICAgICAgICAgICAgICAgICBhZGROb2RlKGF2YWlsYWJsZU5vZGVzW3N1YmplY3RbcHJvcGVydHldW29iamVjdGluZGV4XVtpZEtleV1dLHdpZHRoLzIsaGVpZ2h0LzIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL0FkZCBub2RlcyB0aGF0IGhhdmUgdGhlIHN1YmplY3QgYXMgdGFyZ2V0IChkdXBsaWNhdGVzIHdpbGwgYmUgZmlsdGVyZWQgb3V0IGJ5IGFkZE5vZGUgZnVuY3Rpb24pXG4gICAgICAgIGpzb24uZm9yRWFjaChmdW5jdGlvbihyZXNvdXJjZSkge1xuICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHJlc291cmNlKSB7XG4gICAgICAgICAgICBpZiAocHJvcGVydHkhPWlkS2V5ICYmIHByb3BlcnR5IT1lbG1vU3R5bGUpIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgb2JqZWN0aW5kZXggaW4gcmVzb3VyY2VbcHJvcGVydHldKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc291cmNlW3Byb3BlcnR5XVtvYmplY3RpbmRleF1baWRLZXldPT09anNvbkFwaVN1YmplY3QpIHtcbiAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICBhZGROb2RlKHJlc291cmNlLHdpZHRoLzIsaGVpZ2h0LzIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy9VcGRhdGUgYW5kIGdldCBsaW5rc1xuICAgICAgICByb290LmxpbmtzID0gW107XG4gICAgICAgIGpzb24uZm9yRWFjaChmdW5jdGlvbihyZXNvdXJjZSkge1xuICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHJlc291cmNlKSB7XG4gICAgICAgICAgICAvLyBPbmx5IGRpc3BsYXkgaXRlbXMgdGhhdCBhcmUgdXJpJ3MgYW5kIGV4aXN0cyBhcyBub2Rlc1xuICAgICAgICAgICAgaWYgKHByb3BlcnR5IT09aWRLZXkgJiYgcHJvcGVydHkhPT1lbG1vU3R5bGUpIHtcbiAgICAgICAgICAgICAgZm9yIChvYmplY3RpbmRleCBpbiByZXNvdXJjZVtwcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZU1hcFtyZXNvdXJjZVtwcm9wZXJ0eV1bb2JqZWN0aW5kZXhdW2lkS2V5XV0pIHtcbiAgICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IHByb3BlcnR5LnJlcGxhY2UocmVnZXhMYWJlbEZyb21VUkksXCIkMlwiKTtcbiAgICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVVyaSA9IHByb3BlcnR5Oy8vZ2V0RnVsbFVyaShwcm9wZXJ0eSxqc29uW1wiQGNvbnRleHRcIl0pO1xuICAgICAgICAgICAgICAgICAgaWYgKGF2YWlsYWJsZU5vZGVzW3Byb3BlcnR5VXJpXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXZhaWxhYmxlTm9kZXNbcHJvcGVydHlVcmldW3JkZnNMYWJlbF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbCA9IGF2YWlsYWJsZU5vZGVzW3Byb3BlcnR5VXJpXVtyZGZzTGFiZWxdWzBdW1wiQHZhbHVlXCJdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBhZGRMaW5rKHJlc291cmNlW2lkS2V5XSxyZXNvdXJjZVtwcm9wZXJ0eV1bb2JqZWN0aW5kZXhdW2lkS2V5XSxwcm9wZXJ0eSxsYWJlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy9TZXQgZmlyc3Qgbm9kZSB0byBmaXhlZFxuICAgICAgICByb290Lm5vZGVzWzBdLmZpeGVkID0gdHJ1ZTtcbiAgICAgICAgcm9vdC5ub2Rlc1swXS5leHBhbmRlZCA9IHRydWU7XG4gICAgICAgIHVwZGF0ZVRpdGxlKHJvb3Qubm9kZXNbMF0pO1xuXG4gICAgICAgIC8vQ3JlYXRlIG5ldHdvcmtcbiAgICAgICAgcm9vdC5saW5rcy5mb3JFYWNoKGZ1bmN0aW9uKGwpIHtcbiAgICAgICAgICBsLnNvdXJjZS5vdXRMaW5rc1tsLnVyaV0gPSBsLnNvdXJjZS5vdXRMaW5rc1tsLnVyaV0gfHwgW107XG4gICAgICAgICAgbC5zb3VyY2Uub3V0TGlua3NbbC51cmldLnB1c2gobCk7XG4gICAgICAgICAgbC5zb3VyY2UubGlua0NvdW50Kys7XG4gICAgICAgICAgbC5zb3VyY2UucGFyZW50TGluayA9IGw7XG4gICAgICAgICAgbC50YXJnZXQuaW5MaW5rc1tsLnVyaV0gPSBsLnRhcmdldC5pbkxpbmtzW2wudXJpXSB8fCBbXTtcbiAgICAgICAgICBsLnRhcmdldC5pbkxpbmtzW2wudXJpXS5wdXNoKGwpO1xuICAgICAgICAgIGwudGFyZ2V0LmxpbmtDb3VudCsrO1xuICAgICAgICAgIGwudGFyZ2V0LnBhcmVudExpbmsgPSBsO1xuICAgICAgICB9KTtcblxuICAgICAgICBjcmVhdGVBZ2dyZWdhdGVOb2RlcygpO1xuICAgICAgICB1cGRhdGUoKTtcblxuICAgICAgfTtcbiAgICB9KTtcblxuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkTm9kZShyZXNvdXJjZSx4LHkpIHtcblxuICAvL09ubHkgYWRkIGEgbm9kZSBpZiBpdCBkb2Vzbid0IGV4aXN0cyBhbHJlYWR5XG4gIGlmICghbm9kZU1hcFtyZXNvdXJjZVtpZEtleV1dKSB7XG5cbiAgICB2YXIgbm9kZUNsYXNzID0gXCJcIjtcbiAgICBpZiAocmVzb3VyY2VbZWxtb1N0eWxlXSkge1xuICAgICAgaWYgKGVsbW9TdHlsZXNbcmVzb3VyY2VbZWxtb1N0eWxlXVswXVtpZEtleV1dKSB7XG4gICAgICAgIG5vZGVDbGFzcyA9IGVsbW9TdHlsZXNbcmVzb3VyY2VbZWxtb1N0eWxlXVswXVtpZEtleV1dO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgbm9kZUxhYmVsID0gcmVzb3VyY2VbaWRLZXldO1xuICAgIGlmIChyZXNvdXJjZVtyZGZzTGFiZWxdKSB7XG4gICAgICBub2RlTGFiZWwgPSByZXNvdXJjZVtyZGZzTGFiZWxdWzBdW1wiQHZhbHVlXCJdO1xuICAgIH1cbiAgICB2YXIgbm9kZURhdGEgPSB7fTtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiByZXNvdXJjZSkge1xuICAgICAgaWYgKHByb3BlcnR5IT09aWRLZXkgJiYgcHJvcGVydHkhPXJkZnNMYWJlbCAmJiAocmVzb3VyY2VbcHJvcGVydHldWzBdW1wiQHZhbHVlXCJdKSkge1xuICAgICAgICBub2RlRGF0YVtwcm9wZXJ0eV09cmVzb3VyY2VbcHJvcGVydHldWzBdW1wiQHZhbHVlXCJdO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgbm9kZSA9IHtcIkBpZFwiOnJlc291cmNlW2lkS2V5XVxuICAgICAgICAsXCJsYWJlbFwiOm5vZGVMYWJlbFxuICAgICAgICAsXCJjbGFzc1wiOm5vZGVDbGFzc1xuICAgICAgICAsXCJkYXRhXCI6IG5vZGVEYXRhXG4gICAgICAgICxcImVsZW1lbnRUeXBlXCI6IFwicmVjdFwiXG4gICAgICAgIH07XG4gICAgaWYgKHJlc291cmNlW2h0bWxJbWFnZV0pIHtcbiAgICAgIG5vZGUuaW1nID0gcmVzb3VyY2VbaHRtbEltYWdlXVswXVtcIkB2YWx1ZVwiXTtcbiAgICAgIG5vZGUuZWxlbWVudFR5cGUgPSBcImltYWdlXCI7XG4gICAgfVxuICAgIHJvb3Qubm9kZXMucHVzaChub2RlKTtcbiAgICBub2RlTWFwW3Jlc291cmNlW2lkS2V5XV0gPSBub2RlO1xuXG4gICAgLy8gc3RhcnRpbmdwb2ludCBvZiBuZXcgbm9kZVxuICAgIG5vZGUueCA9IHg7XG4gICAgbm9kZS55ID0geTtcbiAgICAvL0NyZWF0ZSBuZXR3b3JrOiBpbml0aWFsaXplIG5ldyBub2RlXG4gICAgbm9kZS5pbkxpbmtzID0ge307XG4gICAgbm9kZS5vdXRMaW5rcyA9IHt9O1xuICAgIG5vZGUubGlua0NvdW50ID0gMDtcbiAgICBub2RlLnBhcmVudExpbms7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBhZGRMaW5rKHNvdXJjZVVyaSx0YXJnZXRVcmkscHJvcGVydHlVcmkscHJvcGVydHlMYWJlbCkge1xuXG4gIGlmIChsaW5rTWFwW3NvdXJjZVVyaSt0YXJnZXRVcmldKSB7XG4gICAgLy9MaW5rIGFscmVhZHkgZXhpc3RzLCBhZGQgbGFiZWwgdG8gZXhpc3RpbmcgbGlua1xuICAgIGxpbmtNYXBbc291cmNlVXJpK3RhcmdldFVyaV0ubGFiZWwrPSBcIiwgXCIrcHJvcGVydHlMYWJlbDtcbiAgICByZXR1cm4gbGlua01hcFtzb3VyY2VVcmkrdGFyZ2V0VXJpXVxuICB9IGVsc2Uge1xuICAgIC8vTmV3IGxpbmtcbiAgICB2YXIgbCA9IHtcImlkXCI6c291cmNlVXJpK3RhcmdldFVyaVxuICAgICAgICAgICAgLFwic291cmNlXCI6bm9kZU1hcFtzb3VyY2VVcmldXG4gICAgICAgICAgICAsXCJ0YXJnZXRcIjpub2RlTWFwW3RhcmdldFVyaV1cbiAgICAgICAgICAgICxcInVyaVwiOnByb3BlcnR5VXJpXG4gICAgICAgICAgICAsXCJsYWJlbFwiOnByb3BlcnR5TGFiZWxcbiAgICAgICAgICAgIH07XG4gICAgbGlua01hcFtsLmlkXT1sO1xuICAgIHJvb3QubGlua3MucHVzaChsKTtcbiAgICByZXR1cm4gbDtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIG1vdmVQcm9wZXJ0eUJveCgpIHtcblx0aWYgKHByb3BlcnR5Qm94VmlzaWJsZSAmJiBwcm9wZXJ0eU5vZGUpIHtcblx0XHRpZiAocHJvcGVydHlOb2RlLmFyZWN0KSB7XG5cdFx0XHRwcm9wZXJ0eUJveC5zdHlsZShcImRpc3BsYXlcIixcImJsb2NrXCIpO1xuXHRcdFx0Ly9HZXQgYWJzb2x1dGUgcG9zaXRpb25cblx0XHRcdHZhciBtYXRyaXggID0gcHJvcGVydHlOb2RlLmFyZWN0LmdldFNjcmVlbkNUTSgpO1xuXHRcdFx0aWYgKHByb3BlcnR5Tm9kZS5hcmVjdC5ub2RlTmFtZT09PSdyZWN0Jykge1xuXHRcdFx0XHRwdC54ID0gcHJvcGVydHlOb2RlLmFyZWN0LnguYW5pbVZhbC52YWx1ZStwcm9wZXJ0eU5vZGUuYXJlY3Qud2lkdGguYW5pbVZhbC52YWx1ZTtcblx0XHRcdFx0cHQueSA9IHByb3BlcnR5Tm9kZS5hcmVjdC55LmFuaW1WYWwudmFsdWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAocHJvcGVydHlOb2RlLmFyZWN0Lm5vZGVOYW1lPT09J2NpcmNsZScpIHtcblx0XHRcdFx0cHQueCA9IHByb3BlcnR5Tm9kZS5hcmVjdC5jeC5hbmltVmFsLnZhbHVlK3Byb3BlcnR5Tm9kZS5hcmVjdC5yLmFuaW1WYWwudmFsdWU7XG5cdFx0XHRcdHB0LnkgPSBwcm9wZXJ0eU5vZGUuYXJlY3QuY3kuYW5pbVZhbC52YWx1ZS1wcm9wZXJ0eU5vZGUuYXJlY3Quci5hbmltVmFsLnZhbHVlO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGRpdnJlY3QgPSBwdC5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0XHRcdC8vQ29ycmVjdCBmb3Igb2Zmc2V0IGFuZCBzY3JvbGxcblx0XHRcdHZhciB0aGVYID0gZGl2cmVjdC54LSQoJyNncmFwaGNhbnZhcycpLm9mZnNldCgpLmxlZnQrJCh3aW5kb3cpLnNjcm9sbExlZnQoKTtcblx0XHRcdHZhciB0aGVZID0gZGl2cmVjdC55LSQoJyNncmFwaGNhbnZhcycpLm9mZnNldCgpLnRvcCskKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cdFx0XHQvL1NldCBwb3NpdGlvblxuXHRcdFx0cHJvcGVydHlCb3guc3R5bGUoXCJsZWZ0XCIsdGhlWCtcInB4XCIpO1xuXHRcdFx0cHJvcGVydHlCb3guc3R5bGUoXCJ0b3BcIix0aGVZK1wicHhcIik7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIG1vdXNlb3Zlck5vZGUoZCkge1xuXHRpZiAoIXByb3BlcnR5Qm94VmlzaWJsZSkge1xuXHRcdHByb3BlcnR5Tm9kZSA9IGQ7XG5cdFx0cHJvcGVydHlCb3hWaXNpYmxlID0gdHJ1ZTtcblx0XHRtb3ZlUHJvcGVydHlCb3goKTtcblx0XHRpZiAoaW5mb05vZGUhPXByb3BlcnR5Tm9kZSkge1xuXHRcdFx0dmFyIGh0bWw9Jyc7XG5cdFx0XHRpbmZvQm94Lmh0bWwoaHRtbCk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIG1vdXNlb3V0Tm9kZShkKSB7XG5cdGlmIChwcm9wZXJ0eUJveFZpc2libGUpIHtcblx0XHRwcm9wZXJ0eUJveFZpc2libGUgPSBmYWxzZTtcblx0XHRwcm9wZXJ0eUJveC5zdHlsZShcImRpc3BsYXlcIixcIm5vbmVcIik7XG5cdFx0aWYgKGluZm9Ob2RlIT1wcm9wZXJ0eU5vZGUpIHtcblx0XHRcdHZhciBodG1sPScnO1xuXHRcdFx0aW5mb0JveC5odG1sKGh0bWwpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBtb3VzZW92ZXJQcm9wZXJ0eUJveCgpIHtcblx0aWYgKCFwcm9wZXJ0eUJveFZpc2libGUpIHtcblx0XHRwcm9wZXJ0eUJveC5zdHlsZShcImRpc3BsYXlcIixcImJsb2NrXCIpO1xuXHRcdHByb3BlcnR5Qm94VmlzaWJsZSA9IHRydWU7XG5cdH1cbn1cblxuZnVuY3Rpb24gbW91c2VvdXRQcm9wZXJ0eUJveCgpIHtcblx0cHJvcGVydHlCb3guc3R5bGUoXCJkaXNwbGF5XCIsXCJub25lXCIpO1xuXHRwcm9wZXJ0eUJveFZpc2libGUgPSBmYWxzZTtcblx0aWYgKGluZm9Ob2RlIT1wcm9wZXJ0eU5vZGUpIHtcblx0XHR2YXIgaHRtbD0nJztcblx0XHRpbmZvQm94Lmh0bWwoaHRtbCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlQWdncmVnYXRlTm9kZXMoKSB7XG5cblx0Ly9BZGQgYW4gYWdncmVnYXRlTm9kZSBmb3IgYW55IG5vZGUgdGhhdCBoYXMgbW9yZSB0aGFuIG1heE5vZGVzIG91dGdvaW5nIE9SIGluZ29pbmcgbGlua3Ncblx0cm9vdC5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG4pIHtcblx0XHRpZiAoIW4uYWdncmVnYXRlTm9kZSkge1xuXHRcdFx0T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobi5vdXRMaW5rcykuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG5cdFx0XHRcdHZhciBkID0gbi5vdXRMaW5rc1twcm9wXTtcblx0XHRcdFx0aWYgKGQubGVuZ3RoPj1tYXhOb2Rlcykge1xuXHRcdFx0XHRcdGlmICghbm9kZU1hcFtuW1wiQGlkXCJdK2RbMF0udXJpXSkge1xuXHRcdFx0XHRcdFx0dmFyIGFOb2RlID0ge1wiQGlkXCI6bltcIkBpZFwiXStkWzBdLnVyaSxkYXRhOnt9LGxhYmVsOmRbMF0ubGFiZWwsdXJpOmRbMF0udXJpLGVsZW1lbnRUeXBlOlwiY2lyY2xlXCIsYWdncmVnYXRlTm9kZTp0cnVlLGluYm91bmQ6ZmFsc2UsY291bnQ6ZC5sZW5ndGgsbGlua3M6ZH07XG5cdFx0XHRcdFx0XHRyb290Lm5vZGVzLnB1c2goYU5vZGUpO1xuXHRcdFx0XHRcdFx0cm9vdC5saW5rcy5wdXNoKHtpZDpuW1wiQGlkXCJdK2RbMF0udXJpLHNvdXJjZTpuLHRhcmdldDphTm9kZSxsYWJlbDpkWzBdLmxhYmVsLHVyaTpkWzBdLnVyaX0pO1xuXHRcdFx0XHRcdFx0bm9kZU1hcFthTm9kZVtcIkBpZFwiXV09YU5vZGU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG4uaW5MaW5rcykuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG5cdFx0XHRcdHZhciBkID0gbi5pbkxpbmtzW3Byb3BdO1xuXHRcdFx0XHRpZiAoZC5sZW5ndGg+PW1heE5vZGVzKSB7XG5cdFx0XHRcdFx0aWYgKCFub2RlTWFwW25bXCJAaWRcIl0rZFswXS51cmldKSB7XG5cdFx0XHRcdFx0XHR2YXIgYU5vZGUgPSB7XCJAaWRcIjpuW1wiQGlkXCJdK2RbMF0udXJpLGRhdGE6e30sbGFiZWw6ZFswXS5sYWJlbCx1cmk6ZFswXS51cmksZWxlbWVudFR5cGU6XCJjaXJjbGVcIixhZ2dyZWdhdGVOb2RlOnRydWUsaW5ib3VuZDp0cnVlLGNvdW50OmQubGVuZ3RoLGxpbmtzOmR9O1xuXHRcdFx0XHRcdFx0cm9vdC5ub2Rlcy5wdXNoKGFOb2RlKTtcblx0XHRcdFx0XHRcdHJvb3QubGlua3MucHVzaCh7aWQ6bltcIkBpZFwiXStkWzBdLnVyaSxzb3VyY2U6YU5vZGUsdGFyZ2V0Om4sbGFiZWw6ZFswXS5sYWJlbCx1cmk6ZFswXS51cml9KTtcblx0XHRcdFx0XHRcdG5vZGVNYXBbYU5vZGVbXCJAaWRcIl1dPWFOb2RlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcblx0Ly9EbyBhIHJlY291bnQgb2YgbnVtYmVyIG9mIGNvbm5lY3Rpb25zXG5cdC8vKGNvdW50IGlzIG51bWJlciBvZiBjb25uZWN0aW9ucyBtaW51cyB0aGUgY29ubmVjdGlvbnMgdGhhdCByZW1haW4gdmlzaWJsZVxuXHRyb290Lm5vZGVzLmZvckVhY2goZnVuY3Rpb24obikge1xuXHRcdGlmIChuLmFnZ3JlZ2F0ZU5vZGUpIHtcblx0XHRcdG4uY291bnQgPSBuLmxpbmtzLmZpbHRlcihmdW5jdGlvbihkKSB7cmV0dXJuICgoZC50YXJnZXQubGlua0NvdW50PD0xKSB8fCAoZC5zb3VyY2UubGlua0NvdW50PD0xKSl9KS5sZW5ndGg7XG5cdFx0fVxuXHR9KTtcbn1cblxudmFyIG5vZGVfZHJhZyA9IGQzLmJlaGF2aW9yLmRyYWcoKVxuXHQub24oXCJkcmFnc3RhcnRcIiwgZHJhZ3N0YXJ0KVxuXHQub24oXCJkcmFnXCIsIGRyYWdtb3ZlKVxuXHQub24oXCJkcmFnZW5kXCIsIGRyYWdlbmQpO1xuXG5mdW5jdGlvbiB1cGRhdGVUaXRsZShkKSB7XG5cdHZhciBodG1sID0gJzxoMyBjbGFzcz1cInBhbmVsLXRpdGxlXCI+PGEgc3R5bGU9XCJmb250LXNpemU6MTZweFwiIGhyZWY9XCInK3VyaUVuZHBvaW50K2VuY29kZVVSSUNvbXBvbmVudChkWydAaWQnXSkrJ1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1uZXctd2luZG93XCIvPjwvYT4gJytkLmxhYmVsO1xuXHRpZiAoIWQuZXhwYW5kZWQpIHtcblx0XHRodG1sKz0nIDxhIG9uY2xpY2s9XCJSREZWaXouZXhwYW5kKCk7XCIgY2xhc3M9XCJiYWRnZVwiIHN0eWxlPVwiZm9udC1zaXplOjEycHhcIj4nO1xuXHRcdGlmIChkLmRhdGFbJ2NvdW50J10pIHtcblx0XHRcdGh0bWwrPWQuZGF0YVsnY291bnQnXVxuXHRcdH07XG5cdFx0aHRtbCs9JzxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi16b29tLWluXCIvPjwvYT4nO1xuXHR9XG5cdGh0bWwrPSc8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tZnVsbHNjcmVlblwiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7cmlnaHQ6MTBweDttYXJnaW4tdG9wOjEwcHg7Y3Vyc29yOnBvaW50ZXJcIiBvbmNsaWNrPVwiUkRGVml6LnRvZ2dsZWZ1bGxzY3JlZW4oKVwiLz4nO1xuXHRodG1sKz0nPC9oMz4nO1xuXHRkZXRhaWxCb3guaHRtbChodG1sKTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlZnVsbHNjcmVlbigpIHtcblx0aWYgKGZ1bGxTY3JlZW5GbGFnKSB7XG5cdFx0JCgnI2dyYXBoY2FudmFzJykuY3NzKHtwb3NpdGlvbjoncmVsYXRpdmUnLGxlZnQ6JycsdG9wOicnLHdpZHRoOicnLGhlaWdodDonJyx6SW5kZXg6Jyd9KTtcblx0XHQvL2QzLnNlbGVjdCgnI2dyYXBoY2FudmFzJykuc2V0QXR0cmlidXRlKFwic3R5bGVcIixcInJlbGF0aXZlXCIpO1xuXHR9IGVsc2Uge1xuXHRcdCQoJyNncmFwaGNhbnZhcycpLmNzcyh7cG9zaXRpb246J2Fic29sdXRlJyxsZWZ0OjAsdG9wOjAsd2lkdGg6ICQod2luZG93KS53aWR0aCgpLCBoZWlnaHQ6ICQod2luZG93KS5oZWlnaHQoKSwgekluZGV4OiAxMDAwfSk7XG5cdFx0Ly9kMy5zZWxlY3QoJyNncmFwaGNhbnZhcycpLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsXCJwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7dG9wOjA7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJVwiKTtcblx0XHRkMy5zZWxlY3QoXCIjZ3JhcGhcIikuc2VsZWN0KFwic3ZnXCIpLmF0dHIoXCJoZWlnaHRcIiwkKHdpbmRvdykuaGVpZ2h0KCktMTAwKTtcblx0fVxuXHRmdWxsU2NyZWVuRmxhZyA9ICFmdWxsU2NyZWVuRmxhZztcbn1cblxuZnVuY3Rpb24gZHJhZ3N0YXJ0KGQpIHtcblx0ZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdGZvcmNlLnN0b3AoKTtcblx0Y3VycmVudE5vZGUgPSBkO1xuXHR1cGRhdGVUaXRsZShkKTtcbn1cbmZ1bmN0aW9uIGRyYWdtb3ZlKGQpIHtcblx0ZC5weCArPSBkMy5ldmVudC5keDtcblx0ZC5weSArPSBkMy5ldmVudC5keTtcblx0ZC54ICs9IGQzLmV2ZW50LmR4O1xuXHRkLnkgKz0gZDMuZXZlbnQuZHk7XG5cdHRpY2soKTtcbn1cbmZ1bmN0aW9uIGRyYWdlbmQoZCkge1xuXHRkLmZpeGVkID0gdHJ1ZTtcblx0dGljaygpO1xuXHRmb3JjZS5yZXN1bWUoKTtcbn1cblxuZnVuY3Rpb24gem9vbWVkKCkge1xuXHRjb250YWluZXIuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIGQzLmV2ZW50LnRyYW5zbGF0ZSArIFwiKXNjYWxlKFwiICsgZDMuZXZlbnQuc2NhbGUgKyBcIilcIik7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZSgpIHtcblxuXHQvL0tlZXAgb25seSB0aGUgdmlzaWJsZSBub2Rlc1xuXHR2YXIgbm9kZXMgPSByb290Lm5vZGVzLmZpbHRlcihmdW5jdGlvbihkKSB7XG5cdFx0cmV0dXJuIGQuYWdncmVnYXRlTm9kZSA/ICghZC5leHBhbmRlZCkgJiYgKGQuY291bnQ+MCkgOiAoKCFkLmhpZGUpICYmICgoZC5saW5rQ291bnQ+MSkgfHwgKChkLnBhcmVudExpbmsuc291cmNlLm91dExpbmtzW2QucGFyZW50TGluay51cmldLmxlbmd0aCA8IG1heE5vZGVzKSAmJiAoZC5wYXJlbnRMaW5rLnRhcmdldC5pbkxpbmtzW2QucGFyZW50TGluay51cmldLmxlbmd0aCA8IG1heE5vZGVzKSkpKVxuXHR9KTtcblx0dmFyIGxpbmtzID0gcm9vdC5saW5rcztcblx0Ly9LZWVwIG9ubHkgdGhlIHZpc2libGUgbGlua3Ncblx0bGlua3MgPSByb290LmxpbmtzLmZpbHRlcihmdW5jdGlvbihkKSB7XG5cdFx0cmV0dXJuIGQuc291cmNlLmFnZ3JlZ2F0ZU5vZGUgPyAoIWQuc291cmNlLmV4cGFuZGVkKSAmJiAoZC5zb3VyY2UuY291bnQ+MCkgOiBkLnRhcmdldC5hZ2dyZWdhdGVOb2RlID8gKCFkLnRhcmdldC5leHBhbmRlZCkgJiYgKGQudGFyZ2V0LmNvdW50PjApIDogKCFkLnNvdXJjZS5oaWRlKSAmJiAoIWQudGFyZ2V0LmhpZGUpICYmICgoKGQuc291cmNlLmxpbmtDb3VudD4xKSAmJiAoZC50YXJnZXQubGlua0NvdW50PjEpKSB8fCAoKGQuc291cmNlLm91dExpbmtzW2QudXJpXS5sZW5ndGggPCBtYXhOb2RlcykgJiYgKGQudGFyZ2V0LmluTGlua3NbZC51cmldLmxlbmd0aCA8IG1heE5vZGVzKSkpXG5cdH0pO1xuXG5cdC8vIFVwZGF0ZSB0aGUgbGlua3Ncblx0YWxsTGlua3MgPSBhbGxMaW5rcy5kYXRhKGxpbmtzLGZ1bmN0aW9uKGQpIHtyZXR1cm4gZC5pZH0pO1xuXG5cdC8vIEV4aXQgYW55IG9sZCBsaW5rcy5cblx0YWxsTGlua3MuZXhpdCgpLnJlbW92ZSgpO1xuXG5cdC8vIEVudGVyIGFueSBuZXcgbGlua3MuXG5cdHZhciBuZXdMaW5rcyA9IGFsbExpbmtzXG5cdFx0LmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gXCJsaW5rXCIrKGQuc291cmNlW1wiY2xhc3NcIl0gPyBcIiB0XCIrZC5zb3VyY2VbXCJjbGFzc1wiXSA6IFwiXCIpKyhkLnRhcmdldFtcImNsYXNzXCJdID8gXCIgdFwiK2QudGFyZ2V0W1wiY2xhc3NcIl0gOiBcIlwiKSB9KTtcblxuXHRuZXdMaW5rcy5hcHBlbmQoXCJsaW5lXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLFwiYm9yZGVyXCIpXG5cdG5ld0xpbmtzLmFwcGVuZChcImxpbmVcIilcblx0XHQuc3R5bGUoXCJtYXJrZXItZW5kXCIsIFwidXJsKCNBcnJvd0hlYWQpXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLFwic3Ryb2tlXCIpO1xuXHRuZXdMaW5rcy5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0LmF0dHIoXCJkeFwiLCAwKVxuXHRcdC5hdHRyKFwiZHlcIiwgMClcblx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLFwic3Ryb2tlLXRleHRcIilcblx0XHQudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkLmxhYmVsIH0pO1xuXG5cdC8vIFVwZGF0ZSB0aGUgbm9kZXNcblx0YWxsTm9kZXMgPSBhbGxOb2Rlcy5kYXRhKG5vZGVzLGZ1bmN0aW9uKGQpIHtyZXR1cm4gZFtcIkBpZFwiXX0pO1xuXG5cdC8vIFVwZGF0ZSB0ZXh0IChjb3VudCBvZiBhbiBhZ2dyZWdhdGVOb2RlIG1pZ2h0IGNoYW5nZSlcblx0YWxsTm9kZXMuc2VsZWN0KFwidGV4dFwiKS50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuYWdncmVnYXRlTm9kZSA/IGQuY291bnQgOiBkLmxhYmVsIH0pO1xuXG5cdC8vIEV4aXQgYW55IG9sZCBub2Rlcy5cblx0YWxsTm9kZXMuZXhpdCgpLnJlbW92ZSgpO1xuXG5cdC8vIEVudGVyIGFueSBuZXcgbm9kZXMuXG5cdHZhciBuZXdOb2RlcyA9IGFsbE5vZGVzXG5cdFx0LmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gKGRbXCJjbGFzc1wiXSA/IFwibm9kZSB0XCIrZFtcImNsYXNzXCJdIDogXCJub2RlXCIpfSlcblx0XHQub24oXCJtb3VzZW92ZXJcIixtb3VzZW92ZXJOb2RlKVxuXHRcdC5vbihcIm1vdXNlb3V0XCIsbW91c2VvdXROb2RlKVxuXHRcdC5jYWxsKG5vZGVfZHJhZyk7XG5cbiAgbmV3Tm9kZXMuYXBwZW5kKFwidGV4dFwiKVxuXHRcdC5hdHRyKFwiZHhcIiwgMClcblx0XHQuYXR0cihcImR5XCIsIGZ1bmN0aW9uKGQpIHtyZXR1cm4gZC5lbGVtZW50VHlwZT09PVwiaW1hZ2VcIiA/IDQwIDogMH0pXG5cdFx0LmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIixcIm5vZGUtdGV4dFwiKVxuXHRcdC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuYWdncmVnYXRlTm9kZSA/IGQuY291bnQgOiBkLmxhYmVsIH0pXG5cdFx0LmVhY2goZnVuY3Rpb24oZCkge2QucmVjdCA9IHRoaXMuZ2V0QkJveCgpO1x0ZC5yZWN0LnkgPSBkLnJlY3QueSAtIChkLmVsZW1lbnRUeXBlPT09XCJpbWFnZVwiID8gNDAgOiAwKTt9KTtcblxuICBuZXdOb2Rlcy5maWx0ZXIoZnVuY3Rpb24oZCkge3JldHVybiBkLmVsZW1lbnRUeXBlPT09XCJpbWFnZVwifSkuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgLmF0dHIoXCJjeFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnJlY3QueCtkLnJlY3Qud2lkdGgvMn0pXG4gICAgLmF0dHIoXCJjeVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnJlY3QueStkLnJlY3QuaGVpZ2h0LzIrNH0pXG4gICAgLmF0dHIoXCJyXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIDMwIH0pXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkKSB7IHJldHVybiAoZFtcImNsYXNzXCJdID8gXCJzXCIrZFtcImNsYXNzXCJdIDogXCJkZWZhdWx0XCIpIH0pO1xuICBuZXdOb2Rlcy5maWx0ZXIoZnVuY3Rpb24oZCkge3JldHVybiBkLmVsZW1lbnRUeXBlPT09XCJpbWFnZVwifSkuYXBwZW5kKFwiZGVmc1wiKS5hcHBlbmQoXCJwYXR0ZXJuXCIpXG4gICAgLmF0dHIoXCJpZFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBcInBhdHRlcm5fXCIgKyBkW1wiQGlkXCJdfSlcbiAgICAuYXR0cihcInhcIiwgXCIwJVwiKVxuICAgIC5hdHRyKFwieVwiLCBcIjAlXCIpXG4gICAgLmF0dHIoXCJ2aWV3Qm94XCIsXCIwIDAgMTAwIDEwMFwiKVxuICAgIC5hdHRyKFwid2lkdGhcIiwgXCIxMDAlXCIpXG4gICAgLmF0dHIoXCJoZWlnaHRcIiwgXCIxMDAlXCIpXG4gICAgLmFwcGVuZChcImltYWdlXCIpXG4gICAgICAuYXR0cihcInhcIixcIjAlXCIpXG4gICAgICAuYXR0cihcInlcIixcIjAlXCIpXG4gICAgICAuYXR0cihcIndpZHRoXCIsXCIxMDBcIilcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsXCIxMDBcIilcbiAgICAgIC5hdHRyKFwieGxpbms6aHJlZlwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmltZ30pO1xuICBuZXdOb2Rlcy5maWx0ZXIoZnVuY3Rpb24oZCkge3JldHVybiBkLmVsZW1lbnRUeXBlPT09XCJpbWFnZVwifSkuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgLmF0dHIoXCJjeFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnJlY3QueCtkLnJlY3Qud2lkdGgvMn0pXG4gICAgLmF0dHIoXCJjeVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnJlY3QueStkLnJlY3QuaGVpZ2h0LzIrNH0pXG4gICAgLmF0dHIoXCJyXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIDI1IH0pXG4gICAgLmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHtyZXR1cm4gXCJ1cmwoI3BhdHRlcm5fXCIrZFtcIkBpZFwiXStcIilcIn0pXG4gICAgLmVhY2goZnVuY3Rpb24oZCkge2QuYXJlY3QgPSB0aGlzO30pO1xuXG5cdG5ld05vZGVzLmZpbHRlcihmdW5jdGlvbihkKSB7cmV0dXJuIGQuZWxlbWVudFR5cGU9PT1cInJlY3RcIn0pLmFwcGVuZChcInJlY3RcIilcblx0XHQuYXR0cihcInhcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5yZWN0LngtNX0pXG5cdFx0LmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQucmVjdC55LTV9KVxuXHRcdC5hdHRyKFwid2lkdGhcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5yZWN0LndpZHRoKzEwIH0pXG5cdFx0LmF0dHIoXCJoZWlnaHRcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5yZWN0LmhlaWdodCsxMCB9KVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gKGRbXCJjbGFzc1wiXSA/IFwic1wiK2RbXCJjbGFzc1wiXSA6IFwiZGVmYXVsdFwiKSB9KVxuXHRcdC5lYWNoKGZ1bmN0aW9uKGQpIHtkLmFyZWN0ID0gdGhpczt9KTtcblxuXHRuZXdOb2Rlcy5maWx0ZXIoZnVuY3Rpb24oZCkge3JldHVybiBkLmVsZW1lbnRUeXBlPT09XCJjaXJjbGVcIn0pLmFwcGVuZChcImNpcmNsZVwiKVxuXHRcdC5hdHRyKFwiY3hcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5yZWN0LngrNX0pXG5cdFx0LmF0dHIoXCJjeVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnJlY3QueSs1fSlcblx0XHQuYXR0cihcInJcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gNStkLnJlY3QuaGVpZ2h0LzIgfSlcblx0XHQuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIChkW1wiY2xhc3NcIl0gPyBcInNcIitkW1wiY2xhc3NcIl0gOiBcImRlZmF1bHRcIikgfSlcblx0XHQuZWFjaChmdW5jdGlvbihkKSB7ZC5hcmVjdCA9IHRoaXM7fSk7XG5cblx0Zm9yY2Vcblx0XHQubm9kZXMobm9kZXMpXG5cdFx0LmxpbmtzKGxpbmtzKVxuXHRcdC5zdGFydCgpO1xuXG59XG5cbmZ1bmN0aW9uIHRvZ2dsZW5vZGUoc2hvdyxub2RlY2xhc3MpIHtcblx0dmFyIHNlbGVjdGVkbm9kZXMgPSBjb250YWluZXIuc2VsZWN0QWxsKFwiLnRcIitub2RlY2xhc3MpXG5cdHNlbGVjdGVkbm9kZXMuc3R5bGUoXCJ2aXNpYmlsaXR5XCIsc2hvdyA/IFwidmlzaWJsZVwiIDogXCJoaWRkZW5cIik7XG59XG5cbmZ1bmN0aW9uIGNsaWNrUHJvcGVydHlCb3goKSB7XG5cdGlmIChwcm9wZXJ0eU5vZGUpIHtcblx0XHRkYmxjbGljayhwcm9wZXJ0eU5vZGUpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGV4cGFuZE9uZUl0ZW0oaWQpIHtcblx0dmFyIHNlbGVjdGVkID0gbm9kZU1hcFtpZF07XG5cdGlmIChzZWxlY3RlZCkge1xuXHRcdHNlbGVjdGVkLmxpbmtDb3VudCsrO1xuXHR9XG5cdGlmIChwcm9wZXJ0eU5vZGUpIHtcblx0XHRpZiAocHJvcGVydHlOb2RlLmFnZ3JlZ2F0ZU5vZGUpIHtcblx0XHRcdHByb3BlcnR5Tm9kZS5jb3VudC09MTtcblx0XHRcdGNsaWNrSW5mb0JveCgpO1xuXHRcdH1cblx0fVxuXHR1cGRhdGUoKTtcbn1cblxuZnVuY3Rpb24gY2xpY2tJbmZvQm94KCkge1xuXHRpZiAocHJvcGVydHlOb2RlKSB7XG5cdFx0aW5mb05vZGUgPSBwcm9wZXJ0eU5vZGU7XG5cdFx0aWYgKHByb3BlcnR5Tm9kZS5hZ2dyZWdhdGVOb2RlKSB7XG5cdFx0XHR2YXIgaHRtbD0gJzx0YWJsZSBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6I0YwRjBGMDtcIj4nO1xuXHRcdFx0cHJvcGVydHlOb2RlLmxpbmtzLmZvckVhY2goZnVuY3Rpb24oeCkge1xuXHRcdFx0XHRpZiAocHJvcGVydHlOb2RlLmluYm91bmQpIHtcblx0XHRcdFx0XHRpZiAoeC5zb3VyY2UubGlua0NvdW50PD0xKSB7IC8vSGFjazogbGlua0NvdW50IGlzIG1pc3VzZWQgdG8gc2hvdyBub2RlcyBmcm9tIGFnZ3JlZ2F0aW9uIVxuXHRcdFx0XHRcdFx0aHRtbCArPSAnPHRyPjx0ZD48YSBvbmNsaWNrPVwiZXhwYW5kT25lSXRlbSh0aGlzLmhyZWYpO3JldHVybiBmYWxzZTtcIiBocmVmPVwiJyArIHguc291cmNlWydAaWQnXSArICdcIj4nICsgeC5zb3VyY2UubGFiZWwgKyAnPC9hPjwvdGQ+PC90cj4nO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoeC50YXJnZXQubGlua0NvdW50PD0xKSB7IC8vSGFjazogbGlua0NvdW50IGlzIG1pc3VzZWQgdG8gc2hvdyBub2RlcyBmcm9tIGFnZ3JlZ2F0aW9uIVxuXHRcdFx0XHRcdFx0aHRtbCArPSAnPHRyPjx0ZD48YSBvbmNsaWNrPVwiZXhwYW5kT25lSXRlbSh0aGlzLmhyZWYpO3JldHVybiBmYWxzZTtcIiBocmVmPVwiJyArIHgudGFyZ2V0WydAaWQnXSArICdcIj4nICsgeC50YXJnZXQubGFiZWwgKyAnPC9hPjwvdGQ+PC90cj4nO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRodG1sICs9IFwiPC90YWJsZT5cIjtcblx0XHRcdGluZm9Cb3guaHRtbChodG1sKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIGh0bWwgPSAnPHRhYmxlPic7XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gcHJvcGVydHlOb2RlLmRhdGEpIHtcbiAgICAgICAgdmFyIGxhYmVsPSBrZXk7XG4gICAgICAgIGlmIChmcmFnbWVudHNba2V5XSkge1xuICAgICAgICAgIGxhYmVsPSBmcmFnbWVudHNba2V5XS5sYWJlbDtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGxhYmVsIT09XCJcIikge1xuXHRcdFx0XHQgIGh0bWwgKz0gJzx0cj48dGQ+JytsYWJlbCsnPC90ZD48dGQgY2xhc3M9XCJkYXRhXCI+Jytwcm9wZXJ0eU5vZGUuZGF0YVtrZXldK1wiPC90ZD48L3RyPlwiO1xuICAgICAgICB9XG5cdFx0XHR9XG5cdFx0XHRodG1sICs9IFwiPC90YWJsZT5cIjtcblx0XHRcdGluZm9Cb3guaHRtbChodG1sKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gdGljayhlKSB7XG5cdC8vRXh0cmE6IENhbGN1bGF0ZSBjaGFuZ2Vcblx0aWYgKHR5cGVvZiBlICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHR2YXIgayA9IDYgKiBlLmFscGhhO1xuXHR9XG5cdGFsbExpbmtzLmVhY2goZnVuY3Rpb24oZCkge1xuXHRcdC8vRXh0cmE6IHRvIGZvcm0gYSBraW5kIG9mIHRyZWVcblx0XHRpZiAodHlwZW9mIGUgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0ZC5zb3VyY2UueSArPSBrO1xuXHRcdFx0ZC50YXJnZXQueSAtPSBrO1xuXHRcdH1cblxuXHRcdC8vQ2FsY3VsYXRpbmcgdGhlIGVkZ2Ugb2YgdGhlIHJlY3RhbmdsZVxuXHRcdC8vKzEgdG8gYXZvaWQgZGl2aWRlIGJ5IHplcm9cblx0XHR2YXIgZHggPSBNYXRoLmFicyhkLnRhcmdldC54IC0gZC5zb3VyY2UueCkrMSxcblx0XHRcdGR5ID0gTWF0aC5hYnMoZC50YXJnZXQueSAtIGQuc291cmNlLnkpKzEsXG5cdFx0XHRkZHggPSBkLnRhcmdldC54IDwgZC5zb3VyY2UueCA/IGR4IDogLWR4LFxuXHRcdFx0ZGR5ID0gZC50YXJnZXQueSA8IGQuc291cmNlLnkgPyBkeSA6IC1keSxcblx0XHRcdHh0ID0gZC50YXJnZXQueCsoZC5zb3VyY2UueCA8IGQudGFyZ2V0LnggPyBNYXRoLm1heChkLnRhcmdldC5yZWN0LngtNSwoZC50YXJnZXQucmVjdC55LTUpKmR4L2R5KSA6IE1hdGgubWluKGQudGFyZ2V0LnJlY3QueC01K2QudGFyZ2V0LnJlY3Qud2lkdGgrMTAsLShkLnRhcmdldC5yZWN0LnktNSkqZHgvZHkpKSxcblx0XHRcdHl0ID0gZC50YXJnZXQueSsoZC5zb3VyY2UueSA8IGQudGFyZ2V0LnkgPyBNYXRoLm1heChkLnRhcmdldC5yZWN0LnktNSwoZC50YXJnZXQucmVjdC54LTUpKmR5L2R4KSA6IE1hdGgubWluKGQudGFyZ2V0LnJlY3QueS01K2QudGFyZ2V0LnJlY3QuaGVpZ2h0KzEwLC0oZC50YXJnZXQucmVjdC54LTUpKmR5L2R4KSksXG5cdFx0XHR4cyA9IGQuc291cmNlLngrKGQudGFyZ2V0LnggPCBkLnNvdXJjZS54ID8gTWF0aC5tYXgoZC5zb3VyY2UucmVjdC54LTUsKGQuc291cmNlLnJlY3QueS01KSpkeC9keSkgOiBNYXRoLm1pbihkLnNvdXJjZS5yZWN0LngtNStkLnNvdXJjZS5yZWN0LndpZHRoKzEwLC0oZC5zb3VyY2UucmVjdC55LTUpKmR4L2R5KSksXG5cdFx0XHR5cyA9IGQuc291cmNlLnkrKGQudGFyZ2V0LnkgPCBkLnNvdXJjZS55ID8gTWF0aC5tYXgoZC5zb3VyY2UucmVjdC55LTUsKGQuc291cmNlLnJlY3QueC01KSpkeS9keCkgOiBNYXRoLm1pbihkLnNvdXJjZS5yZWN0LnktNStkLnNvdXJjZS5yZWN0LmhlaWdodCsxMCwtKGQuc291cmNlLnJlY3QueC01KSpkeS9keCkpO1xuXG5cdFx0XHRpZiAoZC50YXJnZXQuZWxlbWVudFR5cGU9PT1cImNpcmNsZVwiKSB7XG5cdFx0XHRcdHZhciBwbCA9IE1hdGguc3FydCgoZGR4KmRkeCkrKGRkeSpkZHkpKSxcblx0XHRcdFx0XHRyYWQgPSA1K2QudGFyZ2V0LnJlY3QuaGVpZ2h0LzI7XG5cdFx0XHRcdHh0ID0gZC50YXJnZXQueCsoKGRkeCpyYWQpL3BsKSsyO1xuXHRcdFx0XHR5dCA9IGQudGFyZ2V0LnkrKChkZHkqcmFkKS9wbCktNTtcblx0XHRcdH1cblx0XHRcdGlmIChkLnNvdXJjZS5lbGVtZW50VHlwZT09PVwiY2lyY2xlXCIpIHtcblx0XHRcdFx0dmFyIHBsID0gTWF0aC5zcXJ0KChkZHgqZGR4KSsoZGR5KmRkeSkpLFxuXHRcdFx0XHRcdHJhZCA9IDUrZC5zb3VyY2UucmVjdC5oZWlnaHQvMjtcblx0XHRcdFx0eHMgPSBkLnNvdXJjZS54LSgoZGR4KnJhZCkvcGwpO1xuXHRcdFx0XHR5cyA9IGQuc291cmNlLnktKChkZHkqcmFkKS9wbCktNTtcblx0XHRcdH1cblxuICAgICAgaWYgKGQudGFyZ2V0LmVsZW1lbnRUeXBlPT09XCJpbWFnZVwiKSB7XG4gICAgICAgICAgdmFyIHBsID0gTWF0aC5zcXJ0KChkZHgqZGR4KSsoZGR5KmRkeSkpLFxuICAgICAgICAgIHJhZCA9IDMwO1xuICAgICAgICAgIHh0ID0gZC50YXJnZXQueCsoKGRkeCpyYWQpL3BsKTtcbiAgICAgICAgICB5dCA9IGQudGFyZ2V0LnkrKChkZHkqcmFkKS9wbCk7XG4gICAgICB9XG4gICAgICBpZiAoZC5zb3VyY2UuZWxlbWVudFR5cGU9PT1cImltYWdlXCIpIHtcbiAgICAgICAgICB2YXIgcGwgPSBNYXRoLnNxcnQoKGRkeCpkZHgpKyhkZHkqZGR5KSksXG4gICAgICAgICAgcmFkID0gMzA7XG4gICAgICAgICAgeHMgPSBkLnNvdXJjZS54LSgoZGR4KnJhZCkvcGwpO1xuICAgICAgICAgIHlzID0gZC5zb3VyY2UueS0oKGRkeSpyYWQpL3BsKTtcbiAgICAgIH1cblxuXHRcdC8vQ2hhbmdlIHRoZSBwb3NpdGlvbiBvZiB0aGUgbGluZXMsIHRvIG1hdGNoIHRoZSBib3JkZXIgb2YgdGhlIHJlY3RhbmdsZSBpbnN0ZWFkIG9mIHRoZSBjZW50cmUgb2YgdGhlIHJlY3RhbmdsZVxuXHRcdGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoXCJsaW5lXCIpXG5cdFx0XHQuYXR0cihcIngxXCIseHMpXG5cdFx0XHQuYXR0cihcInkxXCIseXMpXG5cdFx0XHQuYXR0cihcIngyXCIseHQpXG5cdFx0XHQuYXR0cihcInkyXCIseXQpO1xuXG5cdFx0Ly9Sb3RhdGUgdGhlIHRleHQgdG8gbWF0Y2ggdGhlIGFuZ2xlIG9mIHRoZSBsaW5lc1xuXHRcdHZhciB0eCA9IHhzKyh4dC14cykqMi8zLCAvL3NldCBsYWJlbCBhdCAyLzMgb2YgZWRnZSAodG8gc29sdmUgc2l0dWF0aW9uIHdpdGggb3ZlcmxhcHBpbmcgZWRnZXMpXG5cdFx0XHR0eSA9IHlzKyh5dC15cykqMi8zO1xuXHRcdGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG5cdFx0XHQuYXR0cihcInhcIix0eClcblx0XHRcdC5hdHRyKFwieVwiLHR5LTMpXG5cdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLFwicm90YXRlKFwiK01hdGguYXRhbihkZHkvZGR4KSo1NytcIiBcIit0eCtcIiBcIit0eStcIilcIik7XG5cblx0XHQvL0lFMTAgYW5kIElFMTEgYnVnZml4XG5cdFx0aWYgKGJ1Z0lFKSB7XG5cdFx0XHR0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMsdGhpcyk7XG5cdFx0fVxuXHR9KVxuXG4gICAgYWxsTm9kZXMuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBcInRyYW5zbGF0ZShcIiArIGQueCArIFwiLFwiICsgZC55ICsgXCIpXCI7IH0pO1xuXHRtb3ZlUHJvcGVydHlCb3goKTtcblxufVxuXG5mdW5jdGlvbiBleHBhbmQoKSB7XG5cdGlmIChjdXJyZW50Tm9kZSkge1xuXHRcdGRibGNsaWNrKGN1cnJlbnROb2RlKVxuXHR9XG59XG5cbmZ1bmN0aW9uIGRibGNsaWNrKGQpIHtcblx0Ly8gRml4ZWQgcG9zaXRpb24gb2YgYSBub2RlIGNhbiBiZSByZWxheGVkIGFmdGVyIGEgdXNlciBkb3VibGVjbGlja3MgQU5EIHRoZSBub2RlIGhhcyBiZWVuIGV4cGFuZGVkXG5cdGQuZml4ZWQgPSBkLmV4cGFuZGVkID8gIWQuZml4ZWQgOiBkLmZpeGVkO1xuXG5cdC8vQ2hlY2sgZm9yIGFnZ3JlZ2F0ZSBub2RlXG5cdGlmICghZC5hZ2dyZWdhdGVOb2RlKSB7XG5cdFx0Ly9Pbmx5IHF1ZXJ5IGlmIHRoZSBub2RlcyBoYXNuJ3QgYmVlbiBleHBhbmRlZCB5ZXRcblx0XHRpZiAoIWQuZXhwYW5kZWQpIHtcblx0XHRcdC8vRmV0Y2ggbmV3IGRhdGEgdmlhIEFqYXggY2FsbFxuICAgICAgZDMueGhyKGpzb25BcGlDYWxsK2VuY29kZVVSSUNvbXBvbmVudChkWydAaWQnXSksXCJhcHBsaWNhdGlvbi9sZCtqc29uXCIsIGZ1bmN0aW9uKGVycm9yLCB4aHIpIHtcblxuICAgICAgICAvL1BhcnNlIHhociBhcyBpZiBpdCB3YXMganNvblxuICAgICAgICBqc29ubGQuZXhwYW5kKEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCksZnVuY3Rpb24gKGVyciwganNvbikge1xuICAgICAgICAgIGlmICghZXJyKSB7XG5cbiAgICAgICAgICAgIC8vU3RpamxlbiBvcGhhbGVuXG4gICAgICAgICAgICBqc29uLmZvckVhY2goZnVuY3Rpb24ocmVzb3VyY2UpIHtcbiAgICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgIGlmIChlbG1vTmFtZSBpbiByZXNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGVsbW9TdHlsZXNbcmVzb3VyY2VbXCJAaWRcIl1dPXJlc291cmNlW2VsbW9OYW1lXVswXVtcIkB2YWx1ZVwiXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGF2YWlsYWJsZU5vZGVzID0ge307XG4gICAgICAgICAgICBqc29uLmZvckVhY2goZnVuY3Rpb24oeCkgeyBhdmFpbGFibGVOb2Rlc1t4W2lkS2V5XV0gPSB4OyB9KTtcblxuICAgICAgICAgICAgLy9GaW5kIHN1YmplY3QgYW5kIGluc2VydFxuICAgICAgICAgICAgdmFyIHN1YmplY3QgPSBqc29uLmZpbHRlcihmdW5jdGlvbihyKSB7cmV0dXJuIChyW2lkS2V5XT09PWRbJ0BpZCddKX0pWzBdO1xuXG4gICAgICAgICAgICAvL0FkZCBub2RlcyB0aGF0IGFyZSBsaW5rZWQgZnJvbSB0aGUgc3ViamVjdCBhbmQgYXZhaWxhYmxlXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBzdWJqZWN0KSB7XG4gICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSE9PWlkS2V5ICYmIHByb3BlcnR5IT09ZWxtb1N0eWxlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgb2JqZWN0aW5kZXggaW4gc3ViamVjdFtwcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICAgIGlmIChhdmFpbGFibGVOb2Rlc1tzdWJqZWN0W3Byb3BlcnR5XVtvYmplY3RpbmRleF1baWRLZXldXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW5vZGVNYXBbc3ViamVjdFtwcm9wZXJ0eV1bb2JqZWN0aW5kZXhdW2lkS2V5XV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAvLyBzdGFydGluZ3BvaW50IG9mIG5ldyBub2RlcyA9IHBvc2l0aW9uIHN0YXJ0aW5nIG5vZGVcbiAgICAgICAgICAgICAgICAgICAgICBhZGROb2RlKGF2YWlsYWJsZU5vZGVzW3N1YmplY3RbcHJvcGVydHldW29iamVjdGluZGV4XVtpZEtleV1dLGQueCxkLnkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy9BZGQgbm9kZXMgdGhhdCBoYXZlIHRoZSBzdWJqZWN0IGFzIHRhcmdldCAoZHVwbGljYXRlcyB3aWxsIGJlIGZpbHRlcmVkIG91dCBieSBhZGROb2RlIGZ1bmN0aW9uKVxuICAgICAgICAgICAganNvbi5mb3JFYWNoKGZ1bmN0aW9uKHJlc291cmNlKSB7XG4gICAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiByZXNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSE9aWRLZXkgJiYgcHJvcGVydHkhPWVsbW9TdHlsZSkge1xuICAgICAgICAgICAgICAgICAgZm9yICh2YXIgb2JqZWN0aW5kZXggaW4gcmVzb3VyY2VbcHJvcGVydHldKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZVtwcm9wZXJ0eV1bb2JqZWN0aW5kZXhdW2lkS2V5XT09PWRbJ0BpZCddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgIGlmICghbm9kZU1hcFtyZXNvdXJjZVtpZEtleV1dKSB7XG4gICAgICAgICAgICAgICAgICBhZGROb2RlKHJlc291cmNlLGQueCxkLnkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vT25seSBhZGQgbmV3IGxpbmVzXG4gICAgICAgICAgICBqc29uLmZvckVhY2goZnVuY3Rpb24ocmVzb3VyY2UpIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcmVzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAvLyBPbmx5IGRpc3BsYXkgaXRlbXMgdGhhdCBhcmUgdXJpJ3MgYW5kIGV4aXN0cyBhcyBub2Rlc1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSE9PWlkS2V5ICYmIHByb3BlcnR5IT09ZWxtb1N0eWxlKSB7XG4gICAgICAgICAgICAgICAgICBmb3IgKG9iamVjdGluZGV4IGluIHJlc291cmNlW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZU1hcFtyZXNvdXJjZVtwcm9wZXJ0eV1bb2JqZWN0aW5kZXhdW2lkS2V5XV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBwcm9wZXJ0eS5yZXBsYWNlKHJlZ2V4TGFiZWxGcm9tVVJJLFwiJDJcIik7O1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVVyaSA9IHByb3BlcnR5Oy8vZ2V0RnVsbFVyaShwcm9wZXJ0eSxqc29uW1wiQGNvbnRleHRcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChhdmFpbGFibGVOb2Rlc1twcm9wZXJ0eVVyaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdmFpbGFibGVOb2Rlc1twcm9wZXJ0eVVyaV1bcmRmc0xhYmVsXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbCA9IGF2YWlsYWJsZU5vZGVzW3Byb3BlcnR5VXJpXVtyZGZzTGFiZWxdWzBdW1wiQHZhbHVlXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICBpZiAobGlua01hcFtyZXNvdXJjZVtpZEtleV0rcmVzb3VyY2VbcHJvcGVydHldW29iamVjdGluZGV4XVtpZEtleV1dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL0V4aXN0aW5nIGxpbmssIGNoZWNrIGlmIHVyaSBpcyBkaWZmZXJlbnQgYW5kIGxhYmVsIGlzIGRpZmZlcmVudCwgYWRkIGxhYmVsIHRvIGV4aXN0aW5nIGxpbmtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbCA9IGxpbmtNYXBbcmVzb3VyY2VbaWRLZXldK3Jlc291cmNlW3Byb3BlcnR5XVtvYmplY3RpbmRleF1baWRLZXldXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZWwudXJpIT1wcm9wZXJ0eSkgJiYgKGVsLmxhYmVsIT1sYWJlbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZWwubGFiZWwrPSBcIiwgXCIgKyBsYWJlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSBhZGRMaW5rKHJlc291cmNlW2lkS2V5XSxyZXNvdXJjZVtwcm9wZXJ0eV1bb2JqZWN0aW5kZXhdW2lkS2V5XSxwcm9wZXJ0eSxsYWJlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL0NyZWF0ZSBuZXR3b3JrOiBzZXQgaW4gJiBvdXQtbGlua3NcbiAgICAgICAgICAgICAgICAgICAgICAgIGwuc291cmNlLm91dExpbmtzW2wudXJpXSA9IGwuc291cmNlLm91dExpbmtzW2wudXJpXSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGwuc291cmNlLm91dExpbmtzW2wudXJpXS5wdXNoKGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbC5zb3VyY2UubGlua0NvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICBsLnNvdXJjZS5wYXJlbnRMaW5rID0gbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGwudGFyZ2V0LmluTGlua3NbbC51cmldID0gbC50YXJnZXQuaW5MaW5rc1tsLnVyaV0gfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICBsLnRhcmdldC5pbkxpbmtzW2wudXJpXS5wdXNoKGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbC50YXJnZXQubGlua0NvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICBsLnRhcmdldC5wYXJlbnRMaW5rID0gbDtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZC5leHBhbmRlZCA9IHRydWU7XG4gICAgICAgICAgICB1cGRhdGVUaXRsZShkKTtcbiAgICAgICAgICAgIGNyZWF0ZUFnZ3JlZ2F0ZU5vZGVzKCk7XG4gICAgICAgICAgICB1cGRhdGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXHRcdFx0fSlcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Ly9UT0RPOiBVbmNvbGxhcHNlIGFnZ3JlZ2F0ZVxuXHRcdGQuZXhwYW5kZWQgPSB0cnVlO1xuXHRcdC8vQSBiaXQgZGlydHk6IG1ha2Ugc3VyZSB0aGF0IHRoZSBuZXcgbm9kZXMgYXJlIHZpc2libGVcblx0XHRkLmxpbmtzLmZvckVhY2goZnVuY3Rpb24oeCkge1xuXHRcdFx0eC50YXJnZXQubGlua0NvdW50Kys7XG5cdFx0XHR4LnNvdXJjZS5saW5rQ291bnQrKztcblx0XHR9KTtcblx0XHR1cGRhdGUoKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoaWRlTm9kZSgpIHtcbiAgaWYgKGN1cnJlbnROb2RlKSB7XG4gICAgLy9Pbmx5IGhpZGUgaWYgdGhlIG5vZGUgaXMgYSBsZWFmLW5vZGVcbiAgICBjdXJyZW50Tm9kZS5oaWRlID0gdHJ1ZTtcbiAgICBtb3VzZW91dFByb3BlcnR5Qm94KCk7XG4gICAgdXBkYXRlKClcbiAgfVxufVxuXG5leHBvcnQge2luaXRHcmFwaCwgdG9nZ2xlZnVsbHNjcmVlbiwgbW91c2VvdmVyUHJvcGVydHlCb3gsIG1vdXNlb3V0UHJvcGVydHlCb3gsIGNsaWNrSW5mb0JveCwgY2xpY2tQcm9wZXJ0eUJveCwgZXhwYW5kLCBoaWRlTm9kZX07XG4iLCIvL2ltcG9ydCBEaWFncmFtIGZyb20gJy4vZGlhZ3JhbS5qcydcbi8vaW1wb3J0IGRpYWdyYW0gZnJvbSAnLi9kaWFncmFtLmpzJ1xuaW1wb3J0IHtpbml0R3JhcGgsIHRvZ2dsZWZ1bGxzY3JlZW4sIG1vdXNlb3ZlclByb3BlcnR5Qm94LCBtb3VzZW91dFByb3BlcnR5Qm94LCBjbGlja0luZm9Cb3gsIGNsaWNrUHJvcGVydHlCb3gsIGV4cGFuZCwgaGlkZU5vZGV9IGZyb20gJy4vZGlhZ3JhbWdsb2JhbC5qcydcblxudmFyIGpzb25BcGlTdWJqZWN0ID0gXCJodHRwOi8vZXhhbXBsZS5vcmcvaWQvSmFuZURvZVwiOyAvL1VSSSBvZiB0aGUgc3ViamVjdCB0aGF0IGlzIHRoZSBjZW50ZXIgb2YgdGhlIGdyYXBoXG52YXIganNvbkFwaUlEU3ViamVjdCA9IFwiXCI7IC8vTm90IHVzZWRcbnZhciBqc29uQXBpQ2FsbCA9IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3Rlc3QuanNvbj9zdWJqZWN0PVwiOyAvL0dyYXBoIHRoYXQgY29udGFpbnMgdGhlIGRhdGEgKG9yIGEgSlNPTi1MRCBzZXJ2aWNlIHRoYXQgY2FuIGJlIHF1ZXJpZWQpXG52YXIgdXJpRW5kcG9pbnQgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MD9zdWJqZWN0PVwiOyAvL0VuZHBvaW50IHRoYXQgY2FuIGJlIHVzZWQgdG8gbmF2aWdhdGUgdG8gKGVtcHR5IG1lYW5zIHRoYXQgdGhlIG9yaWdpbmFsIFVSSSBpcyB1c2VkIGFzIGVuZHBvaW50KVxudmFyIGZyYWdtZW50cyA9IHt9O1xuXG4vL3ZhciBEID0gbmV3IERpYWdyYW0oKTtcbi8vRC5zdGFydCgpO1xuLy9kaWFncmFtLmluaXQoanNvbkFwaVN1YmplY3QsIGpzb25BcGlJRFN1YmplY3QsIGpzb25BcGlDYWxsLCB1cmlFbmRwb2ludCwgZnJhZ21lbnRzKTtcblxuaW5pdEdyYXBoKGpzb25BcGlTdWJqZWN0LCBqc29uQXBpSURTdWJqZWN0LCBqc29uQXBpQ2FsbCwgdXJpRW5kcG9pbnQsIGZyYWdtZW50cyk7XG5cbmV4cG9ydCB7dG9nZ2xlZnVsbHNjcmVlbiwgbW91c2VvdmVyUHJvcGVydHlCb3gsIG1vdXNlb3V0UHJvcGVydHlCb3gsIGNsaWNrSW5mb0JveCwgY2xpY2tQcm9wZXJ0eUJveCwgZXhwYW5kLCBoaWRlTm9kZX07XG4iXSwic291cmNlUm9vdCI6IiJ9