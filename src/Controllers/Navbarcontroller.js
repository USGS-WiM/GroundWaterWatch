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
            function NavbarController($scope, $stateParams, modal, gww) {
                $scope.vm = this;
                this.modalService = modal;
                this.gwwService = gww;
                this.checkAboutModal();
            }
            Object.defineProperty(NavbarController.prototype, "ProjectName", {
                get: function () {
                    if (this.gwwService.SelectedPrimaryNetwork)
                        return configuration.projectName + " - " + this.gwwService.SelectedPrimaryNetwork.name;
                    else
                        return configuration.projectName;
                },
                enumerable: true,
                configurable: true
            });
            //Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            NavbarController.prototype.checkAboutModal = function () {
                if (this.readCookie('GWWshowAbout') == null) {
                    this.modalService.openModal(GroundWaterWatch.Services.ModalType.e_about);
                }
            };
            NavbarController.prototype.openAboutModal = function () {
                this.modalService.openModal(GroundWaterWatch.Services.ModalType.e_about);
            };
            //Helper Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            NavbarController.prototype.readCookie = function (name) {
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ')
                        c = c.substring(1, c.length);
                    if (c.indexOf(nameEQ) == 0)
                        return c.substring(nameEQ.length, c.length);
                }
                return null;
            };
            //Constructor
            //-+-+-+-+-+-+-+-+-+-+-+-
            NavbarController.$inject = ['$scope', '$stateParams', 'GroundWaterWatch.Services.ModalService', 'GroundWaterWatch.Services.GroundWaterWatchService'];
            return NavbarController;
        }()); //end class
        angular.module('GroundWaterWatch.Controllers')
            .controller('GroundWaterWatch.Controllers.NavbarController', NavbarController);
    })(Controllers = GroundWaterWatch.Controllers || (GroundWaterWatch.Controllers = {}));
})(GroundWaterWatch || (GroundWaterWatch = {})); //end module
//# sourceMappingURL=Navbarcontroller.js.map