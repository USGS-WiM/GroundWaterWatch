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
module GroundWaterWatch.Controllers {

    declare var greinerHormann;
    declare var ga;

    'use strict';
    interface ILeafletData {
        getMap(): ng.IPromise<any>;
        getLayers(): ng.IPromise<any>;
    }
    interface ICenter {
        lat: number;
        lng: number;
        zoom: number;
    }
    interface IBounds {
        southWest: IMapPoint;
        northEast: IMapPoint;
    }
    interface IMapPoint {
        lat: number;
        lng: number;
    }
    interface IMapLayers {
        baselayers: Object;
        overlays: ILayer;
        //markers: Object;
        //geojson: Object;
    }
    interface ILayer {
        name: string;
        url: string;
        type: string;
        visible: boolean;
        layerOptions: Object;
    }
    interface IMapDefault {
        maxZoom: number;
        zoomControl: boolean;
        minZoom: number;
    }
    interface IMapController {
        center: ICenter;
        layers: IMapLayers;
        controls: Object;
        markers: Object;
        bounds: Object;
        geojson: Object;
        layercontrol: Object;

    }
    interface IMapControllerScope extends ng.IScope {
        vm: MapController;
    }

    class MapPoint implements IMapPoint {
        lat: number;
        lng: number;
        constructor() {
            this.lat = 0;
            this.lng = 0;
        }
    }
    class Center implements ICenter {
        //Properties
        //-+-+-+-+-+-+-+-+-+-+-+-
        public lat: number;
        public lng: number;
        public zoom: number;
        //Constructor
        //-+-+-+-+-+-+-+-+-+-+-+-
        constructor(lt: number, lg: number, zm: number) {
            this.lat = lt;
            this.lng = lg;
            this.zoom = zm;
        }
    }
    class Layer implements ILayer {
        public name: string;
        public url: string;
        public type: string;
        public visible: boolean;
        public layerOptions: Object;

        public constructor(nm: string, ul: string, ty: string, vis: boolean, op: Object = undefined) {
            this.name = nm;
            this.url = ul;
            this.type = ty;
            this.visible = vis;
            this.layerOptions = op;

        }
    }
    class MapDefault implements IMapDefault {
        public maxZoom: number;
        public zoomControl: boolean;
        public minZoom: number;

        constructor(mxZm: number = null, mnZm: number = null, zmCtrl: boolean = true) {
            this.maxZoom = mxZm;
            this.minZoom = mnZm;
            this.zoomControl = zmCtrl;
        }
    }

    class MapController implements IMapController {
        //Events
        //-+-+-+-+-+-+-+-+-+-+-+-
        //Properties
        //-+-+-+-+-+-+-+-+-+-+-+-
       
        private searchService: WiM.Services.ISearchAPIService;
        private leafletBoundsHelperService: any;
        private $locationService: ng.ILocationService;
        private leafletData: ILeafletData;
        private explorationService: Services.IExplorationService;
        private eventManager: WiM.Event.IEventManager;
        private gwwServices: Services.IGroundWaterWatchService;
        private modalService: Services.IModalService;   

        public SiteList: Array<Models.GroundWaterSite>;
        public isShown: boolean;

        public cursorStyle: string;
        public center: ICenter = null;
        public layers: IMapLayers = null;
        public mapDefaults: IMapDefault = null;
        public mapPoint: IMapPoint = null;
        public bounds: IBounds = null;

        public controls: any;
        public markers: Object = null;
        public geojson: Object = null;
        public events: Object = null;
        public layercontrol: Object = null;
        public regionLayer: Object = null;
        public drawControl: any;
        public toaster: any;
        public angulartics: any;
        public nominalZoomLevel: string;


