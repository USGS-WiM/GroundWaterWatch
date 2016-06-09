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
        var GroundWaterWatchService = (function (_super) {
            __extends(GroundWaterWatchService, _super);
            //Constructor
            //-+-+-+-+-+-+-+-+-+-+-+-
            function GroundWaterWatchService($http, evntmngr) {
                _super.call(this, $http, configuration.baseurls['GroundWaterWatch']);
                this.SelectedGWFilters = [];
                this._eventManager = evntmngr;
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
            //Methods
            //-+-+-+-+-+-+-+-+-+-+-+- 
            GroundWaterWatchService.prototype.AddFilterTypes = function (FiltersToAdd) {
                var _this = this;
                FiltersToAdd.forEach(function (x) { return _this.SelectedGWFilters.push(x); });
            };
            //HelperMethods
            //-+-+-+-+-+-+-+-+-+-+-+-
            GroundWaterWatchService.prototype.init = function () {
                this._eventManager.AddEvent(Services.onSelectedGWSiteChanged);
                this.loadGWSites();
                this.SelectedGWFilters.push(new GroundWaterWatch.Models.GroundWaterFilterSite("State1 Test Filter", GroundWaterWatch.Models.FilterType.STATE));
                this.SelectedGWFilters.push(new GroundWaterWatch.Models.GroundWaterFilterSite("State2 Test Filter", GroundWaterWatch.Models.FilterType.STATE));
            };
            GroundWaterWatchService.prototype.loadGWSites = function () {
                var _this = this;
                var url = "http://cida-test.er.usgs.gov/ngwmn-geoserver/ngwmn/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=ngwmn%3ALatest_WL_Percentile&STYLES&LAYERS=ngwmn%3ALatest_WL_Percentile&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=50&Y=50&SRS=EPSG%3A4269&WIDTH=101&HEIGHT=101&BBOX=-114.0380859375%2C28.3447265625%2C-105.1611328125%2C37.2216796875";
                var request = new WiM.Services.Helpers.RequestInfo(url, true);
                this._GWSiteList = [];
                this.Execute(request).then(function (response) {
                    if (response.data.features) {
                        response.data.features.forEach(function (item) {
                            _this._GWSiteList.push(GroundWaterWatch.Models.GroundWaterSite.FromJson(item));
                        }); //next
                    } //endif
                }, function (error) {
                    console.log('No gww sites found');
                }).finally(function () {
                });
            };
            return GroundWaterWatchService;
        })(WiM.Services.HTTPServiceBase); //end class
        factory.$inject = ['$http', 'WiM.Event.EventManager'];
        function factory($http, evntmngr) {
            return new GroundWaterWatchService($http, evntmngr);
        }
        angular.module('GroundWaterWatch.Services')
            .factory('GroundWaterWatch.Services.GroundWaterWatchService', factory);
    })(Services = GroundWaterWatch.Services || (GroundWaterWatch.Services = {}));
})(GroundWaterWatch || (GroundWaterWatch = {})); //end module  
//# sourceMappingURL=GroundWaterWatchService.js.map