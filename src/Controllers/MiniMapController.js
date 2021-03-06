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
            function MiniMapController($scope, $rootscope, toaster, $analytics, $location, $stateParams, leafletBoundsHelper, leafletData, eventManager, gwwservice, modalService, $timeout) {
                this.$scope = $scope;
                $scope.vm = this;
                $rootscope["isShown"] = true;
                this.modalService = modalService;
                this.leafletData = leafletData;
                this.gwwService = gwwservice;
                this.network = null;
                this.selectedNetwork = null;
                this.showOptions = false;
                this.init();
            }
            Object.defineProperty(MiniMapController.prototype, "isSelected", {
                get: function () {
                    if (this.selectedNetwork.code === this.gwwService.SelectedPrimaryNetwork.code)
                        return true;
                    else
                        return false;
                },
                enumerable: true,
                configurable: true
            });
            //Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            MiniMapController.prototype.initialize = function (network) {
                this.network = network;
                if (this.network.code == "LTN") {
                    this.showOptions = true;
                    this.NetworkDescriptor = { frequency: 'List', timeperiod: 20 };
                    this.selectedNetwork = this.network.subNetworks[0];
                }
                else {
                    this.selectedNetwork = network;
                }
                this.loadGWWMapLayer();
            };
            MiniMapController.prototype.openAboutModal = function (tab) {
                this.modalService.openModal(GroundWaterWatch.Services.ModalType.e_about, { "tabName": tab });
            };
            MiniMapController.prototype.setMainNetwork = function () {
                if (!this.selectedNetwork)
                    return;
                if (this.selectedNetwork.code == 'NCH') {
                    window.open(configuration.baseurls.NationalCompositeHydrographs);
                }
                else {
                    this.gwwService.SelectedPrimaryNetwork = this.selectedNetwork;
                }
            };
            MiniMapController.prototype.updateNetworkDescriptor = function (propertyName, value) {
                var _this = this;
                if (this.NetworkDescriptor.hasOwnProperty(propertyName))
                    this.NetworkDescriptor[propertyName] = value;
                if (this.network.code === 'LTN') {
                    var cd = this.NetworkDescriptor.timeperiod.toString() + this.NetworkDescriptor.frequency;
                    this.network.subNetworks.forEach(function (n) {
                        if (n.code === cd) {
                            _this.selectedNetwork = n;
                            _this.loadGWWMapLayer();
                            _this.setMainNetwork();
                            return;
                        } //end if
                    }); //next n
                } //end if
            };
            //Helper Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            MiniMapController.prototype.init = function () {
                //this.center = this.gwwService.mapCenter;
                this.center = {
                    lat: 38,
                    lng: -96,
                    zoom: 1
                };
                this.defaults = {
                    scrollWheelZoom: false,
                    touchZoom: false,
                    doubleClickZoom: false,
                    boxZoom: false,
                    keyboard: false,
                    zoomControl: false,
                    attributionControl: false,
                    dragging: false
                };
                this.layers = {
                    //baselayers: {
                    //    aquifers: {
                    //        name: 'Aquifers',
                    //        url: 'https://nwismapper.s3.amazonaws.com/pr_aq/{z}/{y}/{x}.png',
                    //        type: 'xyz'
                    //    }
                    //},
                    baselayers: configuration.basemaps,
                    overlays: { gww: configuration.overlayedLayers.gww }
                };
                this.loadGWWMapLayer();
            };
            MiniMapController.prototype.loadGWWMapLayer = function () {
                var _this = this;
                if (!this.selectedNetwork)
                    return;
                this.leafletData.getLayers(this.network.code).then(function (maplayers) {
                    maplayers.overlays["gww"].wmsParams.CQL_FILTER = "NETWORK_CD='" + _this.selectedNetwork.code + "'";
                    maplayers.overlays["gww"].redraw();
                });
            };
            return MiniMapController;
        }()); //end class
        //Constructro
        //-+-+-+-+-+-+-+-+-+-+-+-
        MiniMapController.$inject = ['$scope', '$rootScope', 'toaster', '$analytics', '$location', '$stateParams', 'leafletBoundsHelpers', 'leafletData', 'WiM.Event.EventManager', 'GroundWaterWatch.Services.GroundWaterWatchService', 'GroundWaterWatch.Services.ModalService', '$timeout'];
        angular.module('GroundWaterWatch.Controllers')
            .controller('GroundWaterWatch.Controllers.MiniMapController', MiniMapController);
    })(Controllers = GroundWaterWatch.Controllers || (GroundWaterWatch.Controllers = {}));
})(GroundWaterWatch || (GroundWaterWatch = {})); //end module
//# sourceMappingURL=MiniMapController.js.map