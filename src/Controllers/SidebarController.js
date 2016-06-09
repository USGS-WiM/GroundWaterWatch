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
var GroundWaterWatch;
(function (GroundWaterWatch) {
    var Controllers;
    (function (Controllers) {
        'use strinct';
        var SidebarController = (function () {
            function SidebarController($scope, toaster, $analytics, service, modalService, gwwService) {
                $scope.vm = this;
                this.toaster = toaster;
                this.angulartics = $analytics;
                this.searchService = service;
                this.groundwaterwatchService = gwwService;
                this.modalService = modalService;
                this.init();
            }
            SidebarController.prototype.getLocations = function (term) {
                return this.searchService.getLocations(term);
            };
            SidebarController.prototype.setProcedureType = function (pType) {
                if (this.selectedProcedure == pType || !this.canUpdateProcedure(pType)) {
                    return;
                }
                this.selectedProcedure = pType;
            };
            SidebarController.prototype.toggleSideBar = function () {
                if (this.sideBarCollapsed)
                    this.sideBarCollapsed = false;
                else
                    this.sideBarCollapsed = true;
            };
            SidebarController.prototype.zoomRegion = function (inRegion) {
                var region = angular.fromJson(inRegion);
            };
            SidebarController.prototype.startSearch = function (e) {
                e.stopPropagation();
                e.preventDefault();
                $("#sapi-searchTextBox").trigger($.Event("keyup", { "keyCode": 13 }));
            };
            SidebarController.prototype.removeFilter = function (filter) {
                var index = this.SelectedFilters.indexOf(filter);
                this.SelectedFilters.splice(index);
            };
            SidebarController.prototype.ClearFilters = function () {
                this.SelectedFilters.splice(0, this.SelectedFilters.length);
            };
            SidebarController.prototype.AddFilter = function () {
                this.modalService.openModal(GroundWaterWatch.Services.ModalType.e_filter);
            };
            //special function for searching arrays but ignoring angular hashkey
            SidebarController.prototype.checkArrayForObj = function (arr, obj) {
                for (var i = 0; i < arr.length; i++) {
                    if (angular.equals(arr[i], obj)) {
                        return i;
                    }
                }
                ;
                return -1;
            };
            //Helper Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            SidebarController.prototype.init = function () {
                //init event handler
                this.SelectedFilters = this.groundwaterwatchService.SelectedGWFilters;
                this.sideBarCollapsed = false;
                this.selectedProcedure = ProcedureType.Search;
            };
            SidebarController.prototype.canUpdateProcedure = function (pType) {
                //console.log('in canUpdateProcedure');
                //Project flow:
                var msg;
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
                    } //end switch          
                }
                catch (e) {
                    //this.sm(new MSG.NotificationArgs(e.message, MSG.NotificationType.INFORMATION, 1.5));
                    return false;
                }
            };
            SidebarController.prototype.sm = function (msg) {
                try {
                }
                catch (e) {
                }
            };
            //Constructor
            //-+-+-+-+-+-+-+-+-+-+-+-
            SidebarController.$inject = ['$scope', 'toaster', '$analytics', 'WiM.Services.SearchAPIService', 'GroundWaterWatch.Services.ModalService', 'GroundWaterWatch.Services.GroundWaterWatchService'];
            return SidebarController;
        })(); //end class
        var ProcedureType;
        (function (ProcedureType) {
            ProcedureType[ProcedureType["Search"] = 1] = "Search";
            ProcedureType[ProcedureType["NetworkType"] = 2] = "NetworkType";
            ProcedureType[ProcedureType["Filter"] = 3] = "Filter";
        })(ProcedureType || (ProcedureType = {}));
        angular.module('GroundWaterWatch.Controllers')
            .controller('GroundWaterWatch.Controllers.SidebarController', SidebarController);
    })(Controllers = GroundWaterWatch.Controllers || (GroundWaterWatch.Controllers = {}));
})(GroundWaterWatch || (GroundWaterWatch = {})); //end module
//# sourceMappingURL=SidebarController.js.map