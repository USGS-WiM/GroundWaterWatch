//------------------------------------------------------------------------------
//----- NavbarController ------------------------------------------------------
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
        'use strict';
        var NavbarController = (function () {
            function NavbarController($scope, modal) {
                $scope.vm = this;
                this.modalService = modal;
            }
            Object.defineProperty(NavbarController.prototype, "ProjectName", {
                get: function () {
                    return configuration.projectName;
                },
                enumerable: true,
                configurable: true
            });
            //Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            NavbarController.prototype.openAboutModal = function () {
                this.modalService.openModal(GroundWaterWatch.Services.ModalType.e_about);
            };
            //Constructor
            //-+-+-+-+-+-+-+-+-+-+-+-
            NavbarController.$inject = ['$scope', 'GroundWaterWatch.Services.ModalService'];
            return NavbarController;
        }()); //end class
        angular.module('GroundWaterWatch.Controllers')
            .controller('GroundWaterWatch.Controllers.NavbarController', NavbarController);
    })(Controllers = GroundWaterWatch.Controllers || (GroundWaterWatch.Controllers = {}));
})(GroundWaterWatch || (GroundWaterWatch = {})); //end module
//# sourceMappingURL=Navbarcontroller.js.map