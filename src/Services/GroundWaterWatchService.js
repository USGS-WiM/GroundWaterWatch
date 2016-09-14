//------------------------------------------------------------------------------
//----- GroundWaterWatchService -----------------------------------------------------
//------------------------------------------------------------------------------
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//-------1---------2---------3---------4---------5---------6---------7---------8
//       01234567890123456789012345678901234567890123456789012345678901234567890
//-------+---------+---------+---------+---------+---------+---------+---------+
// copyright:   2016 WiM - USGS
//    authors:  Jeremy K. Newson USGS Wisconsin Internet Mapping
//             
// 
//   purpose:  The service agent is responsible for initiating service calls, 
//             capturing the data that's returned and forwarding the data back to 
//             the Controller.
//          
//discussion:
//
//https://docs.angularjs.org/api/ng/service/$http
//Comments
//05.16.2016 jkn - Created
//Import
var GroundWaterWatch;
(function (GroundWaterWatch) {
    var Services;
    (function (Services) {
        'use strict';
        Services.onSelectedGWSiteChanged = "onSelectedGWSiteChanged";
        Services.onGWSiteSelectionChanged = "onGWSiteSelectionChanged";
        var GWSiteSelectionEventArgs = (function (_super) {
            __extends(GWSiteSelectionEventArgs, _super);
            function GWSiteSelectionEventArgs(featurelist) {
                if (featurelist === void 0) { featurelist = []; }
                _super.call(this);
                this.featurelist = featurelist;
            }
            return GWSiteSelectionEventArgs;
        }(WiM.Event.EventArgs));
        Services.GWSiteSelectionEventArgs = GWSiteSelectionEventArgs;
        var Center = (function () {
            //Constructor
            //-+-+-+-+-+-+-+-+-+-+-+-
            function Center(lt, lg, zm) {
                this.lat = lt;
                this.lng = lg;
                this.zoom = zm;
            }
            return Center;
        }());
        var GroundWaterWatchService = (function (_super) {
            __extends(GroundWaterWatchService, _super);
            //Constructor
            //-+-+-+-+-+-+-+-+-+-+-+-
            function GroundWaterWatchService($http, evntmngr) {
                _super.call(this, $http, configuration.baseurls['GroundWaterWatch']);
                this.SelectedGWFilters = [];
                this.mapCenter = null;
                this._eventManager = evntmngr;
                this.queriedGWsite = false;
                this.init();
            }
            Object.defineProperty(GroundWaterWatchService.prototype, "GWSiteList", {
                get: function () {
                    return this._GWSiteList;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GroundWaterWatchService.prototype, "SelectedGWSite", {
                get: function () {
                    return this._selectedGWSite;
                },
                set: function (val) {
                    if (val != this._selectedGWSite) {
                        this._selectedGWSite = val;
                        this._eventManager.RaiseEvent(Services.onSelectedGWSiteChanged, this, WiM.Event.EventArgs.Empty);
                    } //endif
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GroundWaterWatchService.prototype, "StateList", {
                get: function () {
                    return this._states;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GroundWaterWatchService.prototype, "AquiferList", {
                get: function () {
                    return this._aquifers;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GroundWaterWatchService.prototype, "NetworkList", {
                get: function () {
                    return this._networks;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GroundWaterWatchService.prototype, "SelectedPrimaryNetwork", {
                get: function () {
                    return this._selectedPrimaryNetwork;
                },
                set: function (val) {
                    if (this._selectedPrimaryNetwork === val)
                        return;
                    this._selectedPrimaryNetwork = val;
                    //clear filters
                    this.SelectedGWFilters.length = 0;
                    this.SelectedGWFilters.push(new GroundWaterWatch.Models.GroundWaterFilterSite(val, GroundWaterWatch.Models.FilterType.NETWORK));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GroundWaterWatchService.prototype, "PrimaryNetworkList", {
                get: function () {
                    return this._primaryNetworks;
                },
                enumerable: true,
                configurable: true
            });
            //Methods
            //-+-+-+-+-+-+-+-+-+-+-+- 
            GroundWaterWatchService.prototype.AddFilterTypes = function (FiltersToAdd) {
                var _this = this;
                FiltersToAdd.forEach(function (x) { return _this.SelectedGWFilters.push(x); });
                this.updateGWWSiteList();
            };
            GroundWaterWatchService.prototype.getFilterRequest = function () {
                //NETWORK_CD         = ncd
                //STATE_CD           = sc
                //COUNTY_CD          = cc
                //SITE_NO            = S
                if (this.SelectedGWFilters.length < 1)
                    return "";
                var filter = [];
                var groupedFeature = this.SelectedGWFilters.group("Type");
                var county = groupedFeature.hasOwnProperty(GroundWaterWatch.Models.FilterType.COUNTY.toString()) ?
                    groupedFeature[GroundWaterWatch.Models.FilterType.COUNTY.toString()].map(function (item) { return item.item.code; }) : null;
                if (county !== null)
                    filter.push("COUNTY_CD in ('" + county.join("','") + "')");
                var StateCounty = groupedFeature.hasOwnProperty(GroundWaterWatch.Models.FilterType.COUNTY.toString()) ?
                    groupedFeature[GroundWaterWatch.Models.FilterType.COUNTY.toString()].map(function (item) { return item.item.statecode; }) : null;
                if (StateCounty !== null)
                    filter.push("STATE_CD in ('" + StateCounty.join("','") + "')");
                var states = groupedFeature.hasOwnProperty(GroundWaterWatch.Models.FilterType.STATE.toString()) ?
                    groupedFeature[GroundWaterWatch.Models.FilterType.STATE.toString()].map(function (item) { return item.item.code; }) : null;
                if (states !== null)
                    filter.push("STATE_CD in ('" + states.join("','") + "')");
                var network = groupedFeature.hasOwnProperty(GroundWaterWatch.Models.FilterType.NETWORK.toString()) ?
                    groupedFeature[GroundWaterWatch.Models.FilterType.NETWORK.toString()].map(function (item) { return item.item.code; }) : null;
                if (network !== null)
                    filter.push("NETWORK_CD in ('" + network.join("','") + "')");
                var site = groupedFeature.hasOwnProperty(GroundWaterWatch.Models.FilterType.SITE.toString()) ?
                    groupedFeature[GroundWaterWatch.Models.FilterType.SITE.toString()].map(function (item) { return item.item.code; }) : null;
                if (site !== null)
                    filter.push("SITE_NO in ('" + site.join("','") + "')");
                return filter.join(" AND ");
            };
            GroundWaterWatchService.prototype.queryGWsite = function (point, mapZoom) {
                var _this = this;
                this.queriedGWsite = false;
                var addsize = 0.0005;
                if (mapZoom <= 3)
                    addsize = 0.5;
                if (mapZoom > 3 && mapZoom <= 6)
                    addsize = 0.1;
                if (mapZoom > 6 && mapZoom <= 10)
                    addsize = 0.01;
                if (mapZoom > 10 && mapZoom <= 12)
                    addsize = 0.005;
                console.log('click buffer: ', addsize);
                var bbox = (point.lat + addsize) + "," + (point.lng - addsize) + "," + (point.lat - addsize) + "," + (point.lng + addsize);
                console.log('buffered bbox: ', bbox);
                var url = configuration.baseurls['GroundWaterWatch'] + configuration.queryparams['WFSquery'];
                url += "&CQL_FILTER=BBOX(GEOM,{0})".format(bbox);
                if (this.SelectedPrimaryNetwork != null)
                    url += "AND NETWORK_CD in ('" + this.SelectedPrimaryNetwork.code + "')";
                var request = new WiM.Services.Helpers.RequestInfo(url, true, WiM.Services.Helpers.methodType.GET, "", null, { 'Accept-Encoding': 'gzip' });
                this.Execute(request).then(function (response) {
                    _this.queriedGWsite = true;
                    if (response.data.features && response.data.features.length > 0) {
                        console.log('gww sites found');
                        _this._eventManager.RaiseEvent(Services.onGWSiteSelectionChanged, _this, new GWSiteSelectionEventArgs(response.data.features));
                    } //endif
                    else {
                        console.log('No gww sites found');
                        _this.SelectedGWSite = null;
                    }
                }, function (error) {
                    console.log('No gww sites found');
                }).finally(function () {
                });
            };
            GroundWaterWatchService.prototype.loadCounties = function (state) {
                var _this = this;
                var url = configuration.overlayedLayers['counties'].url + "/15/query?returnGeometry=false&where=STATE='{0}'&outSr=4326&outFields=COUNTY,STATE,ABBREV,NAME&f=json".format(state.code);
                var request = new WiM.Services.Helpers.RequestInfo(url, true);
                this.Execute(request).then(function (response) {
                    _this.queriedGWsite = true;
                    if (response.data.features.length > 0) {
                        state.Counties = response.data.features.map(function (c) { return { name: c.attributes.NAME + ", " + c.attributes.ABBREV, code: c.attributes.COUNTY, statecode: c.attributes.STATE }; });
                    } //endif
                    else {
                        console.log('No gww sites found');
                        _this.SelectedGWSite = null;
                    }
                }, function (error) {
                    console.log('No gww sites found');
                }).finally(function () {
                });
            };
            //HelperMethods
            //-+-+-+-+-+-+-+-+-+-+-+-
            GroundWaterWatchService.prototype.init = function () {
                this._GWSiteList = [];
                this._eventManager.AddEvent(Services.onSelectedGWSiteChanged);
                this._eventManager.AddEvent(Services.onSelectedGWSiteChanged);
                this.mapCenter = new Center(39, -100, 3);
                this.loadStates();
                this.loadAquifers();
                this.loadLocalNetworks();
                this.loadPrimaryNetworks();
            };
            //https:// github.com / USGS - WiM / streamest / blob / 180a4c7db6386fdaa0ab846395517d3ac3b36967/ src / Services / StudyAreaService.ts#L527
            //ABBREV = 'CO'
            //STATE = '08'
            //outfeilds COUNTY,STATE,ABBREV,NAME
            GroundWaterWatchService.prototype.updateGWWSiteList = function () {
                var _this = this;
                var url = configuration.baseurls['GroundWaterWatch'] + configuration.queryparams['WFSquery'];
                if (this.SelectedPrimaryNetwork != null)
                    url += "&CQL_FILTER=NETWORK_CD in ('" + this.SelectedPrimaryNetwork.code + "')";
                var request = new WiM.Services.Helpers.RequestInfo(url, true);
                this.Execute(request).then(function (response) {
                    _this.queriedGWsite = true;
                    if (response.data.features && response.data.features.length > 0) {
                        response.data.features.forEach(function (item) {
                            //console.log(item);
                            //this._eventManager.RaiseEvent(onSelectedGWSiteChanged, this, WiM.Event.EventArgs.Empty);
                        }); //next
                    } //endif
                    else {
                        console.log('No gww sites found');
                        _this.SelectedGWSite = null;
                    }
                }, function (error) {
                    console.log('No gww sites found');
                }).finally(function () {
                });
            };
            GroundWaterWatchService.prototype.loadStates = function () {
                var _this = this;
                var request = new WiM.Services.Helpers.RequestInfo("sc.js", true);
                this.Execute(request).then(function (response) {
                    _this._states = response.data;
                }, function (error) {
                    console.log('No gww sites found');
                }).finally(function () {
                });
            };
            GroundWaterWatchService.prototype.loadAquifers = function () {
                var _this = this;
                console.log("Loading Aquifers");
                var request = new WiM.Services.Helpers.RequestInfo("acd.js", true);
                this.Execute(request).then(function (response) {
                    _this._aquifers = response.data;
                }, function (error) {
                    console.log('No gww sites found');
                }).finally(function () {
                });
            };
            GroundWaterWatchService.prototype.loadLocalNetworks = function () {
                var _this = this;
                console.log("Loading networks");
                var request = new WiM.Services.Helpers.RequestInfo("lcd.js", true);
                this.Execute(request).then(function (response) {
                    _this._networks = response.data;
                }, function (error) {
                    console.log('No gww sites found');
                }).finally(function () {
                });
            };
            GroundWaterWatchService.prototype.loadPrimaryNetworks = function () {
                var _this = this;
                console.log("Loading networks");
                var request = new WiM.Services.Helpers.RequestInfo("ncd.js", true);
                this.Execute(request).then(function (response) {
                    _this._primaryNetworks = response.data;
                    _this.SelectedPrimaryNetwork = _this._primaryNetworks[0];
                }, function (error) {
                    console.log('No gww sites found');
                }).finally(function () {
                });
            };
            return GroundWaterWatchService;
        }(WiM.Services.HTTPServiceBase)); //end class
        factory.$inject = ['$http', 'WiM.Event.EventManager'];
        function factory($http, evntmngr) {
            return new GroundWaterWatchService($http, evntmngr);
        }
        angular.module('GroundWaterWatch.Services')
            .factory('GroundWaterWatch.Services.GroundWaterWatchService', factory);
    })(Services = GroundWaterWatch.Services || (GroundWaterWatch.Services = {}));
})(GroundWaterWatch || (GroundWaterWatch = {})); //end module  
//# sourceMappingURL=GroundWaterWatchService.js.map