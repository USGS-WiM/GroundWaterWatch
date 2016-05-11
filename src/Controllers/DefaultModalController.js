//------------------------------------------------------------------------------
//----- DefaultModalController -------------------------------------------------
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
var WiMapper;
(function (WiMapper) {
    var Controllers;
    (function (Controllers) {
        'use string';
        var DefaultModalController = (function () {
            function DefaultModalController($scope, modal) {
                $scope.vm = this;
                this.modalInstance = modal;
                this.init();
            }
            //Methods  
            //-+-+-+-+-+-+-+-+-+-+-+-
            DefaultModalController.prototype.Close = function () {
                this.modalInstance.dismiss('cancel');
            };
            //Helper Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            DefaultModalController.prototype.init = function () {
                //place anything that needs to be initialized here
            };
            //Constructor
            //-+-+-+-+-+-+-+-+-+-+-+-
            DefaultModalController.$inject = ['$scope', '$modalInstance'];
            return DefaultModalController;
        })(); //end  class
        angular.module('WiMapper.Controllers')
            .controller('WiMapper.Controllers.DefaultModalController', DefaultModalController);
    })(Controllers = WiMapper.Controllers || (WiMapper.Controllers = {}));
})(WiMapper || (WiMapper = {})); //end module 
//# sourceMappingURL=DefaultModalController.js.map