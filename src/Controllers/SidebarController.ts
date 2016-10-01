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
        public OpenedNetwork: NetworkType; 

        public get States(): Array<Models.IState> {
            return this.groundwaterwatchService.StateList;
        }
        public get Aquifers(): Array<Models.IAquifer> {
            return this.groundwaterwatchService.AquiferList;
        }
        public get LocalNetworks(): Array<Models.INetwork> {
            return this.groundwaterwatchService.NetworkList;
        }
        public get PrimaryNetworks(): Array<Models.INetwork> {
            return this.groundwaterwatchService.PrimaryNetworkList;
        }


        //Constructor
        //-+-+-+-+-+-+-+-+-+-+-+-
        static $inject = ['$scope', 'toaster', '$stateParams', '$analytics', 'WiM.Services.SearchAPIService', 'GroundWaterWatch.Services.ModalService', 'GroundWaterWatch.Services.GroundWaterWatchService','WiM.Event.EventManager','$window'];
        constructor($scope: ISidebarControllerScope, toaster, $analytics,$stateParams, service: WiM.Services.ISearchAPIService, modalService:Services.IModalService, gwwService: Services.IGroundWaterWatchService, eventmanager:WiM.Event.IEventManager, private $window:ng.IWindowService) {
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
            if (this.selectedProcedure == pType) { this.selectedProcedure = 0; return;}
            if (!this.canUpdateProcedure(pType)) {
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

        public OpenNetworkPage(networkType: NetworkType, SelectedNetworkType: Models.IFilterSite) {
            this.OpenedNetwork = -1;
            var url = 'http://groundwaterwatch.usgs.gov';
            var pResource:string = this.groundwaterwatchService.SelectedPrimaryNetwork.code;
            switch (networkType) {
                case NetworkType.STATE: 
                    var params: string = "?";
                    if (pResource == "AWL")  
                        params += "sc={0}&sa={1}".format(SelectedNetworkType.code, SelectedNetworkType.abbr);
                    else if (pResource.length > 3) {                        
                        params += "sc={0}&a={1}&d={2}".format(SelectedNetworkType.code, this.getLTNFrequency(pResource.substr(2)), this.getLTNTimeperiod(pResource.substr(0, 2))); 
                        pResource = "LTN"
                    }
                    else
                        params += "ncd={0}&sc={1}".format(pResource, SelectedNetworkType.code);
                    url += this.getPrimaryNetworkResource(pResource) + params;
                    break;
                case NetworkType.AQUIFER: case NetworkType.LOCAL:

                    url += this.getNetworkResource(SelectedNetworkType.GWWMapType)+"?ncd="+SelectedNetworkType.code;
                    break;
            }//endswitch

            this.sm("Opening " + SelectedNetworkType.name + " page. Please wait.", Models.NotificationType.e_wait, "Page Notification");
            this.$window.open(url, "_self"); //_blank
        }

        //Helper Methods
        //-+-+-+-+-+-+-+-+-+-+-+-
        private init(): void { 
            //init event handler
            this.SelectedFilters = this.groundwaterwatchService.SelectedGWFilters;
            this.sideBarCollapsed = false;
            this.selectedProcedure = ProcedureType.NetworkType;

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
                this.sm(e.message, Models.NotificationType.e_error, "Proceedure");
                return false;
            }
        }
        private getNetworkResource(mapType: number): string {
            //recieved from 
            switch (mapType) {
                case 1: case 3:case 5:case 7:
                    return "/net/ogwnetwork.asp";
                case 2:
                    return "/netmapT2L1.asp";
                case 4:
                    return "/netmapT4L1.asp";
                case 6:
                    return "/netmapT6L1.asp";
                case 8:
                    return "/netmapT2L1.asp";
                case 9: case -1:
                    return "/netmapT9L1.asp";
                default:
                    return "";
            }


        }
        private getPrimaryNetworkResource(NetworkRecsource:string): string {
            switch (NetworkRecsource) {
                case "AWL":
                    return "/StateMap.asp";
                case "LTN":
                    return "/ltn/StateMapLTN.asp";
                default:
                    return "/NetMapT1L2.asp"
            }//end switch
        }
        private getLTNTimeperiod(val: string): string {
            try {
                switch (val) {
                    case "20":
                        return "1";
                    case "30":
                        return "2";
                    case "50":
                        return "3";
                    default:
                        return "1";
                }//end switch
            } catch (e) {
                return "1";
            }
        }
        private getLTNFrequency(val: string): string {
            try {
                switch (val) {
                    case "List":
                        return "1";
                    case "Month":
                        return "2";
                    case "Daily":
                        return "3";
                    default:
                        return "1";
                }//end switch
            } catch (e) {
                return "1";
            }
        }
        private sm(m: string, t: Models.NotificationType, title: string = "", showclosebtn: boolean = false, id: number = null, tmout: number = 5000) {
            this.toaster.pop(new Models.Notification(m, t, title, showclosebtn, tmout, id));
        }
        private clrm(id: number = null) {
            this.toaster.clear();
        }

  
    }//end class

    enum ProcedureType {
        Search = 1,
        NetworkType = 2,
        Filter = 3
    }
    enum NetworkType {
        STATE = 1,
        AQUIFER = 2,
        LOCAL = 3
    }

    angular.module('GroundWaterWatch.Controllers')
        .controller('GroundWaterWatch.Controllers.SidebarController', SidebarController)
    
}//end module
 