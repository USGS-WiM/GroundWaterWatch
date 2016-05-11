//------------------------------------------------------------------------------
//----- MapController ----------------------------------------------------------
//------------------------------------------------------------------------------
//-------1---------2---------3---------4---------5---------6---------7---------8
//       01234567890123456789012345678901234567890123456789012345678901234567890
//-------+---------+---------+---------+---------+---------+---------+---------+
// copyright:   2015 WiM - USGS
//    authors:  Jeremy K. Newson USGS Wisconsin Internet Mapping
//   purpose:  
//discussion:   Controllers are typically built to reflect a View. 
//              and should only contailn business logic needed for a single view. For example, if a View 
//              contains a ListBox of objects, a Selected object, and a Save button, the Controller 
//              will have an ObservableCollection ObectList, 
//              Model SelectedObject, and SaveCommand.
//Comments
//04.15.2015 jkn - Created
//Imports"
var WiMapper;
(function (WiMapper) {
    var Controllers;
    (function (Controllers) {
        'use strict';
        var MapPoint = (function () {
            function MapPoint() {
                this.lat = 0;
                this.lng = 0;
            }
            return MapPoint;
        })();
        var Center = (function () {
            //Constructor
            //-+-+-+-+-+-+-+-+-+-+-+-
            function Center(lt, lg, zm) {
                this.lat = lt;
                this.lng = lg;
                this.zoom = zm;
            }
            return Center;
        })();
        var Layer = (function () {
            function Layer(nm, ul, ty, vis, op) {
                if (op === void 0) { op = undefined; }
                this.name = nm;
                this.url = ul;
                this.type = ty;
                this.visible = vis;
                this.layerOptions = op;
            }
            return Layer;
        })();
        var MapDefault = (function () {
            function MapDefault(mxZm, mnZm, zmCtrl) {
                if (mxZm === void 0) { mxZm = null; }
                if (mnZm === void 0) { mnZm = null; }
                if (zmCtrl === void 0) { zmCtrl = true; }
                this.maxZoom = mxZm;
                this.minZoom = mnZm;
                this.zoomControl = zmCtrl;
            }
            return MapDefault;
        })();
        var MapController = (function () {
            function MapController($scope, toaster, $analytics, $location, $stateParams, leafletBoundsHelper, leafletData, search, exploration, eventManager) {
                var _this = this;
                this.$scope = $scope;
                this.center = null;
                this.layers = null;
                this.mapDefaults = null;
                this.mapPoint = null;
                this.bounds = null;
                this.markers = null;
                this.geojson = null;
                this.events = null;
                this.layercontrol = null;
                this.regionLayer = null;
                $scope.vm = this;
                this.init();
                this.toaster = toaster;
                this.angulartics = $analytics;
                this.searchService = search;
                this.$locationService = $location;
                this.leafletBoundsHelperService = leafletBoundsHelper;
                this.leafletData = leafletData;
                this.explorationService = exploration;
                this.eventManager = eventManager;
                //subscribe to Events
                this.eventManager.SubscribeToEvent(WiM.Directives.onLayerChanged, new WiM.Event.EventHandler(function (sender, e) {
                    _this.onLayerChanged(sender, e);
                }));
                this.eventManager.SubscribeToEvent(WiM.Services.onSelectedAreaOfInterestChanged, new WiM.Event.EventHandler(function (sender, e) {
                    _this.onSelectedAreaOfInterestChanged(sender, e);
                }));
                $scope.$on('leafletDirectiveMap.mousemove', function (event, args) {
                    var latlng = args.leafletEvent.latlng;
                    _this.mapPoint.lat = latlng.lat;
                    _this.mapPoint.lng = latlng.lng;
                });
                $scope.$on('leafletDirectiveMap.drag', function (event, args) {
                    _this.cursorStyle = 'grabbing';
                });
                $scope.$on('leafletDirectiveMap.dragend', function (event, args) {
                    _this.cursorStyle = 'pointer';
                });
                $scope.$watch(function () { return _this.explorationService.elevationProfileGeoJSON; }, function (newval, oldval) {
                    if (newval)
                        _this.displayElevationProfile();
                });
                $scope.$watch(function () { return _this.explorationService.drawElevationProfile; }, function (newval, oldval) {
                    if (newval)
                        _this.elevationProfile();
                });
                $scope.$watch(function () { return _this.explorationService.drawMeasurement; }, function (newval, oldval) {
                    //console.log('measurementListener ', newval, oldval);
                    if (newval)
                        _this.measurement();
                });
            }
            //Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            //Helper Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            MapController.prototype.init = function () {
                //init map           
                this.center = new Center(39, -100, 3);
                this.layers = {
                    baselayers: configuration.basemaps,
                    overlays: configuration.overlayedLayers
                };
                this.mapDefaults = new MapDefault(null, 3, true);
                this.markers = {};
                this.geojson = {};
                this.regionLayer = {};
                this.controls = {
                    scale: true,
                    draw: {
                        draw: {
                            polygon: false,
                            polyline: false,
                            rectangle: false,
                            circle: false,
                            marker: false
                        }
                    },
                    custom: new Array(
                    //zoom home button control
                    //(<any>L.Control).zoomHome({ homeCoordinates: [39, -100], homeZoom: 4 }),
                    //location control
                    L.control.locate({ follow: false, locateOptions: { "maxZoom": 15 } }), L.control.elevation({ imperial: true }))
                };
                this.events = {
                    map: {
                        enable: ['mousemove']
                    }
                };
                this.mapPoint = new MapPoint();
                L.Icon.Default.imagePath = 'images';
            };
            MapController.prototype.scaleLookup = function (mapZoom) {
                switch (mapZoom) {
                    case 19: return '1,128';
                    case 18: return '2,256';
                    case 17: return '4,513';
                    case 16: return '9,027';
                    case 15: return '18,055';
                    case 14: return '36,111';
                    case 13: return '72,223';
                    case 12: return '144,447';
                    case 11: return '288,895';
                    case 10: return '577,790';
                    case 9: return '1,155,581';
                    case 8: return '2,311,162';
                    case 7: return '4,622,324';
                    case 6: return '9,244,649';
                    case 5: return '18,489,298';
                    case 4: return '36,978,596';
                    case 3: return '73,957,193';
                    case 2: return '147,914,387';
                    case 1: return '295,828,775';
                    case 0: return '591,657,550';
                }
            };
            MapController.prototype.initiateStreamgageQuery = function () {
                //change cursor here if needed
                this.explorationService.allowStreamgageQuery = !this.explorationService.allowStreamgageQuery;
            };
            MapController.prototype.elevationProfile = function () {
                var _this = this;
                document.getElementById('measurement-div').innerHTML = '';
                this.explorationService.measurementData = '';
                this.explorationService.showElevationChart = true;
                var el;
                //get reference to elevation control
                this.controls.custom.forEach(function (control) {
                    if (control._container.className.indexOf("elevation") > -1)
                        el = control;
                });
                //report ga event
                this.angulartics.eventTrack('explorationTools', { category: 'Map', label: 'elevationProfile' });
                this.leafletData.getMap().then(function (map) {
                    _this.leafletData.getLayers().then(function (maplayers) {
                        //create draw control
                        var drawnItems = maplayers.overlays.draw;
                        drawnItems.clearLayers();
                        _this.drawController({ metric: false }, true);
                        delete _this.geojson['elevationProfileLine3D'];
                        map.on('draw:drawstart', function (e) {
                            //console.log('in draw start');
                            el.clear();
                        });
                        //listen for end of draw
                        map.on('draw:created', function (e) {
                            map.removeEventListener('draw:created');
                            var feature = e.layer.toGeoJSON();
                            //convert to esriJSON
                            var esriJSON = '{"geometryType":"esriGeometryPolyline","spatialReference":{"wkid":"4326"},"fields": [],"features":[{"geometry": {"type":"polyline", "paths":[' + JSON.stringify(feature.geometry.coordinates) + ']}}]}';
                            //make the request
                            _this.cursorStyle = 'wait';
                            _this.toaster.pop("info", "Information", "Querying the elevation service...", 0);
                            _this.explorationService.elevationProfile(esriJSON);
                            //disable button 
                            _this.explorationService.drawElevationProfile = false;
                            //force map refresh
                            map.panBy([0, 1]);
                        });
                    });
                });
            };
            MapController.prototype.drawController = function (options, enable) {
                //console.log('in drawcontroller: ', options, enable);
                var _this = this;
                if (!enable) {
                    this.drawControl.disable();
                    this.drawControl = undefined;
                    //console.log('removing drawControl', this.drawControl);
                    return;
                }
                this.leafletData.getMap().then(function (map) {
                    //console.log('enable drawControl');
                    _this.drawControl = new L.Draw.Polyline(map, options);
                    _this.drawControl.enable();
                });
            };
            MapController.prototype.displayElevationProfile = function () {
                //get reference to elevation control
                var el;
                this.controls.custom.forEach(function (control) {
                    if (control._container && control._container.className.indexOf("elevation") > -1)
                        el = control;
                });
                //parse it
                this.geojson["elevationProfileLine3D"] = {
                    data: this.explorationService.elevationProfileGeoJSON,
                    style: {
                        "color": "#ff7800",
                        "weight": 5,
                        "opacity": 0.65
                    },
                    onEachFeature: el.addData.bind(el)
                };
                this.leafletData.getMap().then(function (map) {
                    var container = el.onAdd(map);
                    document.getElementById('elevation-div').innerHTML = '';
                    document.getElementById('elevation-div').appendChild(container);
                });
                this.toaster.clear();
                this.cursorStyle = 'pointer';
            };
            MapController.prototype.showLocation = function () {
                //get reference to location control
                var lc;
                this.controls.custom.forEach(function (control) {
                    if (control._container.className.indexOf("leaflet-control-locate") > -1)
                        lc = control;
                });
                lc.start();
            };
            MapController.prototype.resetMap = function () {
                this.removeOverlayLayers("_region", true);
                this.center = new Center(39, -100, 3);
            };
            MapController.prototype.resetExplorationTools = function () {
                document.getElementById('elevation-div').innerHTML = '';
                document.getElementById('measurement-div').innerHTML = '';
                if (this.drawControl)
                    this.drawController({}, false);
                this.explorationService.allowStreamgageQuery = false;
                this.explorationService.drawMeasurement = false;
                this.explorationService.measurementData = '';
                this.explorationService.drawElevationProfile = false;
                this.explorationService.showElevationChart = false;
            };
            MapController.prototype.measurement = function () {
                //console.log('in measurement tool');
                var _this = this;
                document.getElementById('elevation-div').innerHTML = '';
                //user affordance
                this.explorationService.measurementData = 'Click the map to begin\nDouble click to end the Drawing';
                //report ga event
                this.angulartics.eventTrack('explorationTools', { category: 'Map', label: 'measurement' });
                this.leafletData.getMap().then(function (map) {
                    //console.log('got map: ', map);
                    _this.leafletData.getLayers().then(function (maplayers) {
                        //console.log('got maplayers: ', maplayers);
                        var stopclick = false; //to prevent more than one click listener
                        _this.drawController({ shapeOptions: { color: 'blue' }, metric: false }, true);
                        var drawnItems = maplayers.overlays.draw;
                        drawnItems.clearLayers();
                        //listeners active during drawing
                        var measuremove = function () {
                            _this.explorationService.measurementData = "Total length: " + _this.drawControl._getMeasurementString();
                        };
                        var measurestart = function () {
                            if (stopclick == false) {
                                stopclick = true;
                                _this.explorationService.measurementData = "Total Length: ";
                                map.on("mousemove", measuremove);
                            }
                            ;
                        };
                        var measurestop = function (e) {
                            var layer = e.layer;
                            drawnItems.addLayer(layer);
                            drawnItems.addTo(map);
                            //reset button
                            _this.explorationService.measurementData = "Total length: " + _this.drawControl._getMeasurementString();
                            //remove listeners
                            map.off("click", measurestart);
                            map.off("mousemove", measuremove);
                            map.off("draw:created", measurestop);
                            _this.drawControl.disable();
                            _this.explorationService.drawMeasurement = false;
                        };
                        map.on("click", measurestart);
                        map.on("draw:created", measurestop);
                    });
                });
            };
            MapController.prototype.onSelectedAreaOfInterestChanged = function (sender, e) {
                //ga event
                this.angulartics.eventTrack('Search', { category: 'Sidebar' });
                this.markers = {};
                var AOI = e.selectedAreaOfInterest;
                if (AOI.Category == "U.S. State or Territory")
                    var zoomlevel = 9;
                else
                    var zoomlevel = 14;
                this.markers['AOI'] = {
                    lat: AOI.Latitude,
                    lng: AOI.Longitude,
                    message: AOI.Name,
                    focus: true,
                    draggable: false
                };
                //this.center = new Center(AOI.Latitude, AOI.Longitude, zoomlevel);
                this.leafletData.getMap().then(function (map) {
                    map.setView([AOI.Latitude, AOI.Longitude], zoomlevel);
                });
            };
            MapController.prototype.removeGeoJson = function (layerName) {
                if (layerName === void 0) { layerName = ""; }
                for (var k in this.geojson) {
                    if (typeof this.geojson[k] !== 'function') {
                        delete this.geojson[k];
                        this.eventManager.RaiseEvent(WiM.Directives.onLayerRemoved, this, new WiM.Directives.LegendLayerRemovedEventArgs(k, "geojson"));
                    }
                }
            };
            MapController.prototype.addGeoJSON = function (LayerName, feature) {
            };
            MapController.prototype.onLayerChanged = function (sender, e) {
                if (e.PropertyName === "visible") {
                    if (!e.Value)
                        delete this.geojson[e.LayerName];
                    else {
                        //get feature
                        var value = null;
                    } //end if  
                } //end if
            };
            MapController.prototype.removeOverlayLayers = function (name, isPartial) {
                var _this = this;
                if (isPartial === void 0) { isPartial = false; }
                var layeridList;
                layeridList = this.getLayerIdsByID(name, this.layers.overlays, isPartial);
                layeridList.forEach(function (item) {
                    //console.log('removing map overlay layer: ', item);
                    delete _this.layers.overlays[item];
                });
            };
            MapController.prototype.getLayerIdsByName = function (name, layerObj, isPartial) {
                var layeridList = [];
                for (var variable in layerObj) {
                    if (layerObj[variable].hasOwnProperty("name") && (isPartial ? (layerObj[variable].name.indexOf(name) > -1) : (layerObj[variable].name === name))) {
                        layeridList.push(variable);
                    }
                } //next variable
                return layeridList;
            };
            MapController.prototype.getLayerIdsByID = function (id, layerObj, isPartial) {
                var layeridList = [];
                for (var variable in layerObj) {
                    if (isPartial ? (variable.indexOf(id) > -1) : (variable === id)) {
                        layeridList.push(variable);
                    }
                } //next variable
                return layeridList;
            };
            //Constructro
            //-+-+-+-+-+-+-+-+-+-+-+-
            MapController.$inject = ['$scope', 'toaster', '$analytics', '$location', '$stateParams', 'leafletBoundsHelpers', 'leafletData', 'WiM.Services.SearchAPIService', 'WiMapper.Services.ExplorationService', 'WiM.Event.EventManager'];
            return MapController;
        })(); //end class
        angular.module('WiMapper.Controllers')
            .controller('WiMapper.Controllers.MapController', MapController);
    })(Controllers = WiMapper.Controllers || (WiMapper.Controllers = {}));
})(WiMapper || (WiMapper = {})); //end module
//# sourceMappingURL=MapController.js.map