        //Constructro
        //-+-+-+-+-+-+-+-+-+-+-+-
        static $inject = ['$scope', 'toaster', '$analytics', '$location', '$stateParams', 'leafletBoundsHelpers', 'leafletData', 'WiM.Services.SearchAPIService', 'GroundWaterWatch.Services.ExplorationService', 'WiM.Event.EventManager', 'GroundWaterWatch.Services.GroundWaterWatchService', 'GroundWaterWatch.Services.ModalService'];
        constructor(public $scope: IMapControllerScope, toaster, $analytics, $location: ng.ILocationService, $stateParams, leafletBoundsHelper: any, leafletData: ILeafletData, search: WiM.Services.ISearchAPIService, exploration: Services.IExplorationService, eventManager: WiM.Event.IEventManager, gwwservice: Services.IGroundWaterWatchService, modal: Services.IModalService ) {
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
            this.gwwServices = gwwservice;
            this.SiteList = gwwservice.GWSiteList;
            this.modalService = modal;
            this.isShown = true;

            //subscribe to Events

            this.eventManager.SubscribeToEvent(WiM.Directives.onLayerChanged, new WiM.Event.EventHandler<WiM.Directives.LegendLayerChangedEventArgs>((sender, e) => {
                this.onLayerChanged(sender,e);
            }));
            this.eventManager.SubscribeToEvent(WiM.Services.onSelectedAreaOfInterestChanged, new WiM.Event.EventHandler<WiM.Event.EventArgs>((sender: any, e: WiM.Services.SearchAPIEventArgs) => {
                this.onSelectedAreaOfInterestChanged(sender, e);
            }));          

            $scope.$on('leafletDirectiveMap.mousemove',(event, args) => {
                var latlng = args.leafletEvent.latlng;
                this.mapPoint.lat = latlng.lat;
                this.mapPoint.lng = latlng.lng;
            });

            $scope.$on('leafletDirectiveMap.drag',(event, args) => {
                this.cursorStyle = 'grabbing';
            });

            $scope.$on('leafletDirectiveMap.dragend',(event, args) => {
                this.cursorStyle = 'pointer';
            }); 

            $scope.$on('leafletDirectiveMap.click', (event, args) => {

                this.gwwServices.SelectedGWSite = null;
                this.modalService.openModal(Services.ModalType.e_siteinfo);

                this.leafletData.getMap().then((map: any) => {
                    var boundsString = map.getBounds().toBBoxString();
                    var x = Math.round(map.layerPointToContainerPoint(args.leafletEvent.layerPoint).x);
                    var y = Math.round(map.layerPointToContainerPoint(args.leafletEvent.layerPoint).y);
                    var width = map.getSize().x;
                    var height = map.getSize().y;

                    this.gwwServices.queryGWsite(args.leafletEvent.latlng, boundsString,x,y,width,height)
                });
            }); 

            $scope.$watch(() => this.bounds, (newval, oldval) => this.mapBoundsChange(oldval, newval));

            $scope.$watch(() => this.explorationService.elevationProfileGeoJSON,(newval, oldval) => {
                if (newval) this.displayElevationProfile()
            });

            $scope.$watch(() => this.explorationService.drawElevationProfile,(newval, oldval) => {
                if (newval) this.elevationProfile();
            });

            $scope.$watch(() => this.explorationService.drawMeasurement,(newval, oldval) => {
                //console.log('measurementListener ', newval, oldval);
                if (newval) this.measurement();
            });
        }

        //Methods
        //-+-+-+-+-+-+-+-+-+-+-+-
        public toggleShown() {
            this.isShown = !this.isShown;
        }
        //Helper Methods
        //-+-+-+-+-+-+-+-+-+-+-+-
        private init(): void { 
            
            //init map         
            this.cursorStyle = 'pointer';  
            this.center = new Center(39, -100, 3);
            this.nominalZoomLevel = this.scaleLookup(this.center.zoom); 
            this.layers = {
                baselayers: configuration.basemaps,
                overlays: configuration.overlayedLayers
            }
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
                custom:
                new Array(
                    //zoom home button control
                    //(<any>L.Control).zoomHome({ homeCoordinates: [39, -100], homeZoom: 4 }),
                    //location control
                    (<any>L.control).locate({ follow: false, locateOptions: {"maxZoom": 15} }),
                    (<any>L.control).elevation({ imperial: true })
                    )
            };
            this.events = {
                map: {
                    enable: ['mousemove']
                }
            }
            this.mapPoint = new MapPoint();
            L.Icon.Default.imagePath = 'images';
        }

        public scaleLookup(mapZoom: number) {
            switch (mapZoom) {
                case 19: return '1,128'
                case 18: return '2,256'
                case 17: return '4,513'
                case 16: return '9,027'
                case 15: return '18,055'
                case 14: return '36,111'
                case 13: return '72,223'
                case 12: return '144,447'
                case 11: return '288,895'
                case 10: return '577,790'
                case 9: return '1,155,581'
                case 8: return '2,311,162'
                case 7: return '4,622,324'
                case 6: return '9,244,649'
                case 5: return '18,489,298'
                case 4: return '36,978,596'
                case 3: return '73,957,193'
                case 2: return '147,914,387'
                case 1: return '295,828,775'
                case 0: return '591,657,550'
            }
        }


