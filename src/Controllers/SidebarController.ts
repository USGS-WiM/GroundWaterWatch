//------------------------------------------------------------------------------
//----- SidebarController ------------------------------------------------------
//------------------------------------------------------------------------------

//-------1---------2---------3---------4---------5---------6---------7---------8
//       01234567890123456789012345678901234567890123456789012345678901234567890
//-------+---------+---------+---------+---------+---------+---------+---------+

// copyright:   2014 WiM - USGS

//    authors:  Jeremy K. Newson USGS Wisconsin Internet Mapping


//   purpose:  

//discussion:   Controllers are typically built to reflect a View. 
//              and should only contailn business logic needed for a single view. For example, if a View 
//              contains a ListBox of objects, a Selected object, and a Save button, the Controller 
//              will have an ObservableCollection ObectList, 
//              Model SelectedObject, and SaveCommand.

//Comments
//04.14.2015 jkn - Created

//Imports"
module GroundWaterWatch.Controllers {

    declare var search_api;

    'use strinct';
    interface ISidebarControllerScope extends ng.IScope {
        vm: SidebarController;
    }
    interface ILeafletData {
        getMap(): ng.IPromise<any>;
    }
    interface ISidebarController {
        sideBarCollapsed: boolean;
        selectedProcedure: ProcedureType;
        setProcedureType(pType: ProcedureType): void;
        toggleSideBar(): void;
    }
    
    class SidebarController implements ISidebarController {
        private searchService: WiM.Services.ISearchAPIService;
        private groundwaterwatchService: Services.IGroundWaterWatchService;
        private angulartics: any;
        private toaster: any;
        private modalService: Services.IModalService;
        private eventManager: WiM.Event.IEventManager;

        //Properties
        //-+-+-+-+-+-+-+-+-+-+-+-
         public sideBarCollapsed: boolean;
        public selectedProcedure: ProcedureType;
        public SelectedFilters: Array<Models.IGroundWaterFilterSite>;    

        //Constructor
        //-+-+-+-+-+-+-+-+-+-+-+-
        static $inject = ['$scope', 'toaster', '$stateParams', '$analytics', 'WiM.Services.SearchAPIService', 'GroundWaterWatch.Services.ModalService', 'GroundWaterWatch.Services.GroundWaterWatchService','WiM.Event.EventManager'];
        constructor($scope: ISidebarControllerScope, toaster, $analytics,$stateParams, service: WiM.Services.ISearchAPIService, modalService:Services.IModalService, gwwService: Services.IGroundWaterWatchService, eventmanager:WiM.Event.IEventManager) {
            $scope.vm = this;
           
            this.toaster = toaster;
            this.angulartics = $analytics;
            this.searchService = service;
            this.groundwaterwatchService = gwwService;
            this.modalService = modalService;
            this.eventManager = eventmanager;


            this.init();
        }

        public getLocations(term: string):ng.IPromise<Array<WiM.Services.ISearchAPIOutput>> {
            return this.searchService.getLocations(term);
        }
        public setProcedureType(pType: ProcedureType) {
            if (this.selectedProcedure == pType || !this.canUpdateProcedure(pType)) {
               return;
            }
            this.selectedProcedure = pType;
        }
        public toggleSideBar(): void {
            if (this.sideBarCollapsed) this.sideBarCollapsed = false;
            else this.sideBarCollapsed = true;          
        }
        public zoomRegion(inRegion: string) {
            var region = angular.fromJson(inRegion);            
        }
        public startSearch(e) {
            e.stopPropagation(); e.preventDefault();
            $("#sapi-searchTextBox").trigger($.Event("keyup", { "keyCode": 13 }));
        }
        public removeFilter(index:number, filter: Models.IGroundWaterFilterSite) {
            this.SelectedFilters.splice(index, 1);
            if (filter.Type == Models.FilterType.COUNTY || filter.Type == Models.FilterType.STATE) { 
                var fname = filter.Type == Models.FilterType.COUNTY ? "COUNTY" : "STATE";
                this.eventManager.RaiseEvent(WiM.Directives.onLayerChanged, this, new WiM.Directives.LegendLayerChangedEventArgs(fname + filter.item.code, "visible", false));
            }
        }
        public ClearFilters() {
            this.SelectedFilters.forEach((f) => {
                var fname = f.Type == Models.FilterType.COUNTY ? "COUNTY" : "STATE";
                this.eventManager.RaiseEvent(WiM.Directives.onLayerChanged, this, new WiM.Directives.LegendLayerChangedEventArgs(fname + f.item.code, "visible", false));
            });
            this.SelectedFilters.splice(0, this.SelectedFilters.length);
        }
        public AddFilter() {
            this.modalService.openModal(Services.ModalType.e_filter)
        }
        //special function for searching arrays but ignoring angular hashkey
        public checkArrayForObj(arr, obj) {
            for (var i = 0; i < arr.length; i++) {
                if (angular.equals(arr[i], obj)) {
                    return i;
                }
            };
            return -1;
        }

        //Helper Methods
        //-+-+-+-+-+-+-+-+-+-+-+-
        private init(): void { 
            //init event handler

            this.SelectedFilters = this.groundwaterwatchService.SelectedGWFilters;
            this.sideBarCollapsed = false;
            this.selectedProcedure = ProcedureType.Search;

        }
        private canUpdateProcedure(pType: ProcedureType): boolean {
            //console.log('in canUpdateProcedure');
            //Project flow:
            var msg: string;
            try {               
                switch (pType) {
                    case ProcedureType.Search:
                        return true;
                    case ProcedureType.NetworkType:
                        return true;
                    case ProcedureType.Filter:
                        return true;
                    default:
                        return false;
                }//end switch          
            }
            catch (e) {
                //this.sm(new MSG.NotificationArgs(e.message, MSG.NotificationType.INFORMATION, 1.5));
                return false;
            }
        }
        private sm(msg: string) {
            try {
                //toastr.options = {
                //    positionClass: "toast-bottom-right"
                //};

                //this.NotificationList.unshift(new LogEntry(msg.msg, msg.type));

                //setTimeout(() => {
                //    toastr[msg.type](msg.msg);
                //    if (msg.ShowWaitCursor != undefined)
                //        this.IsLoading(msg.ShowWaitCursor)
                //}, 0)
            }
            catch (e) {
            }
        }

  
    }//end class

    enum ProcedureType {
        Search = 1,
        NetworkType = 2,
        Filter = 3
    }

    angular.module('GroundWaterWatch.Controllers')
        .controller('GroundWaterWatch.Controllers.SidebarController', SidebarController)
    
}//end module
 