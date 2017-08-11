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
        getMap(any): ng.IPromise<any>;
        getLayers(any): ng.IPromise<any>;
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
        constructor(lat:number=0,lng:number=0) {
            this.lat = lat;
            this.lng = lng;
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
    export var onBoundingBoxChanged: string = "onBoundingBoxChanged";
    export class BoundingBoxChangedEventArgs extends WiM.Event.EventArgs {
        zoomlevel: number;
        northern: number;
        southern: number;
        eastern: number;
        western: number;
        constructor(bbox:IBounds, zoomlevel:number) {
            super();
            this.zoomlevel = zoomlevel;
            this.northern = bbox.northEast.lng;
            this.southern = bbox.southWest.lng;
            this.eastern = bbox.northEast.lat;
            this.western = bbox.southWest.lat;
        }
    }
    class MapController implements IMapController {
        //Events
        //-+-+-+-+-+-+-+-+-+-+-+-
        //Properties
        //-+-+-+-+-+-+-+-+-+-+-+-
       
        private searchService: WiM.Services.ISearchAPIService;
        private initialized: boolean = false;
        private leafletBoundsHelperService: any;
        private $locationService: ng.ILocationService;
        private leafletData: ILeafletData;
        private explorationService: Services.IExplorationService;
        private eventManager: WiM.Event.IEventManager;
        private gwwServices: Services.IGroundWaterWatchService;
        private modalService: Services.IModalService;   

        public SiteList: Array<Models.GroundWaterSite>;
        public SiteListEnabled: boolean;

        public cursorStyle: string;
        public center: ICenter = null;
        public layers: IMapLayers = null;
        public mapDefaults: IMapDefault = null;
        public mapPoint: IMapPoint = null;
        public bounds: IBounds = null;

        public controls: any;
        public markers: Object = null;
        public paths: Object = null;
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
        static $inject = ['$scope', '$rootScope', 'toaster', '$analytics', '$location', '$stateParams', 'leafletBoundsHelpers', 'leafletData', 'WiM.Services.SearchAPIService', 'GroundWaterWatch.Services.ExplorationService', 'WiM.Event.EventManager', 'GroundWaterWatch.Services.GroundWaterWatchService','GroundWaterWatch.Services.ModalService','$timeout'];
        constructor(public $scope: IMapControllerScope,$rootscope:ng.IRootScopeService ,toaster, $analytics, $location: ng.ILocationService, $stateParams, leafletBoundsHelper: any, leafletData: ILeafletData, search: WiM.Services.ISearchAPIService, exploration: Services.IExplorationService, eventManager: WiM.Event.IEventManager, gwwservice: Services.IGroundWaterWatchService, modal: Services.IModalService,$timeout: ng.ITimeoutService ) {
            $scope.vm = this;
            $rootscope["isShown"] = true;
            
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
            this.SiteListEnabled = false;

            this.init();

            //register event
            this.eventManager.AddEvent(onBoundingBoxChanged);
            //subscribe to Events
            this.eventManager.SubscribeToEvent(WiM.Directives.onLayerChanged, new WiM.Event.EventHandler<WiM.Directives.LegendLayerChangedEventArgs>((sender, e) => {
                this.onLayerChanged(e);
            }));
            this.eventManager.SubscribeToEvent(WiM.Services.onSelectedAreaOfInterestChanged, new WiM.Event.EventHandler<WiM.Event.EventArgs>((sender: any, e: WiM.Services.SearchAPIEventArgs) => {
                this.onSelectedAreaOfInterestChanged(sender, e);
            }));  
            this.eventManager.SubscribeToEvent(Services.onGWSiteSelectionChanged, new WiM.Event.EventHandler<Services.GWSiteSelectionEventArgs>((sender: any, e: Services.GWSiteSelectionEventArgs) => {
                this.onGWSiteSelectionChanged(sender, e);
            }));         
            
            $scope.$on('leafletDirectiveMap.mainMap.mousemove',(event, args) => {
                var latlng = args.leafletEvent.latlng;
                this.mapPoint.lat = latlng.lat;
                this.mapPoint.lng = latlng.lng;
            });
            $scope.$on('leafletDirectiveMap.mainMap.drag',(event, args) => {
                this.cursorStyle = 'grabbing';
            });
            $scope.$on('leafletDirectiveMap.mainMap.dragend',(event, args) => {
                this.cursorStyle = 'pointer';
            });
            $scope.$watch(() => this.bounds, (newval, oldval) => this.mapBoundsChange(oldval, newval));
            $scope.$on('leafletDirectiveMap.mainMap.click', (event, args) => {
                this.leafletData.getMap("mainMap").then((map: any) => {
                    if (!this.explorationService.drawMeasurement && !this.explorationService.drawElevationProfile) this.gwwServices.queryGWsite(args.leafletEvent.latlng, map.getZoom())
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
            $scope.$watch(() => this.SiteList, (newval, oldval) => {
                //console.log('measurementListener ', newval, oldval);
                if (newval.length > 0) this.SiteListEnabled = true;
                else this.SiteListEnabled = false;
            });
            $scope.$watchCollection(() => this.gwwServices.SelectedGWFilters, (newval, oldval) => {
                if (newval) this.updateMapFilters()
            });
            $timeout(() => {
                this.leafletData.getMap("mainMap").then((map: any) => { map.invalidateSize() })
            });

            // check if parameters are being explicitly set. ncd&sc&cc&S
            if ($stateParams.ncd || $stateParams.sc || $stateParams.cc || $stateParams.S) {

                var filterList: Array<Models.IGroundWaterFilterSite> = [];
                if ($stateParams.ncd) (<string>$stateParams.ncd).split(",").forEach((fl) => {
                    fl = fl.toUpperCase();
                    if (fl == "LTN") {
                        fl = this.getLTNTimeperiod($stateParams.d)+this.getLTNFrequency($stateParams.a);
                    }
                    filterList.push(new Models.GroundWaterFilterSite({ code: fl }, Models.FilterType.NETWORK));
                });
                if ($stateParams.sc && !$stateParams.cc)
                    (<string>$stateParams.sc).split(",").forEach((fl) => { filterList.push(new Models.GroundWaterFilterSite({ code: fl.toUpperCase() }, Models.FilterType.STATE)); });
                else if ($stateParams.sc && $stateParams.cc) {
                    (<string>$stateParams.sc).split(",").forEach((sc) => {
                        (<string>$stateParams.cc).split(",").forEach((cc) => {
                            filterList.push(new Models.GroundWaterFilterSite(<Models.ICounty>{ code: cc.toUpperCase(), statecode: sc.toUpperCase() }, Models.FilterType.COUNTY));
                        });//next cc
                    });//next state               
                }//end if

                if ($stateParams.S) (<string>$stateParams.S).split(",").forEach((fl) => { filterList.push(new Models.GroundWaterFilterSite({ code: fl.toUpperCase() }, Models.FilterType.SITE)); });
                this.gwwServices.AddFilterTypes(filterList);
                $rootscope["isShown"] = false;
            }

            this.initialized = true; 
        }

        //Methods
        //-+-+-+-+-+-+-+-+-+-+-+-

        //Helper Methods
        //-+-+-+-+-+-+-+-+-+-+-+-
        private init(): void { 

            //init map           
            this.cursorStyle = 'pointer';  
            this.center = this.gwwServices.mapCenter;
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
                    enable: ['mousemove', 'click']
                }
            }
            this.mapPoint = new MapPoint();
            L.Icon.Default.imagePath = 'images';

            //ADD INITIAL MAP FILTER
            //this.gwwServices.AddFilterTypes([new Models.GroundWaterFilterSite('AWL', Models.FilterType.NETWORK)])
        }
        private scaleLookup(mapZoom: number) {
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

            this.leafletData.getMap("mainMap").then((map: any) => {
                this.leafletData.getLayers("mainMap").then((maplayers: any) => {

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
            this.leafletData.getMap("mainMap").then((map: any) => {
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

            this.leafletData.getMap("mainMap").then((map: any) => {
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

            this.leafletData.getMap("mainMap").then((map: any) => {
                this.leafletData.getLayers("mainMap").then((maplayers: any) => {

                    //create draw control
                    var drawnItems = maplayers.overlays.draw;
                    drawnItems.clearLayers();
                });
            });
        }
        private measurement() {

            //console.log('in measurement tool');

            document.getElementById('elevation-div').innerHTML = '';
            //user affordance
            this.explorationService.measurementData = 'Click the map to begin\nDouble click to end the Drawing';

            //report ga event
            this.angulartics.eventTrack('explorationTools', { category: 'Map', label: 'measurement' });

            this.leafletData.getMap("mainMap").then((map: any) => {
                //console.log('got map: ', map);
                this.leafletData.getLayers("mainMap").then((maplayers: any) => {
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

            this.paths = {};
            var AOI = e.selectedAreaOfInterest;

            this.paths['AOI'] = {
                type: "circleMarker",
                radius: 15,
                color: '#ff0000',
                fillOpacity: 0.6,
                stroke: false,
                latlngs: {
                    lat: AOI.properties['Lat'],
                    lng: AOI.properties['Lon'],
                }
            }

            this.leafletData.getMap("mainMap").then((map: any) => {

                map.fitBounds([ // zoom to location
                    [AOI.properties['LatMin'], AOI.properties['LonMin']],
                    [AOI.properties['LatMax'], AOI.properties['LonMax']]
                ])

                //force level 8
                setTimeout(() => {
                    if (map.getZoom() < 8) map.setZoom(8);
                }, 500);

                map.openPopup(  // open popup at location listing all properties
                    $.map(Object.keys(AOI.properties), function (property) {
                        if (["Label", "ElevFt", "Lat", "Lon", "Source"].indexOf(property) != 0 - 1) return "<b>" + property + ": </b>" + AOI.properties[property];
                    }).join("<br/>"),
                    [AOI.properties['Lat'], AOI.properties['Lon']]
                );
            });
        }
        private onGWSiteSelectionChanged(sender: any, e: Services.GWSiteSelectionEventArgs) {
            //checkforname, and remove, add additional ones
            this.removeGeoJson("gwwsite", true);
            this.addGeoJSON("gwwsite", e.featurelist[0]);
            //for (var i = 0; i < e.featurelist.length;i++){
            //    this.addGeoJSON("gwwsite_" + i, e.featurelist[i]);
            //}//next f
            //zoomto
            if (e.bbox != null) {            
                this.center.lat = (e.bbox[0] + e.bbox[2]) / 2
                this.center.lng = (e.bbox[1] + e.bbox[3]) / 2
                this.center.zoom = 12;
            }            
        }
        private removeGeoJson(layerName: string = "", isPartial: boolean = false) {
            var layeridList: Array<string>;

            layeridList = this.getLayerIdsByID(layerName, this.geojson, isPartial);

            layeridList.forEach((item) => {
                //console.log('removing map overlay layer: ', item);
                delete this.geojson[item];
                this.eventManager.RaiseEvent(WiM.Directives.onLayerRemoved, this, new WiM.Directives.LegendLayerRemovedEventArgs(item, "geojson"));
            });
        }
        private addGeoJSON(LayerName: string, feature: any) {
            if (LayerName.indexOf("gwwsite") > -1) {
                var geojsonMarkerOptions = {
                    radius: 8,
                    color: '#FFFA20',
                    weight: 3,
                    opacity: 1,
                    fillOpacity: 0,
                    visible: true
                    
                };
                this.geojson[LayerName] = {
                    data: feature,
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng, geojsonMarkerOptions);
                    },
                    onEachFeature: (feature, layer) => {
                        var strVar = "     <div>";
                        strVar += "          <h3>USGS Well Information <\/h3>";
                        strVar += "          <strong>Station: <\/strong><a href='{0}/{1}?{2}' target='_blank' >".format(configuration.baseurls["gwwURL"], configuration.redirects["Site"],'S='+feature.properties["SITE_NO"] + this.getNetworkLinkParams(feature.properties["NETWORK_CD"])) + feature.properties["SITE_NO"] + "</a>";
                        strVar += "          <br \/>";
                        strVar += "          <strong>Name: <\/strong>" + feature.properties["SITE_NAME"];
                        strVar += "          <br \/>";
                        strVar += "          <strong>Most Recent Measurement: <\/strong>" + feature.properties["LATEST_VALUE"];
                        strVar += "          <br \/>";
                        strVar += "          <strong>Measurement Date: <\/strong>" + feature.properties["LATEST_DATE"];
                        strVar += "        <\/div>";         
                        // http://groundwaterwatch.usgs.gov/AWLSites.asp?mt=g&S=422622073410901&ncd=awl
                        // http://groundwaterwatch.usgs.gov/AWLSites.asp?mt=g&S=431841074573201&ncd=awl
                        layer.bindPopup(strVar);
                        this.leafletData.getMap("mainMap").then((map: any) => { layer.openPopup(); });
                    }      
                }
            }
            else {
                this.geojson[LayerName] =
                    {
                        data: feature,
                        style: {
                            "fillOpacity": 0
                        }
                        //onEachFeature: (feature, layer) => {
                        //    layer.bindLabel(LayerName, { noHide: true })
                        //}
                    }
            }
        }
        private onLayerChanged(e: WiM.Directives.LegendLayerChangedEventArgs) {
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
        private mapBoundsChange(oldValue, newValue) {            
            if (oldValue !== newValue) {
                this.nominalZoomLevel = this.scaleLookup(this.center.zoom);
                this.eventManager.RaiseEvent(onBoundingBoxChanged, this, new BoundingBoxChangedEventArgs(this.bounds, this.center.zoom));
            }
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
        private updateMapFilters() {
            if (!this.initialized) return;

            //remove any selected sites
            this.removeGeoJson("gwwsite", true);

            this.leafletData.getMap("mainMap").then((map: any) => {
            this.leafletData.getLayers("mainMap").then((maplayers: any) => {
                //gww sites
                var frequest = this.gwwServices.getFilterRequest();
                if (frequest != '') { 
                    maplayers.overlays["gww"].wmsParams.CQL_FILTER = frequest;                    
                }
                else {
                    delete maplayers.overlays["gww"].wmsParams.CQL_FILTER;
                }
                maplayers.overlays["gww"].redraw();

                //states and counties
                var filters = this.gwwServices.SelectedGWFilters.group("Type");
                if (filters.hasOwnProperty(Models.FilterType.STATE.toString())) {
                        maplayers.overlays["states"].query().layer(7).where(filters[Models.FilterType.STATE.toString()].map((f: Models.GroundWaterFilterSite) => { return "STATE = '" + f.item.code + "'" }).join(" OR ")).returnGeometry(true).fields('STATE,ABBREV,NAME').run((error: any, results: any) => {
                        //console.log('gage query response', results);
                        if (!results.features || results.features.length == 0) { return; }                        
                        results.features.forEach((queryResult) => {
                                if (queryResult.geometry.type === 'Polygon' || queryResult.geometry.type == 'MultiPolygon') {
                                    this.removeGeoJson("STATE" + queryResult.properties["STATE"]);
                                this.addGeoJSON("STATE" + queryResult.properties["STATE"], queryResult.geometry);
                            }//end if                                                    
                        });//next feature
                            maplayers.overlays["states"].query().layer(7).where(filters[Models.FilterType.STATE.toString()].map((f: Models.GroundWaterFilterSite) => { return "STATE = '" + f.item.code + "'" }).join(" OR ")).bounds((error: any, results: any) => {
                                map.fitBounds(results);
                            });
                    })
                }//end if
                if (filters.hasOwnProperty(Models.FilterType.COUNTY.toString())) {
                        maplayers.overlays["counties"].query().layer(15).where(filters[Models.FilterType.COUNTY.toString()].map((f: Models.GroundWaterFilterSite) => { return "COUNTY = '" + (<Models.ICounty>f.item).code + "' AND STATE ='" + (<Models.ICounty>f.item).statecode + "'" }).join(" OR ")).returnGeometry(true).fields('COUNTY,STATE,NAME').run((error: any, results: any) => {
                        //console.log('gage query response', results);
                            if (!results.features || results.features.length == 0) { return; }
                        results.features.forEach((queryResult) => {
                            if (queryResult.geometry.type === 'Polygon') {
                                this.removeGeoJson("COUNTY" + queryResult.properties["COUNTY"])
                                this.addGeoJSON("COUNTY" + queryResult.properties["COUNTY"], queryResult.geometry);

                            }//end if                                                    
                        });//next feature
                        });
                        maplayers.overlays["counties"].query().layer(15).where(filters[Models.FilterType.COUNTY.toString()].map((f: Models.GroundWaterFilterSite) => { return "COUNTY = '" + (<Models.ICounty>f.item).code + "' AND STATE ='" + (<Models.ICounty>f.item).statecode + "'" }).join(" OR ")).bounds((error: any, results: any) => {
                            map.fitBounds(results);
                        });
                    }//end if
                    if (filters.hasOwnProperty(Models.FilterType.SITE.toString())) {
                        var result = filters[Models.FilterType.SITE.toString()].map((f: Models.GroundWaterFilterSite) => { return f.item.code });
                        this.gwwServices.queryGWsiteByNOs(result.join("','"));
                }//end if
                });//end get layers
            });//end get map
            

        }
        private sm(m: string, t: Models.NotificationType, title: string = "", showclosebtn: boolean = false, id: number = null, tmout: number = 5000) {
            this.toaster.pop(new Models.Notification(m, t, title, showclosebtn, tmout, id));
        }
        private clrm(id: number = null) {
            this.toaster.clear();
        }
        private getNetworkLinkParams(networkCode: string): string {
            if (networkCode.length == 3) return "&ncd=" + networkCode;
            else
                var tplookup = { "20": "1", "30": "2", "50": "3" };
                var freqlookup = { "List": "1", "Month": "2", "Daily": "3" };

                return "&ncd=LTN&a={0}&d={1}".format(freqlookup[networkCode.substr(2)], tplookup[networkCode.substr(0, 2)]);
           
        }
        private getLTNTimeperiod(val: string): number {
            try {
                switch (val) {
                    case "1": case "20":
                        return 20;
                    case "2": case "30":
                        return 30;
                    case "3": case "50":
                        return 50;
                    default:
                        return 20;
                }//end switch
            } catch (e) {
                return 20;
            }
        }
        private getLTNFrequency(val: string): string {
            try {
                switch (val) {
                    case "1":
                        return "List";
                    case "2":
                        return "Month";
                    case "3":
                        return "Daily";
                    default:
                        return "List";
                }//end switch
            } catch (e) {
                return "List";
            }
        }
    }//end class

    angular.module('GroundWaterWatch.Controllers')
        .controller('GroundWaterWatch.Controllers.MapController', MapController)
}//end module
 