        private initiateStreamgageQuery() {

            //change cursor here if needed

            this.explorationService.allowStreamgageQuery = !this.explorationService.allowStreamgageQuery;  
        }

        private elevationProfile() {

            document.getElementById('measurement-div').innerHTML = '';
            this.explorationService.measurementData = '';
            this.explorationService.showElevationChart = true;

            var el;

            //get reference to elevation control
            this.controls.custom.forEach((control) => {
                if (control._container.className.indexOf("elevation") > -1) el = control;
            });

            //report ga event
            this.angulartics.eventTrack('explorationTools', { category: 'Map', label: 'elevationProfile' });

            this.leafletData.getMap().then((map: any) => {
                this.leafletData.getLayers().then((maplayers: any) => {

                    //create draw control
                    var drawnItems = maplayers.overlays.draw;
                    drawnItems.clearLayers();

                    this.drawController({ metric: false }, true);

                    delete this.geojson['elevationProfileLine3D'];

                    map.on('draw:drawstart',(e) => {
                        //console.log('in draw start');
                        el.clear();
                    });

                    //listen for end of draw
                    map.on('draw:created',(e) => {

                        map.removeEventListener('draw:created');

                        var feature = e.layer.toGeoJSON();
			
                        //convert to esriJSON
                        var esriJSON = '{"geometryType":"esriGeometryPolyline","spatialReference":{"wkid":"4326"},"fields": [],"features":[{"geometry": {"type":"polyline", "paths":[' + JSON.stringify(feature.geometry.coordinates) + ']}}]}'

                        //make the request
                        this.cursorStyle = 'wait'
                        this.toaster.pop("info", "Information", "Querying the elevation service...", 0);
                        this.explorationService.elevationProfile(esriJSON)

                        //disable button 
                        this.explorationService.drawElevationProfile = false;

                        //force map refresh
                        map.panBy([0, 1]);
                    }); 
                });
            });
        }

        private drawController(options: Object, enable: boolean) {
            //console.log('in drawcontroller: ', options, enable);

            if (!enable) {               
                this.drawControl.disable();
                this.drawControl = undefined;
                //console.log('removing drawControl', this.drawControl);
                return;
            }
            this.leafletData.getMap().then((map: any) => {
                //console.log('enable drawControl');
                this.drawControl = new (<any>L).Draw.Polyline(map, options);
                this.drawControl.enable();
            });
        }

