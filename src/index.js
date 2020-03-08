//import Diagram from './diagram.js'
//import diagram from './diagram.js'
import {initGraph, togglefullscreen, mouseoverPropertyBox, mouseoutPropertyBox, clickInfoBox, clickPropertyBox, expand} from './diagramglobal.js'

var jsonApiSubject = "http://example.org/id/JaneDoe"; //URI of the subject that is the center of the graph
var jsonApiIDSubject = ""; //Not used
var jsonApiCall = "http://localhost:8080/test.json?subject="; //Graph that contains the data (or a JSON-LD service that can be queried)
var uriEndpoint = "http://localhost:8080?subject="; //Endpoint that can be used to navigate to (empty means that the original URI is used as endpoint)
var fragments = {};

//var D = new Diagram();
//D.start();
//diagram.init(jsonApiSubject, jsonApiIDSubject, jsonApiCall, uriEndpoint, fragments);

initGraph(jsonApiSubject, jsonApiIDSubject, jsonApiCall, uriEndpoint, fragments);

export {togglefullscreen, mouseoverPropertyBox, mouseoutPropertyBox, clickInfoBox, clickPropertyBox, expand};
