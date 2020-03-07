//import Diagram from './diagram.js'
//import diagram from './diagram.js'
import {initGraph, togglefullscreen} from './diagramglobal.js'

var jsonApiSubject = "http://mak.zorgeloosvastgoed.nl/id/begrip/Koop";
var jsonApiIDSubject = "";
var jsonApiCall = "http://taxonomie.zorgeloosvastgoed.nl/resource?representation=http%3A%2F%2Fdotwebstack.org%2Fconfiguration%2FGraph&date=&subject=";
var uriEndpoint = "http://taxonomie.zorgeloosvastgoed.nl/resource?subject=";
var fragments = {};

//var D = new Diagram();
//D.start();
//diagram.init(jsonApiSubject, jsonApiIDSubject, jsonApiCall, uriEndpoint, fragments);

initGraph(jsonApiSubject, jsonApiIDSubject, jsonApiCall, uriEndpoint, fragments);