        private displayElevationProfile() {

            //get reference to elevation control
            var el;
            this.controls.custom.forEach((control) => {
                if (control._container && control._container.className.indexOf("elevation") > -1) el = control;
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
            }

            this.leafletData.getMap().then((map: any) => {
                var container = el.onAdd(map);
                document.getElementById('elevation-div').innerHTML = '';
                document.getElementById('elevation-div').appendChild(container);
            });

            this.toaster.clear();
            this.cursorStyle = 'pointer'
        }

        private showLocation() {

            //get reference to location control
            var lc;
            this.controls.custom.forEach((control) => {
                if (control._container.className.indexOf("leaflet-control-locate") > -1) lc = control; 
            });
            lc.start();
        }

        private resetMap() {
            this.removeOverlayLayers("_region", true);
            this.center = new Center(39, -100, 3);
        }

        private resetExplorationTools() {
            document.getElementById('elevation-div').innerHTML = '';
            document.getElementById('measurement-div').innerHTML = '';
            if (this.drawControl) this.drawController({ }, false);
            this.explorationService.allowStreamgageQuery = false;
            this.explorationService.drawMeasurement = false;
            this.explorationService.measurementData = '';
            this.explorationService.drawElevationProfile = false;
            this.explorationService.showElevationChart = false;
        }

        private measurement() {

            //console.log('in measurement tool');

            document.getElementById('elevation-div').innerHTML = '';
            //user affordance
            this.explorationService.measurementData = 'Click the map to begin\nDouble click to end the Drawing';

            //report ga event
            this.angulartics.eventTrack('explorationTools', { category: 'Map', label: 'measurement' });

            this.leafletData.getMap().then((map: any) => {
                //console.log('got map: ', map);
                this.leafletData.getLayers().then((maplayers: any) => {
                    //console.log('got maplayers: ', maplayers);
                    var stopclick = false; //to prevent more than one click listener

                    this.drawController({shapeOptions: { color: 'blue' }, metric: false }, true);

                    var drawnItems = maplayers.overlays.draw;
                    drawnItems.clearLayers();
			
                    //listeners active during drawing
                    var measuremove = () => {
                        this.explorationService.measurementData = "Total length: " + this.drawControl._getMeasurementString();
                    };
                    var measurestart = () => {
                        if (stopclick == false) {
                            stopclick = true;
                            this.explorationService.measurementData = "Total Length: ";
                            map.on("mousemove", measuremove);
                        };
                    };

                    var measurestop = (e) => {
                        var layer = e.layer;
                        drawnItems.addLayer(layer);
                        drawnItems.addTo(map);
			
                        //reset button
                        this.explorationService.measurementData = "Total length: " + this.drawControl._getMeasurementString();
                        //remove listeners
                        map.off("click", measurestart);
                        map.off("mousemove", measuremove);
                        map.off("draw:created", measurestop);

                        this.drawControl.disable();
                        this.explorationService.drawMeasurement = false;
                    };

                    map.on("click", measurestart);
                    map.on("draw:created", measurestop);


                });
            });
        }

        private onSelectedGWSiteChanged() {
            this.modalService.openModal(Services.ModalType.e_siteinfo);
        }

        private onSelectedAreaOfInterestChanged(sender: any, e: WiM.Services.SearchAPIEventArgs) {

            //ga event
            this.angulartics.eventTrack('Search', { category: 'Sidebar' });

            this.markers = {};
            var AOI = e.selectedAreaOfInterest;

            if (AOI.Category == "U.S. State or Territory") var zoomlevel = 9;
            else var zoomlevel = 14;

            this.markers['AOI'] = {
                lat: AOI.Latitude,
                lng: AOI.Longitude,
                message: AOI.Name,
                focus: true,
                draggable: false
            }

            //this.center = new Center(AOI.Latitude, AOI.Longitude, zoomlevel);

            this.leafletData.getMap().then((map: any) => {
                map.setView([AOI.Latitude, AOI.Longitude], zoomlevel)
            });
        }

        private removeGeoJson(layerName: string = "") {
            for (var k in this.geojson) {
                if (typeof this.geojson[k] !== 'function') {
                    delete this.geojson[k];
                    this.eventManager.RaiseEvent(WiM.Directives.onLayerRemoved, this, new WiM.Directives.LegendLayerRemovedEventArgs(k, "geojson")); 
                }
            }
        }
        private addGeoJSON(LayerName: string, feature: any) {
            
        }
        private onLayerChanged(sender: WiM.Directives.IwimLegendController, e: WiM.Directives.LegendLayerChangedEventArgs) {
            if (e.PropertyName === "visible") {
                if (!e.Value)
                    delete this.geojson[e.LayerName];
                else {
                    //get feature
                    var value: any = null;
                    //for (var i = 0; i < this.studyArea.selectedStudyArea.Features.length; i++) {
                    //    var item = angular.fromJson(angular.toJson(this.studyArea.selectedStudyArea.Features[i]));
                    //    if (item.name == e.LayerName)
                    //        this.addGeoJSON(e.LayerName, item.feature);
                    //}//next
                }//end if  
            }//end if
        }


        private removeOverlayLayers(name: string, isPartial: boolean = false) {
            var layeridList: Array<string>;

            layeridList = this.getLayerIdsByID(name, this.layers.overlays, isPartial);

            layeridList.forEach((item) => {
                //console.log('removing map overlay layer: ', item);
                delete this.layers.overlays[item];
            });
        }

        private getLayerIdsByName(name: string, layerObj: Object, isPartial: boolean): Array<string> {
            var layeridList: Array<string> = [];

            for (var variable in layerObj) {
                if (layerObj[variable].hasOwnProperty("name") && (isPartial ? (layerObj[variable].name.indexOf(name) > -1) : (layerObj[variable].name === name))) {
                    layeridList.push(variable);
                }
            }//next variable
            return layeridList;
        }
        private getLayerIdsByID(id: string, layerObj: Object, isPartial: boolean): Array<string> {
            var layeridList: Array<string> = [];

            for (var variable in layerObj) {
                if (isPartial ? (variable.indexOf(id) > -1) : (variable === id)) {
                    layeridList.push(variable);
                }
            }//next variable
            return layeridList;
        }


        private mapBoundsChange(oldValue, newValue) {
            this.nominalZoomLevel = this.scaleLookup(this.center.zoom);
        }

    }//end class

    angular.module('GroundWaterWatch.Controllers')
        .controller('GroundWaterWatch.Controllers.MapController', MapController)
}//end module
 