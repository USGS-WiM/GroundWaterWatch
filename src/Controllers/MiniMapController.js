//------------------------------------------------------------------------------
//----- MiniMapController ----------------------------------------------------------
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
var GroundWaterWatch;
(function (GroundWaterWatch) {
    var Controllers;
    (function (Controllers) {
        'use strict';
        var MiniMapController = (function () {
            function MiniMapController($scope, $rootscope, toaster, $analytics, $location, $stateParams, leafletBoundsHelper, leafletData, eventManager, gwwservice, modal, $timeout) {
                this.$scope = $scope;
                $scope.vm = this;
                $rootscope["isShown"] = true;
                this.leafletData = leafletData;
                this.gwwService = gwwservice;
                this.selectedNetwork = 'AWL';
                this.init();
            }
            //Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            //Helper Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            MiniMapController.prototype.init = function () {
                this.networkTypes = configuration.networkTypes;
                this.center = this.gwwService.mapCenter;
                this.defaults = {
                    scrollWheelZoom: false,
                    touchZoom: false,
                    doubleClickZoom: false,
                    boxZoom: false,
                    keyboard: false,
                    zoomControl: false,
                    attributionControl: false
                };
                this.layers = {
                    baselayers: configuration.basemaps,
                    overlays: { gww: configuration.overlayedLayers.gww }
                };
            };
            MiniMapController.prototype.setMapLayer = function (networkCode, mapDiv) {
                if (networkCode != mapDiv)
                    this.selectedNetwork = networkCode;
                this.leafletData.getLayers(mapDiv).then(function (maplayers) {
                    maplayers.overlays["gww"].wmsParams.CQL_FILTER = "NETWORK_CD='" + networkCode + "'";
                    maplayers.overlays["gww"].redraw();
                });
            };
            //Constructro
            //-+-+-+-+-+-+-+-+-+-+-+-
            MiniMapController.$inject = ['$scope', '$rootScope', 'toaster', '$analytics', '$location', '$stateParams', 'leafletBoundsHelpers', 'leafletData', 'WiM.Event.EventManager', 'GroundWaterWatch.Services.GroundWaterWatchService', 'GroundWaterWatch.Services.ModalService', '$timeout'];
            return MiniMapController;
        })(); //end class
        angular.module('GroundWaterWatch.Controllers')
            .controller('GroundWaterWatch.Controllers.MiniMapController', MiniMapController);
    })(Controllers = GroundWaterWatch.Controllers || (GroundWaterWatch.Controllers = {}));
})(GroundWaterWatch || (GroundWaterWatch = {})); //end module
//# sourceMappingURL=MiniMapController.js.map