//------------------------------------------------------------------------------
//----- AboutModalController -------------------------------------------------
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
                this.selectedAboutTabName = modalService.modalOptions.tabName;
                this.showModal = true;
                this.init();
                $scope.$watch(function () { return _this.modalService.modalOptions.tabName; }, function (newval, oldval) { return _this.selectAboutTab(newval); });
            }
            //Methods  
            //-+-+-+-+-+-+-+-+-+-+-+-
            AboutModalController.prototype.Close = function () {
                this.modalInstance.dismiss('cancel');
            };
            AboutModalController.prototype.Dismiss = function () {
                if (!this.showModal) {
                    this.createCookie('GWWhideAbout', true, 30);
                }
                else
                    this.eraseCookie('GWWhideAbout');
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
                if (this.readCookie('GWWhideAbout') != null)
                    this.showModal = !this.showModal;
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
            AboutModalController.prototype.readCookie = function (name) {
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
            AboutModalController.prototype.eraseCookie = function (name) {
                this.createCookie(name, "", -1);
            };
            return AboutModalController;
        }()); //end  class
        //Constructor
        //-+-+-+-+-+-+-+-+-+-+-+-
        AboutModalController.$inject = ['$scope', '$sce', '$modalInstance', 'GroundWaterWatch.Services.GroundWaterWatchService', 'GroundWaterWatch.Services.ModalService'];
        angular.module('GroundWaterWatch.Controllers')
            .controller('GroundWaterWatch.Controllers.AboutModalController', AboutModalController);
    })(Controllers = GroundWaterWatch.Controllers || (GroundWaterWatch.Controllers = {}));
})(GroundWaterWatch || (GroundWaterWatch = {})); //end module 
//# sourceMappingURL=AboutModalController.js.map