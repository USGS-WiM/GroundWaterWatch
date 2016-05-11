//------------------------------------------------------------------------------
//----- modalService -----------------------------------------------------
//------------------------------------------------------------------------------
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
var WiMapper;
(function (WiMapper) {
    var Services;
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
                if (options === void 0) { options = null; }
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
                try {
                    switch (mType) {
                        default:
                            return {
                                templateUrl: 'Views/defaultmodal.html',
                                controller: 'WiMapper.Controllers.DefaultModalController',
                                size: 'lg',
                                backdropClass: 'backdropZ',
                                backdrop: 'static',
                                windowClass: 'windowZ'
                            };
                    } //end switch          
                }
                catch (e) {
                    return false;
                }
            };
            return ModalService;
        })(); //end class
        (function (ModalType) {
            ModalType[ModalType["e_default1"] = 1] = "e_default1";
        })(Services.ModalType || (Services.ModalType = {}));
        var ModalType = Services.ModalType;
        factory.$inject = ['$modal'];
        function factory($modal) {
            return new ModalService($modal);
        }
        angular.module('WiMapper.Services')
            .factory('WiMapper.Services.ModalService', factory);
    })(Services = WiMapper.Services || (WiMapper.Services = {}));
})(WiMapper || (WiMapper = {})); //end module  
//# sourceMappingURL=ModalService.js.map