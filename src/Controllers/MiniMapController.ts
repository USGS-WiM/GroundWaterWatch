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
        public networkTypes: any;
        public center: any;
        public defaults: any;
        public layers: any;
        private gwwService: Services.IGroundWaterWatchService;
        public selectedNetwork: string;

        //Constructro
        //-+-+-+-+-+-+-+-+-+-+-+-
        static $inject = ['$scope', '$rootScope', 'toaster', '$analytics', '$location', '$stateParams', 'leafletBoundsHelpers', 'leafletData', 'WiM.Event.EventManager', 'GroundWaterWatch.Services.GroundWaterWatchService','GroundWaterWatch.Services.ModalService','$timeout'];
        constructor(public $scope: IMiniMapControllerScope,$rootscope:ng.IRootScopeService ,toaster, $analytics, $location: ng.ILocationService, $stateParams, leafletBoundsHelper: any, leafletData: ILeafletData, eventManager: WiM.Event.IEventManager, gwwservice: Services.IGroundWaterWatchService, modal: Services.IModalService,$timeout: ng.ITimeoutService ) {
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
        private init(): void { 

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
            }
            this.layers = {
                baselayers: configuration.basemaps,
                overlays: configuration.overlayedLayers
            }
        }

        public setMapLayer(networkCode: any, mapDiv: any) {
            if (networkCode != mapDiv) this.selectedNetwork = networkCode;
            this.leafletData.getLayers(mapDiv).then((maplayers: any) => {
                maplayers.overlays["gww"].wmsParams.CQL_FILTER = "NETWORK_CD='" + networkCode + "'";
                maplayers.overlays["gww"].redraw();
            });
        }

    }//end class

    angular.module('GroundWaterWatch.Controllers')
        .controller('GroundWaterWatch.Controllers.MiniMapController', MiniMapController)
}//end module
 