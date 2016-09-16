//------------------------------------------------------------------------------
//----- SiteListController ------------------------------------------------------
//------------------------------------------------------------------------------
//-------1---------2---------3---------4---------5---------6---------7---------8
//       01234567890123456789012345678901234567890123456789012345678901234567890
//-------+---------+---------+---------+---------+---------+---------+---------+
// copyright:   2016 WiM - USGS
//    authors:  Jeremy K. Newson USGS Wisconsin Internet Mapping
//   purpose:   
//discussion:   Controllers are typically built to reflect a View. 
//              and should only contailn business logic needed for a single view. For example, if a View 
//              contains a ListBox of objects, a Selected object, and a Save button, the Controller 
//              will have an ObservableCollection ObectList, 
//              Model SelectedObject, and SaveCommand.
//Comments
//05.13.2016 jkn - Created
//Imports"
var GroundWaterWatch;
(function (GroundWaterWatch) {
    var Controllers;
    (function (Controllers) {
        'use strict';
        var SiteListController = (function () {
            function SiteListController($scope, gwwservice) {
                $scope.vm = this;
                this.gwwServices = gwwservice;
                this.SiteList = gwwservice.GWSiteList;
                this.isShown = true;
            }
            //Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            SiteListController.prototype.toggleShown = function () {
                this.isShown = !this.isShown;
            };
            //Constructor
            //-+-+-+-+-+-+-+-+-+-+-+-
            SiteListController.$inject = ['$scope', 'GroundWaterWatch.Services.GroundWaterWatchService'];
            return SiteListController;
        }()); //end class
        angular.module('GroundWaterWatch.Controllers')
            .controller('GroundWaterWatch.Controllers.SiteListController', SiteListController);
    })(Controllers = GroundWaterWatch.Controllers || (GroundWaterWatch.Controllers = {}));
})(GroundWaterWatch || (GroundWaterWatch = {})); //end module
//# sourceMappingURL=SiteListController.js.map