//------------------------------------------------------------------------------
//----- modalService -----------------------------------------------------
//------------------------------------------------------------------------------
var GroundWaterWatch;
(function (GroundWaterWatch) {
    //-------1---------2---------3---------4---------5---------6---------7---------8
    //       01234567890123456789012345678901234567890123456789012345678901234567890
    //-------+---------+---------+---------+---------+---------+---------+---------+
    // copyright:   2015 WiM - USGS
    //    authors:  Jeremy K. Newson USGS Wisconsin Internet Mapping
    //
    //
    //   purpose:  The service agent is responsible for initiating service calls,
    //             capturing the data that's returned and forwarding the data back to
    //             the Controller.
    //
    //discussion:
    //
    //https://docs.angularjs.org/api/ng/service/$http
    //Comments
    //06.16.2015 mjs - Created
    //Import
    (function (Services) {
        'use strict';

        var ModalService = (function () {
            //Constructor
            //-+-+-+-+-+-+-+-+-+-+-+-
            function ModalService($modal) {
                this.modal = $modal;
            }
            //Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            ModalService.prototype.openModal = function (mType, options) {
                if (typeof options === "undefined") { options = null; }
                if (options) {
                    this.modalOptions = options;
                }
                this.modal.open(this.getModalSettings(mType));
            };

            //HelperMethods
            //-+-+-+-+-+-+-+-+-+-+-+-
            ModalService.prototype.getModalSettings = function (mType) {
                //console.log('in canUpdateProcedure');
                //Project flow:
                var msg;
                try  {
                    switch (mType) {
                        case 1 /* e_filter */:
                            return {
                                templateUrl: 'Views/filtermodal.html',
                                controller: 'GroundWaterWatch.Controllers.FilterModalController',
                                size: 'lg',
                                backdropClass: 'backdropZ',
                                backdrop: 'static',
                                windowClass: 'windowZ'
                            };
                        case 2 /* e_about */:
                            return {
                                templateUrl: 'Views/aboutmodal.html',
                                controller: 'GroundWaterWatch.Controllers.AboutModalController',
                                size: 'lg',
                                backdropClass: 'backdropZ',
                                backdrop: 'static',
                                windowClass: 'windowZ'
                            };
                        case 3 /* e_siteinfo */:
                            return {
                                templateUrl: 'Views/siteinfomodal.html',
                                controller: 'GroundWaterWatch.Controllers.SiteInfoModalController',
                                size: 'lg',
                                backdropClass: 'backdropZ',
                                backdrop: 'static',
                                windowClass: 'windowZ'
                            };
                        default:
                            return {
                                templateUrl: 'Views/aboutmodal.html',
                                controller: 'GroundWaterWatch.Controllers.AboutModalController',
                                size: 'lg',
                                backdropClass: 'backdropZ',
                                backdrop: 'static',
                                windowClass: 'windowZ'
                            };
                    }
                } catch (e) {
                    return false;
                }
            };
            return ModalService;
        })();
        (function (ModalType) {
            ModalType[ModalType["e_filter"] = 1] = "e_filter";
            ModalType[ModalType["e_about"] = 2] = "e_about";
            ModalType[ModalType["e_siteinfo"] = 3] = "e_siteinfo";
        })(Services.ModalType || (Services.ModalType = {}));
        var ModalType = Services.ModalType;

        factory.$inject = ['$modal'];
        function factory($modal) {
            return new ModalService($modal);
        }
        angular.module('GroundWaterWatch.Services').factory('GroundWaterWatch.Services.ModalService', factory);
    })(GroundWaterWatch.Services || (GroundWaterWatch.Services = {}));
    var Services = GroundWaterWatch.Services; //end module
})(GroundWaterWatch || (GroundWaterWatch = {}));
//# sourceMappingURL=ModalService.js.map
