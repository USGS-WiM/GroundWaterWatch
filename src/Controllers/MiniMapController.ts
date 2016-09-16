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
module GroundWaterWatch.Controllers {

    'use strict';
    interface ILeafletData {
        getMap(mapID:any): ng.IPromise<any>;
        getLayers(mapID:any): ng.IPromise<any>;
    }

    interface IMiniMapControllerScope extends ng.IScope {
        vm: MiniMapController;
    }

    class MiniMapController {
        //Events
        //-+-+-+-+-+-+-+-+-+-+-+-
        //Properties
        //-+-+-+-+-+-+-+-+-+-+-+-

        private leafletData: ILeafletData;
        public center: any;
        public defaults: any;
        public layers: any;
        public NetworkDescriptor: { frequency: string, timeperiod: number };
        private gwwService: Services.IGroundWaterWatchService;
        private selectedNetwork: Models.INetwork;
        private modalService: Services.IModalService;
        public get isSelected(): boolean{
            if (this.selectedNetwork.code === this.gwwService.SelectedPrimaryNetwork.code) return true;
            else return false;
        }

        //Constructro
        //-+-+-+-+-+-+-+-+-+-+-+-
        static $inject = ['$scope', '$rootScope', 'toaster', '$analytics', '$location', '$stateParams', 'leafletBoundsHelpers', 'leafletData', 'WiM.Event.EventManager', 'GroundWaterWatch.Services.GroundWaterWatchService','GroundWaterWatch.Services.ModalService','$timeout'];
        constructor(public $scope: IMiniMapControllerScope, $rootscope: ng.IRootScopeService, toaster, $analytics, $location: ng.ILocationService, $stateParams, leafletBoundsHelper: any, leafletData: ILeafletData, eventManager: WiM.Event.IEventManager, gwwservice: Services.IGroundWaterWatchService, modalService: Services.IModalService,$timeout: ng.ITimeoutService ) {
            $scope.vm = this;
            $rootscope["isShown"] = true;
            this.modalService = modalService;
            this.leafletData = leafletData;
            this.gwwService = gwwservice;
            this.selectedNetwork = null;

            this.init();

        }

        //Methods
        //-+-+-+-+-+-+-+-+-+-+-+-
        public initialize(network: Models.INetwork) {
            this.selectedNetwork = network;
            this.loadGWWMapLayer()
            if (this.selectedNetwork.code == "LTN")
                this.NetworkDescriptor = { frequency: 'Annual', timeperiod: 20 };
        }

        public openAboutModal(tab: any) {
            this.modalService.openModal(Services.ModalType.e_about, { "tabName": tab });
        }
        //Helper Methods
        //-+-+-+-+-+-+-+-+-+-+-+-
        private init(): void {

            this.center = this.gwwService.mapCenter;
            this.defaults = {
                scrollWheelZoom: false,
                touchZoom: false,
                doubleClickZoom: false,
                boxZoom: false,
                keyboard: false,
                zoomControl: false,
                attributionControl: false
            }
            this.layers = {
                baselayers: configuration.basemaps,
                overlays: { gww: configuration.overlayedLayers.gww }
            }
            this.loadGWWMapLayer();
        }
        public setMainNetwork() {
            if (!this.selectedNetwork) return;
            this.gwwService.SelectedPrimaryNetwork = this.selectedNetwork;
        }
        private loadGWWMapLayer() {
            if (!this.selectedNetwork) return;
            this.leafletData.getLayers(this.selectedNetwork.code).then((maplayers: any) => {
                maplayers.overlays["gww"].wmsParams.CQL_FILTER = "NETWORK_CD='" + this.selectedNetwork.code + "'";
                maplayers.overlays["gww"].redraw();
            });
        }

    }//end class

    angular.module('GroundWaterWatch.Controllers')
        .controller('GroundWaterWatch.Controllers.MiniMapController', MiniMapController)
}//end module
 