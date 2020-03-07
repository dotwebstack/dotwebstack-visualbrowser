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
	html+='<span class="glyphicon glyphicon-fullscreen" style="position:absolute;right:10px;margin-top:10px;cursor:pointer" onclick="togglefullscreen()"/>';
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
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _diagramglobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./diagramglobal.js */ "./src/diagramglobal.js");
//import Diagram from './diagram.js'
//import diagram from './diagram.js'


var jsonApiSubject = "http://mak.zorgeloosvastgoed.nl/id/begrip/Koop";
var jsonApiIDSubject = "";
var jsonApiCall = "http://taxonomie.zorgeloosvastgoed.nl/resource?representation=http%3A%2F%2Fdotwebstack.org%2Fconfiguration%2FGraph&date=&subject=";
var uriEndpoint = "http://taxonomie.zorgeloosvastgoed.nl/resource?subject=";
var fragments = {};

//var D = new Diagram();
//D.start();
//diagram.init(jsonApiSubject, jsonApiIDSubject, jsonApiCall, uriEndpoint, fragments);

Object(_diagramglobal_js__WEBPACK_IMPORTED_MODULE_0__["initGraph"])(jsonApiSubject, jsonApiIDSubject, jsonApiCall, uriEndpoint, fragments);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpYWdyYW1nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLGFBQWE7QUFDYixVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxrQ0FBa0MsOEJBQThCLEVBQUU7O0FBRWxFOztBQUVBO0FBQ0EsK0NBQStDLG1DQUFtQztBQUNsRjtBQUNBLDZDQUE2QyxxQ0FBcUM7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FB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O0FBQ0E7QUFDQTs7QUFFQSxtRUFBUyIsImZpbGUiOiJkd3N2aXotbGliLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCJ2YXIganNvbkFwaVN1YmplY3QsIGpzb25BcGlJRFN1YmplY3QsIGpzb25BcGlDYWxsLCB1cmlFbmRwb2ludCwgZnJhZ21lbnRzO1xuXG52YXIgd2lkdGggPSAkKFwiI2dyYXBoXCIpLndpZHRoKCksXG4gICAgaGVpZ2h0ID0gNTAwLC8vJChcIiNncmFwaFwiKS5oZWlnaHQoKSxcblx0YXNwZWN0ID0gaGVpZ2h0L3dpZHRoO1xuXG4vL01heGltdW0gbnVtYmVyIG9mIG5vZGVzIGFsbG93ZWQgYmVmb3JlIGxpbmtzIGFuZCBub2RlcyBhcmUgYWdncmVnYXRlZFxudmFyIG1heE5vZGVzID0gNDtcblxuLy9SZWdleCBleHByZXNzaW9uIGZvciBjcmVhdGlvbiBsYWJlbCBmcm9tIFVSSVxudmFyIHJlZ2V4TGFiZWxGcm9tVVJJID0gbmV3IFJlZ0V4cChcIiguKylbI3wvXShbXi9dKykkXCIsXCJnXCIpO1xuXG4vL1NvbWUga2V5IGNvbnN0YW50c1xudmFyIGlkS2V5ID0gXCJAaWRcIjtcbnZhciBlbG1vU3R5bGUgPSBcImh0dHA6Ly9icDRtYzIub3JnL2VsbW8vZGVmI3N0eWxlXCI7XG52YXIgZWxtb05hbWUgPSBcImh0dHA6Ly9icDRtYzIub3JnL2VsbW8vZGVmI25hbWVcIjtcbnZhciByZGZzTGFiZWwgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSNsYWJlbFwiO1xudmFyIGh0bWxJbWFnZSA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbC92b2NhYiNpbWdcIlxuXG4vL0Z1bGwgc2NyZWVuIHRvZ2dsZVxudmFyIGZ1bGxTY3JlZW5GbGFnID0gZmFsc2U7XG5cbi8vIHpvb20gZmVhdHVyZXNcbnZhciB6b29tID0gZDMuYmVoYXZpb3Iuem9vbSgpXG5cdC5zY2FsZUV4dGVudChbMC4xLDEwXSlcblx0Lm9uKFwiem9vbVwiLHpvb21lZCk7XG5cbi8vIHN2ZyBncmFwaCBvbiB0aGUgYm9keVxudmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNncmFwaFwiKS5hcHBlbmQoXCJzdmdcIilcbiAgICAuYXR0cihcIndpZHRoXCIsIFwiMTAwJVwiKVxuICAgIC5hdHRyKFwiaGVpZ2h0XCIsIFwiNTAwXCIpXG5cdC5hdHRyKFwib3ZlcmZsb3dcIiwgXCJoaWRkZW5cIilcblx0LmFwcGVuZChcImdcIilcblx0XHQuY2FsbCh6b29tKVxuXHRcdC5vbihcImRibGNsaWNrLnpvb21cIixudWxsKTtcblxuLy8gZGV0YWlsYm94IGRpdlxudmFyIGRldGFpbEJveCA9IGQzLnNlbGVjdChcIiNncmFwaHRpdGxlXCIpO1xuXG4vLyBwcm9wZXJ0eWJveCBkaXZcbnZhciBwdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzdmcnKVswXS5jcmVhdGVTVkdQb2ludCgpO1xudmFyIHByb3BlcnR5Qm94ID0gZDMuc2VsZWN0KFwiI3Byb3BlcnR5Ym94XCIpO1xudmFyIGluZm9Cb3ggPSBwcm9wZXJ0eUJveC5hcHBlbmQoXCJkaXZcIik7XG5pbmZvQm94LmF0dHIoXCJjbGFzc1wiLFwiaW5mb2JveFwiKTtcbnZhciBwcm9wZXJ0eU5vZGUgPSBudWxsO1xudmFyIGluZm9Ob2RlID0gbnVsbDtcbnZhciBwcm9wZXJ0eUJveFZpc2libGUgPSBmYWxzZTtcblxuLy9SZWN0YW5nbGUgYXJlYSBmb3IgcGFubmluZ1xudmFyIHJlY3QgPSBzdmcuYXBwZW5kKFwicmVjdFwiKVxuICAgIC5hdHRyKFwid2lkdGhcIiwgXCIxMDAlXCIpXG4gICAgLmF0dHIoXCJoZWlnaHRcIiwgXCIxMDAlXCIpXG5cdC5hdHRyKFwiY2xhc3NcIixcImNhbnZhc1wiKTtcblxuLy9Db250YWluZXIgdGhhdCBob2xkcyBhbGwgdGhlIGdyYXBoaWNhbCBlbGVtZW50c1xudmFyIGNvbnRhaW5lciA9IHN2Zy5hcHBlbmQoXCJnXCIpO1xuXG4vL0ZsYWcgZm9yIElFMTAgYW5kIElFMTEgYnVnOiBTVkcgZWRnZXMgYXJlIG5vdCBzaG93aW5nIHdoZW4gcmVkcmF3blxudmFyIGJ1Z0lFID0gKChuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwicnY6MTFcIikhPS0xKSB8fCAobmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZihcIk1TSUUgMTBcIikhPS0xKSk7XG5cbi8vQXJyb3doZWFkIGRlZmluaXRpb25cbi8vKEFsbCBvdGhlciBlbmRwb2ludHMgc2hvdWxkIGJlIGRlZmluZWQgaW4gdGhpcyBzZWN0aW9uKVxuY29udGFpbmVyLmFwcGVuZCgnZGVmcycpLnNlbGVjdEFsbCgnbWFya2VyJylcbiAgICAgICAgLmRhdGEoWydlbmQnXSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgnbWFya2VyJylcbiAgICAgICAgLmF0dHIoJ2lkJyAgICAgICAgICAsICdBcnJvd0hlYWQnKVxuICAgICAgICAuYXR0cigndmlld0JveCcgICAgICwgJzAgLTUgMTAgMTAnKVxuICAgICAgICAuYXR0cigncmVmWCcgICAgICAgICwgMTApXG4gICAgICAgIC5hdHRyKCdyZWZZJyAgICAgICAgLCAwKVxuICAgICAgICAuYXR0cignbWFya2VyV2lkdGgnICwgNilcbiAgICAgICAgLmF0dHIoJ21hcmtlckhlaWdodCcsIDYpXG4gICAgICAgIC5hdHRyKCdvcmllbnQnICAgICAgLCAnYXV0bycpXG4gICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgLmF0dHIoJ2QnLCAnTTAsLTVMMTAsMEwwLDUnKTtcblxuLy9Gb3JjZSBkZWZpbml0aW9uXG52YXIgZm9yY2UgPSBkMy5sYXlvdXQuZm9yY2UoKVxuICAgIC5ncmF2aXR5KDApXG4gICAgLmRpc3RhbmNlKDE1MClcbiAgICAuY2hhcmdlKC0yMDApXG4gICAgLnNpemUoW3dpZHRoLCBoZWlnaHRdKVxuXHQub24oXCJ0aWNrXCIsdGljayk7XG5cbi8vSW5pdGlhbGlzaW5nIHNlbGVjdGlvbiBvZiBncmFwaGljYWwgZWxlbWVudHNcbi8vYWxsTGlua3MgPSBhbGwgdGhlIGN1cnJlbnQgdmlzaWJsZSBsaW5rc1xuLy9hbGxOb2RlcyA9IGFsbCB0aGUgY3VycmVudCB2aXNpYmxlIG5vZGVzXG4vL0FsbE5vZGVzIGFuZCBBbGxMaW5rcyBhcmUgdXNlZCB3aXRoaW4gdGhlIHRpY2sgZnVuY3Rpb25cbi8vcm9vdCBob2xkcyBhbGwgZGF0YSwgZXZlbiBkYXRhIHRoYXQgaGFzIGJlZW4gbWFkZSBpbnZpc2libGVcbnZhciBhbGxMaW5rcyA9IGNvbnRhaW5lci5zZWxlY3RBbGwoXCIubGlua1wiKSxcblx0YWxsTm9kZXMgPSBjb250YWluZXIuc2VsZWN0QWxsKFwiLm5vZGVcIiksXG5cdG5vZGVNYXAgPSB7fSxcblx0bGlua01hcCA9IHt9LFxuXHRyb290ID0ge30sXG5cdGN1cnJlbnROb2RlID0gbnVsbCxcbiAgZWxtb1N0eWxlcyA9IFtdO1xuXG4vL0ZldGNoIGRhdGEgdmlhIEFqYXgtY2FsbCBhbmQgcHJvY2VzcyAoYXNrIGZvciBqc29uLWxkKVxuZnVuY3Rpb24gaW5pdEdyYXBoKF9qc29uQXBpU3ViamVjdCwgX2pzb25BcGlJRFN1YmplY3QsIF9qc29uQXBpQ2FsbCwgX3VyaUVuZHBvaW50LCBfZnJhZ21lbnRzKSB7XG5cbiAganNvbkFwaVN1YmplY3QgPSBfanNvbkFwaVN1YmplY3Q7XG4gIGpzb25BcGlJRFN1YmplY3QgPSBfanNvbkFwaUlEU3ViamVjdDtcbiAganNvbkFwaUNhbGwgPSBfanNvbkFwaUNhbGw7XG4gIHVyaUVuZHBvaW50ID0gX3VyaUVuZHBvaW50O1xuICBmcmFnbWVudHMgPSBfZnJhZ21lbnRzO1xuXG4gIGQzLnhocihqc29uQXBpQ2FsbCtlbmNvZGVVUklDb21wb25lbnQoanNvbkFwaVN1YmplY3QpLFwiYXBwbGljYXRpb24vbGQranNvblwiLCBmdW5jdGlvbihlcnJvciwgeGhyKSB7XG5cbiAgICAvL1BhcnNlIHhociBhcyBpZiBpdCB3YXMganNvbiwgYW5kIGV4cGFuZCAobG9zZSBjb250ZXh0KVxuICAgIGpzb25sZC5leHBhbmQoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSxmdW5jdGlvbiAoZXJyLCBqc29uKSB7XG4gICAgICBpZiAoIWVycikge1xuXG4gICAgICAgIC8vU3RpamxlbiBvcGhhbGVuXG4gICAgICAgIGpzb24uZm9yRWFjaChmdW5jdGlvbihyZXNvdXJjZSkge1xuICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgIGlmIChlbG1vTmFtZSBpbiByZXNvdXJjZSkge1xuICAgICAgICAgICAgZWxtb1N0eWxlc1tyZXNvdXJjZVtcIkBpZFwiXV09cmVzb3VyY2VbZWxtb05hbWVdWzBdW1wiQHZhbHVlXCJdXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYXZhaWxhYmxlTm9kZXMgPSB7fTtcbiAgICAgICAganNvbi5mb3JFYWNoKGZ1bmN0aW9uKHgpIHsgYXZhaWxhYmxlTm9kZXNbeFtpZEtleV1dID0geDsgfSk7XG5cbiAgICAgICAgcm9vdC5ub2RlcyA9IFtdO1xuXG4gICAgICAgIC8vRmluZCBzdWJqZWN0IGFuZCBpbnNlcnQgKHN0YXJ0aW5ncG9pbnQgPSBtaWRkbGUgb2Ygc2NyZWVuKVxuICAgICAgICB2YXIgc3ViamVjdCA9IGpzb24uZmlsdGVyKGZ1bmN0aW9uKHIpIHtyZXR1cm4gKHJbaWRLZXldPT09anNvbkFwaVN1YmplY3QpfSlbMF07XG4gICAgICAgIGlmICghc3ViamVjdCkge1xuICAgICAgICAgIHN1YmplY3QgPSBqc29uLmZpbHRlcihmdW5jdGlvbihyKSB7cmV0dXJuIChyW2lkS2V5XT09PWpzb25BcGlJRFN1YmplY3QpfSlbMF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzdWJqZWN0KSB7XG4gICAgICAgICAgc3ViamVjdCA9IGpzb25bMF07XG4gICAgICAgIH1cbiAgICAgICAgYWRkTm9kZShzdWJqZWN0LHdpZHRoLzIsaGVpZ2h0LzIpO1xuXG4gICAgICAgIC8vQWRkIG5vZGVzIHRoYXQgYXJlIGxpbmtlZCBmcm9tIHRoZSBzdWJqZWN0IGFuZCBhdmFpbGFibGVcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gc3ViamVjdCkge1xuICAgICAgICAgIGlmIChwcm9wZXJ0eSE9PWlkS2V5ICYmIHByb3BlcnR5IT09ZWxtb1N0eWxlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBvYmplY3RpbmRleCBpbiBzdWJqZWN0W3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICBpZiAoYXZhaWxhYmxlTm9kZXNbc3ViamVjdFtwcm9wZXJ0eV1bb2JqZWN0aW5kZXhdW2lkS2V5XV0pIHtcbiAgICAgICAgICAgICAgICBpZiAoIW5vZGVNYXBbc3ViamVjdFtwcm9wZXJ0eV1bb2JqZWN0aW5kZXhdW2lkS2V5XV0pIHtcbiAgICAgICAgICAgICAgICAgIGFkZE5vZGUoYXZhaWxhYmxlTm9kZXNbc3ViamVjdFtwcm9wZXJ0eV1bb2JqZWN0aW5kZXhdW2lkS2V5XV0sd2lkdGgvMixoZWlnaHQvMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vQWRkIG5vZGVzIHRoYXQgaGF2ZSB0aGUgc3ViamVjdCBhcyB0YXJnZXQgKGR1cGxpY2F0ZXMgd2lsbCBiZSBmaWx0ZXJlZCBvdXQgYnkgYWRkTm9kZSBmdW5jdGlvbilcbiAgICAgICAganNvbi5mb3JFYWNoKGZ1bmN0aW9uKHJlc291cmNlKSB7XG4gICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcmVzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSE9aWRLZXkgJiYgcHJvcGVydHkhPWVsbW9TdHlsZSkge1xuICAgICAgICAgICAgICBmb3IgKHZhciBvYmplY3RpbmRleCBpbiByZXNvdXJjZVtwcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2VbcHJvcGVydHldW29iamVjdGluZGV4XVtpZEtleV09PT1qc29uQXBpU3ViamVjdCkge1xuICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgIGFkZE5vZGUocmVzb3VyY2Usd2lkdGgvMixoZWlnaHQvMik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvL1VwZGF0ZSBhbmQgZ2V0IGxpbmtzXG4gICAgICAgIHJvb3QubGlua3MgPSBbXTtcbiAgICAgICAganNvbi5mb3JFYWNoKGZ1bmN0aW9uKHJlc291cmNlKSB7XG4gICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcmVzb3VyY2UpIHtcbiAgICAgICAgICAgIC8vIE9ubHkgZGlzcGxheSBpdGVtcyB0aGF0IGFyZSB1cmkncyBhbmQgZXhpc3RzIGFzIG5vZGVzXG4gICAgICAgICAgICBpZiAocHJvcGVydHkhPT1pZEtleSAmJiBwcm9wZXJ0eSE9PWVsbW9TdHlsZSkge1xuICAgICAgICAgICAgICBmb3IgKG9iamVjdGluZGV4IGluIHJlc291cmNlW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlTWFwW3Jlc291cmNlW3Byb3BlcnR5XVtvYmplY3RpbmRleF1baWRLZXldXSkge1xuICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gcHJvcGVydHkucmVwbGFjZShyZWdleExhYmVsRnJvbVVSSSxcIiQyXCIpO1xuICAgICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5VXJpID0gcHJvcGVydHk7Ly9nZXRGdWxsVXJpKHByb3BlcnR5LGpzb25bXCJAY29udGV4dFwiXSk7XG4gICAgICAgICAgICAgICAgICBpZiAoYXZhaWxhYmxlTm9kZXNbcHJvcGVydHlVcmldKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdmFpbGFibGVOb2Rlc1twcm9wZXJ0eVVyaV1bcmRmc0xhYmVsXSkge1xuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsID0gYXZhaWxhYmxlTm9kZXNbcHJvcGVydHlVcmldW3JkZnNMYWJlbF1bMF1bXCJAdmFsdWVcIl07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGFkZExpbmsocmVzb3VyY2VbaWRLZXldLHJlc291cmNlW3Byb3BlcnR5XVtvYmplY3RpbmRleF1baWRLZXldLHByb3BlcnR5LGxhYmVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICAvL1NldCBmaXJzdCBub2RlIHRvIGZpeGVkXG4gICAgICAgIHJvb3Qubm9kZXNbMF0uZml4ZWQgPSB0cnVlO1xuICAgICAgICByb290Lm5vZGVzWzBdLmV4cGFuZGVkID0gdHJ1ZTtcbiAgICAgICAgdXBkYXRlVGl0bGUocm9vdC5ub2Rlc1swXSk7XG5cbiAgICAgICAgLy9DcmVhdGUgbmV0d29ya1xuICAgICAgICByb290LmxpbmtzLmZvckVhY2goZnVuY3Rpb24obCkge1xuICAgICAgICAgIGwuc291cmNlLm91dExpbmtzW2wudXJpXSA9IGwuc291cmNlLm91dExpbmtzW2wudXJpXSB8fCBbXTtcbiAgICAgICAgICBsLnNvdXJjZS5vdXRMaW5rc1tsLnVyaV0ucHVzaChsKTtcbiAgICAgICAgICBsLnNvdXJjZS5saW5rQ291bnQrKztcbiAgICAgICAgICBsLnNvdXJjZS5wYXJlbnRMaW5rID0gbDtcbiAgICAgICAgICBsLnRhcmdldC5pbkxpbmtzW2wudXJpXSA9IGwudGFyZ2V0LmluTGlua3NbbC51cmldIHx8IFtdO1xuICAgICAgICAgIGwudGFyZ2V0LmluTGlua3NbbC51cmldLnB1c2gobCk7XG4gICAgICAgICAgbC50YXJnZXQubGlua0NvdW50Kys7XG4gICAgICAgICAgbC50YXJnZXQucGFyZW50TGluayA9IGw7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNyZWF0ZUFnZ3JlZ2F0ZU5vZGVzKCk7XG4gICAgICAgIHVwZGF0ZSgpO1xuXG4gICAgICB9O1xuICAgIH0pO1xuXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGROb2RlKHJlc291cmNlLHgseSkge1xuXG4gIC8vT25seSBhZGQgYSBub2RlIGlmIGl0IGRvZXNuJ3QgZXhpc3RzIGFscmVhZHlcbiAgaWYgKCFub2RlTWFwW3Jlc291cmNlW2lkS2V5XV0pIHtcblxuICAgIHZhciBub2RlQ2xhc3MgPSBcIlwiO1xuICAgIGlmIChyZXNvdXJjZVtlbG1vU3R5bGVdKSB7XG4gICAgICBpZiAoZWxtb1N0eWxlc1tyZXNvdXJjZVtlbG1vU3R5bGVdWzBdW2lkS2V5XV0pIHtcbiAgICAgICAgbm9kZUNsYXNzID0gZWxtb1N0eWxlc1tyZXNvdXJjZVtlbG1vU3R5bGVdWzBdW2lkS2V5XV07XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBub2RlTGFiZWwgPSByZXNvdXJjZVtpZEtleV07XG4gICAgaWYgKHJlc291cmNlW3JkZnNMYWJlbF0pIHtcbiAgICAgIG5vZGVMYWJlbCA9IHJlc291cmNlW3JkZnNMYWJlbF1bMF1bXCJAdmFsdWVcIl07XG4gICAgfVxuICAgIHZhciBub2RlRGF0YSA9IHt9O1xuICAgIGZvciAodmFyIHByb3BlcnR5IGluIHJlc291cmNlKSB7XG4gICAgICBpZiAocHJvcGVydHkhPT1pZEtleSAmJiBwcm9wZXJ0eSE9cmRmc0xhYmVsICYmIChyZXNvdXJjZVtwcm9wZXJ0eV1bMF1bXCJAdmFsdWVcIl0pKSB7XG4gICAgICAgIG5vZGVEYXRhW3Byb3BlcnR5XT1yZXNvdXJjZVtwcm9wZXJ0eV1bMF1bXCJAdmFsdWVcIl07XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBub2RlID0ge1wiQGlkXCI6cmVzb3VyY2VbaWRLZXldXG4gICAgICAgICxcImxhYmVsXCI6bm9kZUxhYmVsXG4gICAgICAgICxcImNsYXNzXCI6bm9kZUNsYXNzXG4gICAgICAgICxcImRhdGFcIjogbm9kZURhdGFcbiAgICAgICAgLFwiZWxlbWVudFR5cGVcIjogXCJyZWN0XCJcbiAgICAgICAgfTtcbiAgICBpZiAocmVzb3VyY2VbaHRtbEltYWdlXSkge1xuICAgICAgbm9kZS5pbWcgPSByZXNvdXJjZVtodG1sSW1hZ2VdWzBdW1wiQHZhbHVlXCJdO1xuICAgICAgbm9kZS5lbGVtZW50VHlwZSA9IFwiaW1hZ2VcIjtcbiAgICB9XG4gICAgcm9vdC5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgIG5vZGVNYXBbcmVzb3VyY2VbaWRLZXldXSA9IG5vZGU7XG5cbiAgICAvLyBzdGFydGluZ3BvaW50IG9mIG5ldyBub2RlXG4gICAgbm9kZS54ID0geDtcbiAgICBub2RlLnkgPSB5O1xuICAgIC8vQ3JlYXRlIG5ldHdvcms6IGluaXRpYWxpemUgbmV3IG5vZGVcbiAgICBub2RlLmluTGlua3MgPSB7fTtcbiAgICBub2RlLm91dExpbmtzID0ge307XG4gICAgbm9kZS5saW5rQ291bnQgPSAwO1xuICAgIG5vZGUucGFyZW50TGluaztcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGFkZExpbmsoc291cmNlVXJpLHRhcmdldFVyaSxwcm9wZXJ0eVVyaSxwcm9wZXJ0eUxhYmVsKSB7XG5cbiAgaWYgKGxpbmtNYXBbc291cmNlVXJpK3RhcmdldFVyaV0pIHtcbiAgICAvL0xpbmsgYWxyZWFkeSBleGlzdHMsIGFkZCBsYWJlbCB0byBleGlzdGluZyBsaW5rXG4gICAgbGlua01hcFtzb3VyY2VVcmkrdGFyZ2V0VXJpXS5sYWJlbCs9IFwiLCBcIitwcm9wZXJ0eUxhYmVsO1xuICAgIHJldHVybiBsaW5rTWFwW3NvdXJjZVVyaSt0YXJnZXRVcmldXG4gIH0gZWxzZSB7XG4gICAgLy9OZXcgbGlua1xuICAgIHZhciBsID0ge1wiaWRcIjpzb3VyY2VVcmkrdGFyZ2V0VXJpXG4gICAgICAgICAgICAsXCJzb3VyY2VcIjpub2RlTWFwW3NvdXJjZVVyaV1cbiAgICAgICAgICAgICxcInRhcmdldFwiOm5vZGVNYXBbdGFyZ2V0VXJpXVxuICAgICAgICAgICAgLFwidXJpXCI6cHJvcGVydHlVcmlcbiAgICAgICAgICAgICxcImxhYmVsXCI6cHJvcGVydHlMYWJlbFxuICAgICAgICAgICAgfTtcbiAgICBsaW5rTWFwW2wuaWRdPWw7XG4gICAgcm9vdC5saW5rcy5wdXNoKGwpO1xuICAgIHJldHVybiBsO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gbW92ZVByb3BlcnR5Qm94KCkge1xuXHRpZiAocHJvcGVydHlCb3hWaXNpYmxlICYmIHByb3BlcnR5Tm9kZSkge1xuXHRcdGlmIChwcm9wZXJ0eU5vZGUuYXJlY3QpIHtcblx0XHRcdHByb3BlcnR5Qm94LnN0eWxlKFwiZGlzcGxheVwiLFwiYmxvY2tcIik7XG5cdFx0XHQvL0dldCBhYnNvbHV0ZSBwb3NpdGlvblxuXHRcdFx0dmFyIG1hdHJpeCAgPSBwcm9wZXJ0eU5vZGUuYXJlY3QuZ2V0U2NyZWVuQ1RNKCk7XG5cdFx0XHRpZiAocHJvcGVydHlOb2RlLmFyZWN0Lm5vZGVOYW1lPT09J3JlY3QnKSB7XG5cdFx0XHRcdHB0LnggPSBwcm9wZXJ0eU5vZGUuYXJlY3QueC5hbmltVmFsLnZhbHVlK3Byb3BlcnR5Tm9kZS5hcmVjdC53aWR0aC5hbmltVmFsLnZhbHVlO1xuXHRcdFx0XHRwdC55ID0gcHJvcGVydHlOb2RlLmFyZWN0LnkuYW5pbVZhbC52YWx1ZTtcblx0XHRcdH1cblx0XHRcdGlmIChwcm9wZXJ0eU5vZGUuYXJlY3Qubm9kZU5hbWU9PT0nY2lyY2xlJykge1xuXHRcdFx0XHRwdC54ID0gcHJvcGVydHlOb2RlLmFyZWN0LmN4LmFuaW1WYWwudmFsdWUrcHJvcGVydHlOb2RlLmFyZWN0LnIuYW5pbVZhbC52YWx1ZTtcblx0XHRcdFx0cHQueSA9IHByb3BlcnR5Tm9kZS5hcmVjdC5jeS5hbmltVmFsLnZhbHVlLXByb3BlcnR5Tm9kZS5hcmVjdC5yLmFuaW1WYWwudmFsdWU7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZGl2cmVjdCA9IHB0Lm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHRcdFx0Ly9Db3JyZWN0IGZvciBvZmZzZXQgYW5kIHNjcm9sbFxuXHRcdFx0dmFyIHRoZVggPSBkaXZyZWN0LngtJCgnI2dyYXBoY2FudmFzJykub2Zmc2V0KCkubGVmdCskKHdpbmRvdykuc2Nyb2xsTGVmdCgpO1xuXHRcdFx0dmFyIHRoZVkgPSBkaXZyZWN0LnktJCgnI2dyYXBoY2FudmFzJykub2Zmc2V0KCkudG9wKyQod2luZG93KS5zY3JvbGxUb3AoKTtcblx0XHRcdC8vU2V0IHBvc2l0aW9uXG5cdFx0XHRwcm9wZXJ0eUJveC5zdHlsZShcImxlZnRcIix0aGVYK1wicHhcIik7XG5cdFx0XHRwcm9wZXJ0eUJveC5zdHlsZShcInRvcFwiLHRoZVkrXCJweFwiKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbW91c2VvdmVyTm9kZShkKSB7XG5cdGlmICghcHJvcGVydHlCb3hWaXNpYmxlKSB7XG5cdFx0cHJvcGVydHlOb2RlID0gZDtcblx0XHRwcm9wZXJ0eUJveFZpc2libGUgPSB0cnVlO1xuXHRcdG1vdmVQcm9wZXJ0eUJveCgpO1xuXHRcdGlmIChpbmZvTm9kZSE9cHJvcGVydHlOb2RlKSB7XG5cdFx0XHR2YXIgaHRtbD0nJztcblx0XHRcdGluZm9Cb3guaHRtbChodG1sKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbW91c2VvdXROb2RlKGQpIHtcblx0aWYgKHByb3BlcnR5Qm94VmlzaWJsZSkge1xuXHRcdHByb3BlcnR5Qm94VmlzaWJsZSA9IGZhbHNlO1xuXHRcdHByb3BlcnR5Qm94LnN0eWxlKFwiZGlzcGxheVwiLFwibm9uZVwiKTtcblx0XHRpZiAoaW5mb05vZGUhPXByb3BlcnR5Tm9kZSkge1xuXHRcdFx0dmFyIGh0bWw9Jyc7XG5cdFx0XHRpbmZvQm94Lmh0bWwoaHRtbCk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIG1vdXNlb3ZlclByb3BlcnR5Qm94KCkge1xuXHRpZiAoIXByb3BlcnR5Qm94VmlzaWJsZSkge1xuXHRcdHByb3BlcnR5Qm94LnN0eWxlKFwiZGlzcGxheVwiLFwiYmxvY2tcIik7XG5cdFx0cHJvcGVydHlCb3hWaXNpYmxlID0gdHJ1ZTtcblx0fVxufVxuXG5mdW5jdGlvbiBtb3VzZW91dFByb3BlcnR5Qm94KCkge1xuXHRwcm9wZXJ0eUJveC5zdHlsZShcImRpc3BsYXlcIixcIm5vbmVcIik7XG5cdHByb3BlcnR5Qm94VmlzaWJsZSA9IGZhbHNlO1xuXHRpZiAoaW5mb05vZGUhPXByb3BlcnR5Tm9kZSkge1xuXHRcdHZhciBodG1sPScnO1xuXHRcdGluZm9Cb3guaHRtbChodG1sKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVBZ2dyZWdhdGVOb2RlcygpIHtcblxuXHQvL0FkZCBhbiBhZ2dyZWdhdGVOb2RlIGZvciBhbnkgbm9kZSB0aGF0IGhhcyBtb3JlIHRoYW4gbWF4Tm9kZXMgb3V0Z29pbmcgT1IgaW5nb2luZyBsaW5rc1xuXHRyb290Lm5vZGVzLmZvckVhY2goZnVuY3Rpb24obikge1xuXHRcdGlmICghbi5hZ2dyZWdhdGVOb2RlKSB7XG5cdFx0XHRPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhuLm91dExpbmtzKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcblx0XHRcdFx0dmFyIGQgPSBuLm91dExpbmtzW3Byb3BdO1xuXHRcdFx0XHRpZiAoZC5sZW5ndGg+PW1heE5vZGVzKSB7XG5cdFx0XHRcdFx0aWYgKCFub2RlTWFwW25bXCJAaWRcIl0rZFswXS51cmldKSB7XG5cdFx0XHRcdFx0XHR2YXIgYU5vZGUgPSB7XCJAaWRcIjpuW1wiQGlkXCJdK2RbMF0udXJpLGRhdGE6e30sbGFiZWw6ZFswXS5sYWJlbCx1cmk6ZFswXS51cmksZWxlbWVudFR5cGU6XCJjaXJjbGVcIixhZ2dyZWdhdGVOb2RlOnRydWUsaW5ib3VuZDpmYWxzZSxjb3VudDpkLmxlbmd0aCxsaW5rczpkfTtcblx0XHRcdFx0XHRcdHJvb3Qubm9kZXMucHVzaChhTm9kZSk7XG5cdFx0XHRcdFx0XHRyb290LmxpbmtzLnB1c2goe2lkOm5bXCJAaWRcIl0rZFswXS51cmksc291cmNlOm4sdGFyZ2V0OmFOb2RlLGxhYmVsOmRbMF0ubGFiZWwsdXJpOmRbMF0udXJpfSk7XG5cdFx0XHRcdFx0XHRub2RlTWFwW2FOb2RlW1wiQGlkXCJdXT1hTm9kZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobi5pbkxpbmtzKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcblx0XHRcdFx0dmFyIGQgPSBuLmluTGlua3NbcHJvcF07XG5cdFx0XHRcdGlmIChkLmxlbmd0aD49bWF4Tm9kZXMpIHtcblx0XHRcdFx0XHRpZiAoIW5vZGVNYXBbbltcIkBpZFwiXStkWzBdLnVyaV0pIHtcblx0XHRcdFx0XHRcdHZhciBhTm9kZSA9IHtcIkBpZFwiOm5bXCJAaWRcIl0rZFswXS51cmksZGF0YTp7fSxsYWJlbDpkWzBdLmxhYmVsLHVyaTpkWzBdLnVyaSxlbGVtZW50VHlwZTpcImNpcmNsZVwiLGFnZ3JlZ2F0ZU5vZGU6dHJ1ZSxpbmJvdW5kOnRydWUsY291bnQ6ZC5sZW5ndGgsbGlua3M6ZH07XG5cdFx0XHRcdFx0XHRyb290Lm5vZGVzLnB1c2goYU5vZGUpO1xuXHRcdFx0XHRcdFx0cm9vdC5saW5rcy5wdXNoKHtpZDpuW1wiQGlkXCJdK2RbMF0udXJpLHNvdXJjZTphTm9kZSx0YXJnZXQ6bixsYWJlbDpkWzBdLmxhYmVsLHVyaTpkWzBdLnVyaX0pO1xuXHRcdFx0XHRcdFx0bm9kZU1hcFthTm9kZVtcIkBpZFwiXV09YU5vZGU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xuXHQvL0RvIGEgcmVjb3VudCBvZiBudW1iZXIgb2YgY29ubmVjdGlvbnNcblx0Ly8oY291bnQgaXMgbnVtYmVyIG9mIGNvbm5lY3Rpb25zIG1pbnVzIHRoZSBjb25uZWN0aW9ucyB0aGF0IHJlbWFpbiB2aXNpYmxlXG5cdHJvb3Qubm9kZXMuZm9yRWFjaChmdW5jdGlvbihuKSB7XG5cdFx0aWYgKG4uYWdncmVnYXRlTm9kZSkge1xuXHRcdFx0bi5jb3VudCA9IG4ubGlua3MuZmlsdGVyKGZ1bmN0aW9uKGQpIHtyZXR1cm4gKChkLnRhcmdldC5saW5rQ291bnQ8PTEpIHx8IChkLnNvdXJjZS5saW5rQ291bnQ8PTEpKX0pLmxlbmd0aDtcblx0XHR9XG5cdH0pO1xufVxuXG52YXIgbm9kZV9kcmFnID0gZDMuYmVoYXZpb3IuZHJhZygpXG5cdC5vbihcImRyYWdzdGFydFwiLCBkcmFnc3RhcnQpXG5cdC5vbihcImRyYWdcIiwgZHJhZ21vdmUpXG5cdC5vbihcImRyYWdlbmRcIiwgZHJhZ2VuZCk7XG5cbmZ1bmN0aW9uIHVwZGF0ZVRpdGxlKGQpIHtcblx0dmFyIGh0bWwgPSAnPGgzIGNsYXNzPVwicGFuZWwtdGl0bGVcIj48YSBzdHlsZT1cImZvbnQtc2l6ZToxNnB4XCIgaHJlZj1cIicrdXJpRW5kcG9pbnQrZW5jb2RlVVJJQ29tcG9uZW50KGRbJ0BpZCddKSsnXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLW5ldy13aW5kb3dcIi8+PC9hPiAnK2QubGFiZWw7XG5cdGlmICghZC5leHBhbmRlZCkge1xuXHRcdGh0bWwrPScgPGEgb25jbGljaz1cImV4cGFuZCgpO1wiIGNsYXNzPVwiYmFkZ2VcIiBzdHlsZT1cImZvbnQtc2l6ZToxMnB4XCI+Jztcblx0XHRpZiAoZC5kYXRhWydjb3VudCddKSB7XG5cdFx0XHRodG1sKz1kLmRhdGFbJ2NvdW50J11cblx0XHR9O1xuXHRcdGh0bWwrPSc8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tem9vbS1pblwiLz48L2E+Jztcblx0fVxuXHRodG1sKz0nPHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWZ1bGxzY3JlZW5cIiBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlO3JpZ2h0OjEwcHg7bWFyZ2luLXRvcDoxMHB4O2N1cnNvcjpwb2ludGVyXCIgb25jbGljaz1cInRvZ2dsZWZ1bGxzY3JlZW4oKVwiLz4nO1xuXHRodG1sKz0nPC9oMz4nO1xuXHRkZXRhaWxCb3guaHRtbChodG1sKTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlZnVsbHNjcmVlbigpIHtcblx0aWYgKGZ1bGxTY3JlZW5GbGFnKSB7XG5cdFx0JCgnI2dyYXBoY2FudmFzJykuY3NzKHtwb3NpdGlvbjoncmVsYXRpdmUnLGxlZnQ6JycsdG9wOicnLHdpZHRoOicnLGhlaWdodDonJyx6SW5kZXg6Jyd9KTtcblx0XHQvL2QzLnNlbGVjdCgnI2dyYXBoY2FudmFzJykuc2V0QXR0cmlidXRlKFwic3R5bGVcIixcInJlbGF0aXZlXCIpO1xuXHR9IGVsc2Uge1xuXHRcdCQoJyNncmFwaGNhbnZhcycpLmNzcyh7cG9zaXRpb246J2Fic29sdXRlJyxsZWZ0OjAsdG9wOjAsd2lkdGg6ICQod2luZG93KS53aWR0aCgpLCBoZWlnaHQ6ICQod2luZG93KS5oZWlnaHQoKSwgekluZGV4OiAxMDAwfSk7XG5cdFx0Ly9kMy5zZWxlY3QoJyNncmFwaGNhbnZhcycpLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsXCJwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7dG9wOjA7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJVwiKTtcblx0XHRkMy5zZWxlY3QoXCIjZ3JhcGhcIikuc2VsZWN0KFwic3ZnXCIpLmF0dHIoXCJoZWlnaHRcIiwkKHdpbmRvdykuaGVpZ2h0KCktMTAwKTtcblx0fVxuXHRmdWxsU2NyZWVuRmxhZyA9ICFmdWxsU2NyZWVuRmxhZztcbn1cblxuZnVuY3Rpb24gZHJhZ3N0YXJ0KGQpIHtcblx0ZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdGZvcmNlLnN0b3AoKTtcblx0Y3VycmVudE5vZGUgPSBkO1xuXHR1cGRhdGVUaXRsZShkKTtcbn1cbmZ1bmN0aW9uIGRyYWdtb3ZlKGQpIHtcblx0ZC5weCArPSBkMy5ldmVudC5keDtcblx0ZC5weSArPSBkMy5ldmVudC5keTtcblx0ZC54ICs9IGQzLmV2ZW50LmR4O1xuXHRkLnkgKz0gZDMuZXZlbnQuZHk7XG5cdHRpY2soKTtcbn1cbmZ1bmN0aW9uIGRyYWdlbmQoZCkge1xuXHRkLmZpeGVkID0gdHJ1ZTtcblx0dGljaygpO1xuXHRmb3JjZS5yZXN1bWUoKTtcbn1cblxuZnVuY3Rpb24gem9vbWVkKCkge1xuXHRjb250YWluZXIuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIGQzLmV2ZW50LnRyYW5zbGF0ZSArIFwiKXNjYWxlKFwiICsgZDMuZXZlbnQuc2NhbGUgKyBcIilcIik7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZSgpIHtcblxuXHQvL0tlZXAgb25seSB0aGUgdmlzaWJsZSBub2Rlc1xuXHR2YXIgbm9kZXMgPSByb290Lm5vZGVzLmZpbHRlcihmdW5jdGlvbihkKSB7XG5cdFx0cmV0dXJuIGQuYWdncmVnYXRlTm9kZSA/ICghZC5leHBhbmRlZCkgJiYgKGQuY291bnQ+MCkgOiAoKGQubGlua0NvdW50PjEpIHx8ICgoZC5wYXJlbnRMaW5rLnNvdXJjZS5vdXRMaW5rc1tkLnBhcmVudExpbmsudXJpXS5sZW5ndGggPCBtYXhOb2RlcykgJiYgKGQucGFyZW50TGluay50YXJnZXQuaW5MaW5rc1tkLnBhcmVudExpbmsudXJpXS5sZW5ndGggPCBtYXhOb2RlcykpKVxuXHR9KTtcblx0dmFyIGxpbmtzID0gcm9vdC5saW5rcztcblx0Ly9LZWVwIG9ubHkgdGhlIHZpc2libGUgbGlua3Ncblx0bGlua3MgPSByb290LmxpbmtzLmZpbHRlcihmdW5jdGlvbihkKSB7XG5cdFx0cmV0dXJuIGQuc291cmNlLmFnZ3JlZ2F0ZU5vZGUgPyAoIWQuc291cmNlLmV4cGFuZGVkKSAmJiAoZC5zb3VyY2UuY291bnQ+MCkgOiBkLnRhcmdldC5hZ2dyZWdhdGVOb2RlID8gKCFkLnRhcmdldC5leHBhbmRlZCkgJiYgKGQudGFyZ2V0LmNvdW50PjApIDogKCgoZC5zb3VyY2UubGlua0NvdW50PjEpICYmIChkLnRhcmdldC5saW5rQ291bnQ+MSkpIHx8ICgoZC5zb3VyY2Uub3V0TGlua3NbZC51cmldLmxlbmd0aCA8IG1heE5vZGVzKSAmJiAoZC50YXJnZXQuaW5MaW5rc1tkLnVyaV0ubGVuZ3RoIDwgbWF4Tm9kZXMpKSlcblx0fSk7XG5cblx0Ly8gVXBkYXRlIHRoZSBsaW5rc1xuXHRhbGxMaW5rcyA9IGFsbExpbmtzLmRhdGEobGlua3MsZnVuY3Rpb24oZCkge3JldHVybiBkLmlkfSk7XG5cblx0Ly8gRXhpdCBhbnkgb2xkIGxpbmtzLlxuXHRhbGxMaW5rcy5leGl0KCkucmVtb3ZlKCk7XG5cblx0Ly8gRW50ZXIgYW55IG5ldyBsaW5rcy5cblx0dmFyIG5ld0xpbmtzID0gYWxsTGlua3Ncblx0XHQuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkKSB7IHJldHVybiBcImxpbmtcIisoZC5zb3VyY2VbXCJjbGFzc1wiXSA/IFwiIHRcIitkLnNvdXJjZVtcImNsYXNzXCJdIDogXCJcIikrKGQudGFyZ2V0W1wiY2xhc3NcIl0gPyBcIiB0XCIrZC50YXJnZXRbXCJjbGFzc1wiXSA6IFwiXCIpIH0pO1xuXG5cdG5ld0xpbmtzLmFwcGVuZChcImxpbmVcIilcblx0XHQuYXR0cihcImNsYXNzXCIsXCJib3JkZXJcIilcblx0bmV3TGlua3MuYXBwZW5kKFwibGluZVwiKVxuXHRcdC5zdHlsZShcIm1hcmtlci1lbmRcIiwgXCJ1cmwoI0Fycm93SGVhZClcIilcblx0XHQuYXR0cihcImNsYXNzXCIsXCJzdHJva2VcIik7XG5cdG5ld0xpbmtzLmFwcGVuZChcInRleHRcIilcblx0XHQuYXR0cihcImR4XCIsIDApXG5cdFx0LmF0dHIoXCJkeVwiLCAwKVxuXHRcdC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcblx0XHQuYXR0cihcImNsYXNzXCIsXCJzdHJva2UtdGV4dFwiKVxuXHRcdC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQubGFiZWwgfSk7XG5cblx0Ly8gVXBkYXRlIHRoZSBub2Rlc1xuXHRhbGxOb2RlcyA9IGFsbE5vZGVzLmRhdGEobm9kZXMsZnVuY3Rpb24oZCkge3JldHVybiBkW1wiQGlkXCJdfSk7XG5cblx0Ly8gVXBkYXRlIHRleHQgKGNvdW50IG9mIGFuIGFnZ3JlZ2F0ZU5vZGUgbWlnaHQgY2hhbmdlKVxuXHRhbGxOb2Rlcy5zZWxlY3QoXCJ0ZXh0XCIpLnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5hZ2dyZWdhdGVOb2RlID8gZC5jb3VudCA6IGQubGFiZWwgfSk7XG5cblx0Ly8gRXhpdCBhbnkgb2xkIG5vZGVzLlxuXHRhbGxOb2Rlcy5leGl0KCkucmVtb3ZlKCk7XG5cblx0Ly8gRW50ZXIgYW55IG5ldyBub2Rlcy5cblx0dmFyIG5ld05vZGVzID0gYWxsTm9kZXNcblx0XHQuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkKSB7IHJldHVybiAoZFtcImNsYXNzXCJdID8gXCJub2RlIHRcIitkW1wiY2xhc3NcIl0gOiBcIm5vZGVcIil9KVxuXHRcdC5vbihcIm1vdXNlb3ZlclwiLG1vdXNlb3Zlck5vZGUpXG5cdFx0Lm9uKFwibW91c2VvdXRcIixtb3VzZW91dE5vZGUpXG5cdFx0LmNhbGwobm9kZV9kcmFnKTtcblxuICBuZXdOb2Rlcy5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0LmF0dHIoXCJkeFwiLCAwKVxuXHRcdC5hdHRyKFwiZHlcIiwgZnVuY3Rpb24oZCkge3JldHVybiBkLmVsZW1lbnRUeXBlPT09XCJpbWFnZVwiID8gNDAgOiAwfSlcblx0XHQuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLFwibm9kZS10ZXh0XCIpXG5cdFx0LnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5hZ2dyZWdhdGVOb2RlID8gZC5jb3VudCA6IGQubGFiZWwgfSlcblx0XHQuZWFjaChmdW5jdGlvbihkKSB7ZC5yZWN0ID0gdGhpcy5nZXRCQm94KCk7XHRkLnJlY3QueSA9IGQucmVjdC55IC0gKGQuZWxlbWVudFR5cGU9PT1cImltYWdlXCIgPyA0MCA6IDApO30pO1xuXG4gIG5ld05vZGVzLmZpbHRlcihmdW5jdGlvbihkKSB7cmV0dXJuIGQuZWxlbWVudFR5cGU9PT1cImltYWdlXCJ9KS5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAuYXR0cihcImN4XCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQucmVjdC54K2QucmVjdC53aWR0aC8yfSlcbiAgICAuYXR0cihcImN5XCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQucmVjdC55K2QucmVjdC5oZWlnaHQvMis0fSlcbiAgICAuYXR0cihcInJcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gMzAgfSlcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIChkW1wiY2xhc3NcIl0gPyBcInNcIitkW1wiY2xhc3NcIl0gOiBcImRlZmF1bHRcIikgfSk7XG4gIG5ld05vZGVzLmZpbHRlcihmdW5jdGlvbihkKSB7cmV0dXJuIGQuZWxlbWVudFR5cGU9PT1cImltYWdlXCJ9KS5hcHBlbmQoXCJkZWZzXCIpLmFwcGVuZChcInBhdHRlcm5cIilcbiAgICAuYXR0cihcImlkXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIFwicGF0dGVybl9cIiArIGRbXCJAaWRcIl19KVxuICAgIC5hdHRyKFwieFwiLCBcIjAlXCIpXG4gICAgLmF0dHIoXCJ5XCIsIFwiMCVcIilcbiAgICAuYXR0cihcInZpZXdCb3hcIixcIjAgMCAxMDAgMTAwXCIpXG4gICAgLmF0dHIoXCJ3aWR0aFwiLCBcIjEwMCVcIilcbiAgICAuYXR0cihcImhlaWdodFwiLCBcIjEwMCVcIilcbiAgICAuYXBwZW5kKFwiaW1hZ2VcIilcbiAgICAgIC5hdHRyKFwieFwiLFwiMCVcIilcbiAgICAgIC5hdHRyKFwieVwiLFwiMCVcIilcbiAgICAgIC5hdHRyKFwid2lkdGhcIixcIjEwMFwiKVxuICAgICAgLmF0dHIoXCJoZWlnaHRcIixcIjEwMFwiKVxuICAgICAgLmF0dHIoXCJ4bGluazpocmVmXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaW1nfSk7XG4gIG5ld05vZGVzLmZpbHRlcihmdW5jdGlvbihkKSB7cmV0dXJuIGQuZWxlbWVudFR5cGU9PT1cImltYWdlXCJ9KS5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAuYXR0cihcImN4XCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQucmVjdC54K2QucmVjdC53aWR0aC8yfSlcbiAgICAuYXR0cihcImN5XCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQucmVjdC55K2QucmVjdC5oZWlnaHQvMis0fSlcbiAgICAuYXR0cihcInJcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gMjUgfSlcbiAgICAuYXR0cihcImZpbGxcIiwgZnVuY3Rpb24oZCkge3JldHVybiBcInVybCgjcGF0dGVybl9cIitkW1wiQGlkXCJdK1wiKVwifSlcbiAgICAuZWFjaChmdW5jdGlvbihkKSB7ZC5hcmVjdCA9IHRoaXM7fSk7XG5cblx0bmV3Tm9kZXMuZmlsdGVyKGZ1bmN0aW9uKGQpIHtyZXR1cm4gZC5lbGVtZW50VHlwZT09PVwicmVjdFwifSkuYXBwZW5kKFwicmVjdFwiKVxuXHRcdC5hdHRyKFwieFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnJlY3QueC01fSlcblx0XHQuYXR0cihcInlcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5yZWN0LnktNX0pXG5cdFx0LmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnJlY3Qud2lkdGgrMTAgfSlcblx0XHQuYXR0cihcImhlaWdodFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnJlY3QuaGVpZ2h0KzEwIH0pXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkKSB7IHJldHVybiAoZFtcImNsYXNzXCJdID8gXCJzXCIrZFtcImNsYXNzXCJdIDogXCJkZWZhdWx0XCIpIH0pXG5cdFx0LmVhY2goZnVuY3Rpb24oZCkge2QuYXJlY3QgPSB0aGlzO30pO1xuXG5cdG5ld05vZGVzLmZpbHRlcihmdW5jdGlvbihkKSB7cmV0dXJuIGQuZWxlbWVudFR5cGU9PT1cImNpcmNsZVwifSkuYXBwZW5kKFwiY2lyY2xlXCIpXG5cdFx0LmF0dHIoXCJjeFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnJlY3QueCs1fSlcblx0XHQuYXR0cihcImN5XCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQucmVjdC55KzV9KVxuXHRcdC5hdHRyKFwiclwiLCBmdW5jdGlvbihkKSB7IHJldHVybiA1K2QucmVjdC5oZWlnaHQvMiB9KVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gKGRbXCJjbGFzc1wiXSA/IFwic1wiK2RbXCJjbGFzc1wiXSA6IFwiZGVmYXVsdFwiKSB9KVxuXHRcdC5lYWNoKGZ1bmN0aW9uKGQpIHtkLmFyZWN0ID0gdGhpczt9KTtcblxuXHRmb3JjZVxuXHRcdC5ub2Rlcyhub2Rlcylcblx0XHQubGlua3MobGlua3MpXG5cdFx0LnN0YXJ0KCk7XG5cbn1cblxuZnVuY3Rpb24gdG9nZ2xlbm9kZShzaG93LG5vZGVjbGFzcykge1xuXHR2YXIgc2VsZWN0ZWRub2RlcyA9IGNvbnRhaW5lci5zZWxlY3RBbGwoXCIudFwiK25vZGVjbGFzcylcblx0c2VsZWN0ZWRub2Rlcy5zdHlsZShcInZpc2liaWxpdHlcIixzaG93ID8gXCJ2aXNpYmxlXCIgOiBcImhpZGRlblwiKTtcbn1cblxuZnVuY3Rpb24gY2xpY2tQcm9wZXJ0eUJveCgpIHtcblx0aWYgKHByb3BlcnR5Tm9kZSkge1xuXHRcdGRibGNsaWNrKHByb3BlcnR5Tm9kZSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZXhwYW5kT25lSXRlbShpZCkge1xuXHR2YXIgc2VsZWN0ZWQgPSBub2RlTWFwW2lkXTtcblx0aWYgKHNlbGVjdGVkKSB7XG5cdFx0c2VsZWN0ZWQubGlua0NvdW50Kys7XG5cdH1cblx0aWYgKHByb3BlcnR5Tm9kZSkge1xuXHRcdGlmIChwcm9wZXJ0eU5vZGUuYWdncmVnYXRlTm9kZSkge1xuXHRcdFx0cHJvcGVydHlOb2RlLmNvdW50LT0xO1xuXHRcdFx0Y2xpY2tJbmZvQm94KCk7XG5cdFx0fVxuXHR9XG5cdHVwZGF0ZSgpO1xufVxuXG5mdW5jdGlvbiBjbGlja0luZm9Cb3goKSB7XG5cdGlmIChwcm9wZXJ0eU5vZGUpIHtcblx0XHRpbmZvTm9kZSA9IHByb3BlcnR5Tm9kZTtcblx0XHRpZiAocHJvcGVydHlOb2RlLmFnZ3JlZ2F0ZU5vZGUpIHtcblx0XHRcdHZhciBodG1sPSAnPHRhYmxlIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjojRjBGMEYwO1wiPic7XG5cdFx0XHRwcm9wZXJ0eU5vZGUubGlua3MuZm9yRWFjaChmdW5jdGlvbih4KSB7XG5cdFx0XHRcdGlmIChwcm9wZXJ0eU5vZGUuaW5ib3VuZCkge1xuXHRcdFx0XHRcdGlmICh4LnNvdXJjZS5saW5rQ291bnQ8PTEpIHsgLy9IYWNrOiBsaW5rQ291bnQgaXMgbWlzdXNlZCB0byBzaG93IG5vZGVzIGZyb20gYWdncmVnYXRpb24hXG5cdFx0XHRcdFx0XHRodG1sICs9ICc8dHI+PHRkPjxhIG9uY2xpY2s9XCJleHBhbmRPbmVJdGVtKHRoaXMuaHJlZik7cmV0dXJuIGZhbHNlO1wiIGhyZWY9XCInICsgeC5zb3VyY2VbJ0BpZCddICsgJ1wiPicgKyB4LnNvdXJjZS5sYWJlbCArICc8L2E+PC90ZD48L3RyPic7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICh4LnRhcmdldC5saW5rQ291bnQ8PTEpIHsgLy9IYWNrOiBsaW5rQ291bnQgaXMgbWlzdXNlZCB0byBzaG93IG5vZGVzIGZyb20gYWdncmVnYXRpb24hXG5cdFx0XHRcdFx0XHRodG1sICs9ICc8dHI+PHRkPjxhIG9uY2xpY2s9XCJleHBhbmRPbmVJdGVtKHRoaXMuaHJlZik7cmV0dXJuIGZhbHNlO1wiIGhyZWY9XCInICsgeC50YXJnZXRbJ0BpZCddICsgJ1wiPicgKyB4LnRhcmdldC5sYWJlbCArICc8L2E+PC90ZD48L3RyPic7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGh0bWwgKz0gXCI8L3RhYmxlPlwiO1xuXHRcdFx0aW5mb0JveC5odG1sKGh0bWwpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgaHRtbCA9ICc8dGFibGU+Jztcblx0XHRcdGZvciAodmFyIGtleSBpbiBwcm9wZXJ0eU5vZGUuZGF0YSkge1xuICAgICAgICB2YXIgbGFiZWw9IGtleTtcbiAgICAgICAgaWYgKGZyYWdtZW50c1trZXldKSB7XG4gICAgICAgICAgbGFiZWw9IGZyYWdtZW50c1trZXldLmxhYmVsO1xuICAgICAgICB9O1xuICAgICAgICBpZiAobGFiZWwhPT1cIlwiKSB7XG5cdFx0XHRcdCAgaHRtbCArPSAnPHRyPjx0ZD4nK2xhYmVsKyc8L3RkPjx0ZCBjbGFzcz1cImRhdGFcIj4nK3Byb3BlcnR5Tm9kZS5kYXRhW2tleV0rXCI8L3RkPjwvdHI+XCI7XG4gICAgICAgIH1cblx0XHRcdH1cblx0XHRcdGh0bWwgKz0gXCI8L3RhYmxlPlwiO1xuXHRcdFx0aW5mb0JveC5odG1sKGh0bWwpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiB0aWNrKGUpIHtcblx0Ly9FeHRyYTogQ2FsY3VsYXRlIGNoYW5nZVxuXHRpZiAodHlwZW9mIGUgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdHZhciBrID0gNiAqIGUuYWxwaGE7XG5cdH1cblx0YWxsTGlua3MuZWFjaChmdW5jdGlvbihkKSB7XG5cdFx0Ly9FeHRyYTogdG8gZm9ybSBhIGtpbmQgb2YgdHJlZVxuXHRcdGlmICh0eXBlb2YgZSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRkLnNvdXJjZS55ICs9IGs7XG5cdFx0XHRkLnRhcmdldC55IC09IGs7XG5cdFx0fVxuXG5cdFx0Ly9DYWxjdWxhdGluZyB0aGUgZWRnZSBvZiB0aGUgcmVjdGFuZ2xlXG5cdFx0Ly8rMSB0byBhdm9pZCBkaXZpZGUgYnkgemVyb1xuXHRcdHZhciBkeCA9IE1hdGguYWJzKGQudGFyZ2V0LnggLSBkLnNvdXJjZS54KSsxLFxuXHRcdFx0ZHkgPSBNYXRoLmFicyhkLnRhcmdldC55IC0gZC5zb3VyY2UueSkrMSxcblx0XHRcdGRkeCA9IGQudGFyZ2V0LnggPCBkLnNvdXJjZS54ID8gZHggOiAtZHgsXG5cdFx0XHRkZHkgPSBkLnRhcmdldC55IDwgZC5zb3VyY2UueSA/IGR5IDogLWR5LFxuXHRcdFx0eHQgPSBkLnRhcmdldC54KyhkLnNvdXJjZS54IDwgZC50YXJnZXQueCA/IE1hdGgubWF4KGQudGFyZ2V0LnJlY3QueC01LChkLnRhcmdldC5yZWN0LnktNSkqZHgvZHkpIDogTWF0aC5taW4oZC50YXJnZXQucmVjdC54LTUrZC50YXJnZXQucmVjdC53aWR0aCsxMCwtKGQudGFyZ2V0LnJlY3QueS01KSpkeC9keSkpLFxuXHRcdFx0eXQgPSBkLnRhcmdldC55KyhkLnNvdXJjZS55IDwgZC50YXJnZXQueSA/IE1hdGgubWF4KGQudGFyZ2V0LnJlY3QueS01LChkLnRhcmdldC5yZWN0LngtNSkqZHkvZHgpIDogTWF0aC5taW4oZC50YXJnZXQucmVjdC55LTUrZC50YXJnZXQucmVjdC5oZWlnaHQrMTAsLShkLnRhcmdldC5yZWN0LngtNSkqZHkvZHgpKSxcblx0XHRcdHhzID0gZC5zb3VyY2UueCsoZC50YXJnZXQueCA8IGQuc291cmNlLnggPyBNYXRoLm1heChkLnNvdXJjZS5yZWN0LngtNSwoZC5zb3VyY2UucmVjdC55LTUpKmR4L2R5KSA6IE1hdGgubWluKGQuc291cmNlLnJlY3QueC01K2Quc291cmNlLnJlY3Qud2lkdGgrMTAsLShkLnNvdXJjZS5yZWN0LnktNSkqZHgvZHkpKSxcblx0XHRcdHlzID0gZC5zb3VyY2UueSsoZC50YXJnZXQueSA8IGQuc291cmNlLnkgPyBNYXRoLm1heChkLnNvdXJjZS5yZWN0LnktNSwoZC5zb3VyY2UucmVjdC54LTUpKmR5L2R4KSA6IE1hdGgubWluKGQuc291cmNlLnJlY3QueS01K2Quc291cmNlLnJlY3QuaGVpZ2h0KzEwLC0oZC5zb3VyY2UucmVjdC54LTUpKmR5L2R4KSk7XG5cblx0XHRcdGlmIChkLnRhcmdldC5lbGVtZW50VHlwZT09PVwiY2lyY2xlXCIpIHtcblx0XHRcdFx0dmFyIHBsID0gTWF0aC5zcXJ0KChkZHgqZGR4KSsoZGR5KmRkeSkpLFxuXHRcdFx0XHRcdHJhZCA9IDUrZC50YXJnZXQucmVjdC5oZWlnaHQvMjtcblx0XHRcdFx0eHQgPSBkLnRhcmdldC54KygoZGR4KnJhZCkvcGwpKzI7XG5cdFx0XHRcdHl0ID0gZC50YXJnZXQueSsoKGRkeSpyYWQpL3BsKS01O1xuXHRcdFx0fVxuXHRcdFx0aWYgKGQuc291cmNlLmVsZW1lbnRUeXBlPT09XCJjaXJjbGVcIikge1xuXHRcdFx0XHR2YXIgcGwgPSBNYXRoLnNxcnQoKGRkeCpkZHgpKyhkZHkqZGR5KSksXG5cdFx0XHRcdFx0cmFkID0gNStkLnNvdXJjZS5yZWN0LmhlaWdodC8yO1xuXHRcdFx0XHR4cyA9IGQuc291cmNlLngtKChkZHgqcmFkKS9wbCk7XG5cdFx0XHRcdHlzID0gZC5zb3VyY2UueS0oKGRkeSpyYWQpL3BsKS01O1xuXHRcdFx0fVxuXG4gICAgICBpZiAoZC50YXJnZXQuZWxlbWVudFR5cGU9PT1cImltYWdlXCIpIHtcbiAgICAgICAgICB2YXIgcGwgPSBNYXRoLnNxcnQoKGRkeCpkZHgpKyhkZHkqZGR5KSksXG4gICAgICAgICAgcmFkID0gMzA7XG4gICAgICAgICAgeHQgPSBkLnRhcmdldC54KygoZGR4KnJhZCkvcGwpO1xuICAgICAgICAgIHl0ID0gZC50YXJnZXQueSsoKGRkeSpyYWQpL3BsKTtcbiAgICAgIH1cbiAgICAgIGlmIChkLnNvdXJjZS5lbGVtZW50VHlwZT09PVwiaW1hZ2VcIikge1xuICAgICAgICAgIHZhciBwbCA9IE1hdGguc3FydCgoZGR4KmRkeCkrKGRkeSpkZHkpKSxcbiAgICAgICAgICByYWQgPSAzMDtcbiAgICAgICAgICB4cyA9IGQuc291cmNlLngtKChkZHgqcmFkKS9wbCk7XG4gICAgICAgICAgeXMgPSBkLnNvdXJjZS55LSgoZGR5KnJhZCkvcGwpO1xuICAgICAgfVxuXG5cdFx0Ly9DaGFuZ2UgdGhlIHBvc2l0aW9uIG9mIHRoZSBsaW5lcywgdG8gbWF0Y2ggdGhlIGJvcmRlciBvZiB0aGUgcmVjdGFuZ2xlIGluc3RlYWQgb2YgdGhlIGNlbnRyZSBvZiB0aGUgcmVjdGFuZ2xlXG5cdFx0ZDMuc2VsZWN0KHRoaXMpLnNlbGVjdEFsbChcImxpbmVcIilcblx0XHRcdC5hdHRyKFwieDFcIix4cylcblx0XHRcdC5hdHRyKFwieTFcIix5cylcblx0XHRcdC5hdHRyKFwieDJcIix4dClcblx0XHRcdC5hdHRyKFwieTJcIix5dCk7XG5cblx0XHQvL1JvdGF0ZSB0aGUgdGV4dCB0byBtYXRjaCB0aGUgYW5nbGUgb2YgdGhlIGxpbmVzXG5cdFx0dmFyIHR4ID0geHMrKHh0LXhzKSoyLzMsIC8vc2V0IGxhYmVsIGF0IDIvMyBvZiBlZGdlICh0byBzb2x2ZSBzaXR1YXRpb24gd2l0aCBvdmVybGFwcGluZyBlZGdlcylcblx0XHRcdHR5ID0geXMrKHl0LXlzKSoyLzM7XG5cdFx0ZDMuc2VsZWN0KHRoaXMpLnNlbGVjdEFsbChcInRleHRcIilcblx0XHRcdC5hdHRyKFwieFwiLHR4KVxuXHRcdFx0LmF0dHIoXCJ5XCIsdHktMylcblx0XHRcdC5hdHRyKFwidHJhbnNmb3JtXCIsXCJyb3RhdGUoXCIrTWF0aC5hdGFuKGRkeS9kZHgpKjU3K1wiIFwiK3R4K1wiIFwiK3R5K1wiKVwiKTtcblxuXHRcdC8vSUUxMCBhbmQgSUUxMSBidWdmaXhcblx0XHRpZiAoYnVnSUUpIHtcblx0XHRcdHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcyx0aGlzKTtcblx0XHR9XG5cdH0pXG5cbiAgICBhbGxOb2Rlcy5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgZC54ICsgXCIsXCIgKyBkLnkgKyBcIilcIjsgfSk7XG5cdG1vdmVQcm9wZXJ0eUJveCgpO1xuXG59XG5cbmZ1bmN0aW9uIGV4cGFuZCgpIHtcblx0aWYgKGN1cnJlbnROb2RlKSB7XG5cdFx0ZGJsY2xpY2soY3VycmVudE5vZGUpXG5cdH1cbn1cblxuZnVuY3Rpb24gZGJsY2xpY2soZCkge1xuXHQvLyBGaXhlZCBwb3NpdGlvbiBvZiBhIG5vZGUgY2FuIGJlIHJlbGF4ZWQgYWZ0ZXIgYSB1c2VyIGRvdWJsZWNsaWNrcyBBTkQgdGhlIG5vZGUgaGFzIGJlZW4gZXhwYW5kZWRcblx0ZC5maXhlZCA9IGQuZXhwYW5kZWQgPyAhZC5maXhlZCA6IGQuZml4ZWQ7XG5cblx0Ly9DaGVjayBmb3IgYWdncmVnYXRlIG5vZGVcblx0aWYgKCFkLmFnZ3JlZ2F0ZU5vZGUpIHtcblx0XHQvL09ubHkgcXVlcnkgaWYgdGhlIG5vZGVzIGhhc24ndCBiZWVuIGV4cGFuZGVkIHlldFxuXHRcdGlmICghZC5leHBhbmRlZCkge1xuXHRcdFx0Ly9GZXRjaCBuZXcgZGF0YSB2aWEgQWpheCBjYWxsXG4gICAgICBkMy54aHIoanNvbkFwaUNhbGwrZW5jb2RlVVJJQ29tcG9uZW50KGRbJ0BpZCddKSxcImFwcGxpY2F0aW9uL2xkK2pzb25cIiwgZnVuY3Rpb24oZXJyb3IsIHhocikge1xuXG4gICAgICAgIC8vUGFyc2UgeGhyIGFzIGlmIGl0IHdhcyBqc29uXG4gICAgICAgIGpzb25sZC5leHBhbmQoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSxmdW5jdGlvbiAoZXJyLCBqc29uKSB7XG4gICAgICAgICAgaWYgKCFlcnIpIHtcblxuICAgICAgICAgICAgLy9TdGlqbGVuIG9waGFsZW5cbiAgICAgICAgICAgIGpzb24uZm9yRWFjaChmdW5jdGlvbihyZXNvdXJjZSkge1xuICAgICAgICAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgaWYgKGVsbW9OYW1lIGluIHJlc291cmNlKSB7XG4gICAgICAgICAgICAgICAgZWxtb1N0eWxlc1tyZXNvdXJjZVtcIkBpZFwiXV09cmVzb3VyY2VbZWxtb05hbWVdWzBdW1wiQHZhbHVlXCJdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgYXZhaWxhYmxlTm9kZXMgPSB7fTtcbiAgICAgICAgICAgIGpzb24uZm9yRWFjaChmdW5jdGlvbih4KSB7IGF2YWlsYWJsZU5vZGVzW3hbaWRLZXldXSA9IHg7IH0pO1xuXG4gICAgICAgICAgICAvL0ZpbmQgc3ViamVjdCBhbmQgaW5zZXJ0XG4gICAgICAgICAgICB2YXIgc3ViamVjdCA9IGpzb24uZmlsdGVyKGZ1bmN0aW9uKHIpIHtyZXR1cm4gKHJbaWRLZXldPT09ZFsnQGlkJ10pfSlbMF07XG5cbiAgICAgICAgICAgIC8vQWRkIG5vZGVzIHRoYXQgYXJlIGxpbmtlZCBmcm9tIHRoZSBzdWJqZWN0IGFuZCBhdmFpbGFibGVcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHN1YmplY3QpIHtcbiAgICAgICAgICAgICAgaWYgKHByb3BlcnR5IT09aWRLZXkgJiYgcHJvcGVydHkhPT1lbG1vU3R5bGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBvYmplY3RpbmRleCBpbiBzdWJqZWN0W3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgaWYgKGF2YWlsYWJsZU5vZGVzW3N1YmplY3RbcHJvcGVydHldW29iamVjdGluZGV4XVtpZEtleV1dKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghbm9kZU1hcFtzdWJqZWN0W3Byb3BlcnR5XVtvYmplY3RpbmRleF1baWRLZXldXSkge1xuICAgICAgICAgICAgICAgICAgICAgIC8vIHN0YXJ0aW5ncG9pbnQgb2YgbmV3IG5vZGVzID0gcG9zaXRpb24gc3RhcnRpbmcgbm9kZVxuICAgICAgICAgICAgICAgICAgICAgIGFkZE5vZGUoYXZhaWxhYmxlTm9kZXNbc3ViamVjdFtwcm9wZXJ0eV1bb2JqZWN0aW5kZXhdW2lkS2V5XV0sZC54LGQueSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvL0FkZCBub2RlcyB0aGF0IGhhdmUgdGhlIHN1YmplY3QgYXMgdGFyZ2V0IChkdXBsaWNhdGVzIHdpbGwgYmUgZmlsdGVyZWQgb3V0IGJ5IGFkZE5vZGUgZnVuY3Rpb24pXG4gICAgICAgICAgICBqc29uLmZvckVhY2goZnVuY3Rpb24ocmVzb3VyY2UpIHtcbiAgICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHJlc291cmNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5IT1pZEtleSAmJiBwcm9wZXJ0eSE9ZWxtb1N0eWxlKSB7XG4gICAgICAgICAgICAgICAgICBmb3IgKHZhciBvYmplY3RpbmRleCBpbiByZXNvdXJjZVtwcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc291cmNlW3Byb3BlcnR5XVtvYmplY3RpbmRleF1baWRLZXldPT09ZFsnQGlkJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFub2RlTWFwW3Jlc291cmNlW2lkS2V5XV0pIHtcbiAgICAgICAgICAgICAgICAgIGFkZE5vZGUocmVzb3VyY2UsZC54LGQueSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy9Pbmx5IGFkZCBuZXcgbGluZXNcbiAgICAgICAgICAgIGpzb24uZm9yRWFjaChmdW5jdGlvbihyZXNvdXJjZSkge1xuICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiByZXNvdXJjZSkge1xuICAgICAgICAgICAgICAgIC8vIE9ubHkgZGlzcGxheSBpdGVtcyB0aGF0IGFyZSB1cmkncyBhbmQgZXhpc3RzIGFzIG5vZGVzXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5IT09aWRLZXkgJiYgcHJvcGVydHkhPT1lbG1vU3R5bGUpIHtcbiAgICAgICAgICAgICAgICAgIGZvciAob2JqZWN0aW5kZXggaW4gcmVzb3VyY2VbcHJvcGVydHldKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlTWFwW3Jlc291cmNlW3Byb3BlcnR5XVtvYmplY3RpbmRleF1baWRLZXldXSkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IHByb3BlcnR5LnJlcGxhY2UocmVnZXhMYWJlbEZyb21VUkksXCIkMlwiKTs7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5VXJpID0gcHJvcGVydHk7Ly9nZXRGdWxsVXJpKHByb3BlcnR5LGpzb25bXCJAY29udGV4dFwiXSk7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGF2YWlsYWJsZU5vZGVzW3Byb3BlcnR5VXJpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF2YWlsYWJsZU5vZGVzW3Byb3BlcnR5VXJpXVtyZGZzTGFiZWxdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsID0gYXZhaWxhYmxlTm9kZXNbcHJvcGVydHlVcmldW3JkZnNMYWJlbF1bMF1bXCJAdmFsdWVcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIGlmIChsaW5rTWFwW3Jlc291cmNlW2lkS2V5XStyZXNvdXJjZVtwcm9wZXJ0eV1bb2JqZWN0aW5kZXhdW2lkS2V5XV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vRXhpc3RpbmcgbGluaywgY2hlY2sgaWYgdXJpIGlzIGRpZmZlcmVudCBhbmQgbGFiZWwgaXMgZGlmZmVyZW50LCBhZGQgbGFiZWwgdG8gZXhpc3RpbmcgbGlua1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsID0gbGlua01hcFtyZXNvdXJjZVtpZEtleV0rcmVzb3VyY2VbcHJvcGVydHldW29iamVjdGluZGV4XVtpZEtleV1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChlbC51cmkhPXByb3BlcnR5KSAmJiAoZWwubGFiZWwhPWxhYmVsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBlbC5sYWJlbCs9IFwiLCBcIiArIGxhYmVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbCA9IGFkZExpbmsocmVzb3VyY2VbaWRLZXldLHJlc291cmNlW3Byb3BlcnR5XVtvYmplY3RpbmRleF1baWRLZXldLHByb3BlcnR5LGxhYmVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQ3JlYXRlIG5ldHdvcms6IHNldCBpbiAmIG91dC1saW5rc1xuICAgICAgICAgICAgICAgICAgICAgICAgbC5zb3VyY2Uub3V0TGlua3NbbC51cmldID0gbC5zb3VyY2Uub3V0TGlua3NbbC51cmldIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbC5zb3VyY2Uub3V0TGlua3NbbC51cmldLnB1c2gobCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsLnNvdXJjZS5saW5rQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGwuc291cmNlLnBhcmVudExpbmsgPSBsO1xuICAgICAgICAgICAgICAgICAgICAgICAgbC50YXJnZXQuaW5MaW5rc1tsLnVyaV0gPSBsLnRhcmdldC5pbkxpbmtzW2wudXJpXSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGwudGFyZ2V0LmluTGlua3NbbC51cmldLnB1c2gobCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsLnRhcmdldC5saW5rQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGwudGFyZ2V0LnBhcmVudExpbmsgPSBsO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkLmV4cGFuZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHVwZGF0ZVRpdGxlKGQpO1xuICAgICAgICAgICAgY3JlYXRlQWdncmVnYXRlTm9kZXMoKTtcbiAgICAgICAgICAgIHVwZGF0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cdFx0XHR9KVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHQvL1RPRE86IFVuY29sbGFwc2UgYWdncmVnYXRlXG5cdFx0ZC5leHBhbmRlZCA9IHRydWU7XG5cdFx0Ly9BIGJpdCBkaXJ0eTogbWFrZSBzdXJlIHRoYXQgdGhlIG5ldyBub2RlcyBhcmUgdmlzaWJsZVxuXHRcdGQubGlua3MuZm9yRWFjaChmdW5jdGlvbih4KSB7XG5cdFx0XHR4LnRhcmdldC5saW5rQ291bnQrKztcblx0XHRcdHguc291cmNlLmxpbmtDb3VudCsrO1xuXHRcdH0pO1xuXHRcdHVwZGF0ZSgpO1xuXHR9XG59XG5cbmV4cG9ydCB7aW5pdEdyYXBoLCB0b2dnbGVmdWxsc2NyZWVufTtcbiIsIi8vaW1wb3J0IERpYWdyYW0gZnJvbSAnLi9kaWFncmFtLmpzJ1xuLy9pbXBvcnQgZGlhZ3JhbSBmcm9tICcuL2RpYWdyYW0uanMnXG5pbXBvcnQge2luaXRHcmFwaCwgdG9nZ2xlZnVsbHNjcmVlbn0gZnJvbSAnLi9kaWFncmFtZ2xvYmFsLmpzJ1xuXG52YXIganNvbkFwaVN1YmplY3QgPSBcImh0dHA6Ly9tYWsuem9yZ2Vsb29zdmFzdGdvZWQubmwvaWQvYmVncmlwL0tvb3BcIjtcbnZhciBqc29uQXBpSURTdWJqZWN0ID0gXCJcIjtcbnZhciBqc29uQXBpQ2FsbCA9IFwiaHR0cDovL3RheG9ub21pZS56b3JnZWxvb3N2YXN0Z29lZC5ubC9yZXNvdXJjZT9yZXByZXNlbnRhdGlvbj1odHRwJTNBJTJGJTJGZG90d2Vic3RhY2sub3JnJTJGY29uZmlndXJhdGlvbiUyRkdyYXBoJmRhdGU9JnN1YmplY3Q9XCI7XG52YXIgdXJpRW5kcG9pbnQgPSBcImh0dHA6Ly90YXhvbm9taWUuem9yZ2Vsb29zdmFzdGdvZWQubmwvcmVzb3VyY2U/c3ViamVjdD1cIjtcbnZhciBmcmFnbWVudHMgPSB7fTtcblxuLy92YXIgRCA9IG5ldyBEaWFncmFtKCk7XG4vL0Quc3RhcnQoKTtcbi8vZGlhZ3JhbS5pbml0KGpzb25BcGlTdWJqZWN0LCBqc29uQXBpSURTdWJqZWN0LCBqc29uQXBpQ2FsbCwgdXJpRW5kcG9pbnQsIGZyYWdtZW50cyk7XG5cbmluaXRHcmFwaChqc29uQXBpU3ViamVjdCwganNvbkFwaUlEU3ViamVjdCwganNvbkFwaUNhbGwsIHVyaUVuZHBvaW50LCBmcmFnbWVudHMpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==