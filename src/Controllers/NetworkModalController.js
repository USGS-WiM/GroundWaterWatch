//------------------------------------------------------------------------------
//----- NetworkModalController -------------------------------------------------
//------------------------------------------------------------------------------
//-------1---------2---------3---------4---------5---------6---------7---------8
//       01234567890123456789012345678901234567890123456789012345678901234567890
//-------+---------+---------+---------+---------+---------+---------+---------+
// copyright:   2016 WiM - USGS
//    authors:  Jeremy K. Newson USGS Wisconsin Internet Mapping
//             
// 
//   purpose:  Example of Modal Controller
//          
//discussion:
//Comments
//05.11.2016 jkn - Created
//Import
var GroundWaterWatch;
(function (GroundWaterWatch) {
    var Controllers;
    (function (Controllers) {
        'use string';
        var AboutModalController = (function () {
            function AboutModalController($scope, $sce, modal, gwwservice, modalService) {
                var _this = this;
                $scope.vm = this;
                this.sce = $sce;
                this.modalInstance = modal;
                this.modalService = modalService;
                this.gwwService = gwwservice;
                this.selectedAboutTabName = "about";
                this.init();
                $scope.$watch(function () { return _this.modalService.modalOptions.tabName; }, function (newval, oldval) { return _this.selectAboutTab(newval); });
            }
            //Methods  
            //-+-+-+-+-+-+-+-+-+-+-+-
            AboutModalController.prototype.Close = function () {
                this.modalInstance.dismiss('cancel');
            };
            AboutModalController.prototype.Dismiss = function () {
                this.createCookie('GWWshowAbout', true, 30);
                this.modalInstance.dismiss('cancel');
            };
            AboutModalController.prototype.selectAboutTab = function (tabname) {
                if (this.selectedAboutTabName == tabname)
                    return;
                this.selectedAboutTabName = tabname;
            };
            //Helper Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            AboutModalController.prototype.init = function () {
                //place anything that needs to be initialized here
            };
            AboutModalController.prototype.convertUnsafe = function (x) {
                return this.sce.trustAsHtml(x);
            };
            ;
            AboutModalController.prototype.createCookie = function (name, value, days) {
                if (days) {
                    var date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    var expires = "; expires=" + date.toUTCString();
                }
                else
                    var expires = "";
                document.cookie = name + "=" + value + expires + "; path=/";
            };
            //Constructor
            //-+-+-+-+-+-+-+-+-+-+-+-
            AboutModalController.$inject = ['$scope', '$sce', '$modalInstance', 'GroundWaterWatch.Services.GroundWaterWatchService', 'GroundWaterWatch.Services.ModalService'];
            return AboutModalController;
        }()); //end  class
        angular.module('GroundWaterWatch.Controllers')
            .controller('GroundWaterWatch.Controllers.AboutModalController', AboutModalController);
    })(Controllers = GroundWaterWatch.Controllers || (GroundWaterWatch.Controllers = {}));
})(GroundWaterWatch || (GroundWaterWatch = {})); //end module 
//# sourceMappingURL=NetworkModalController.js.map