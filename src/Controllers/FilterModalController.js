//------------------------------------------------------------------------------
//----- FilterModalController -------------------------------------------------
//------------------------------------------------------------------------------
//-------1---------2---------3---------4---------5---------6---------7---------8
//       01234567890123456789012345678901234567890123456789012345678901234567890
//-------+---------+---------+---------+---------+---------+---------+---------+
// copyright:   2016 WiM - USGS
//    authors:  Jeremy K. Newson USGS Wisconsin Internet Mapping
//             
// 
//   purpose:  Handles the filter selection modal content
//          
//discussion:
//Comments
//05.11.2016 jkn - Created
var GroundWaterWatch;
(function (GroundWaterWatch) {
    var Controllers;
    (function (Controllers) {
        'use string';
        var FilterModalController = (function () {
            function FilterModalController($scope, modal, gwwService) {
                $scope.vm = this;
                this.modalInstance = modal;
                this.GWWService = gwwService;
                this.init();
            }
            //Methods  
            //-+-+-+-+-+-+-+-+-+-+-+-
            FilterModalController.prototype.Close = function () {
                if (this.SelectedStates.length > 0)
                    this.GWWService.AddFilterTypes(this.SelectedStates);
                if (this.SelectedCounties.length > 0)
                    this.GWWService.AddFilterTypes(this.SelectedCounties);
                if (this.SelectedAquifers.length > 0)
                    this.GWWService.AddFilterTypes(this.SelectedAquifers);
                this.modalInstance.dismiss('cancel');
            };
            FilterModalController.prototype.AddStateFilter = function (item) {
                this.SelectedStates.push(new GroundWaterWatch.Models.GroundWaterFilterSite('08', GroundWaterWatch.Models.FilterType.STATE));
            };
            FilterModalController.prototype.AddCountyFilter = function (item) {
                this.SelectedCounties.push(new GroundWaterWatch.Models.GroundWaterFilterSite('003', GroundWaterWatch.Models.FilterType.COUNTY));
            };
            FilterModalController.prototype.AddAquiferFilter = function (item) {
                this.SelectedAquifers.push(new GroundWaterWatch.Models.GroundWaterFilterSite(item, GroundWaterWatch.Models.FilterType.AQUIFER));
            };
            //Helper Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            FilterModalController.prototype.init = function () {
                //place anything that needs to be initialized here
                this.SelectedAquifers = [];
                this.SelectedCounties = [];
                this.SelectedStates = [];
            };
            //Constructor
            //-+-+-+-+-+-+-+-+-+-+-+-
            FilterModalController.$inject = ['$scope', '$modalInstance', 'GroundWaterWatch.Services.GroundWaterWatchService'];
            return FilterModalController;
        }()); //end  class
        angular.module('GroundWaterWatch.Controllers')
            .controller('GroundWaterWatch.Controllers.FilterModalController', FilterModalController);
    })(Controllers = GroundWaterWatch.Controllers || (GroundWaterWatch.Controllers = {}));
})(GroundWaterWatch || (GroundWaterWatch = {})); //end module 
//# sourceMappingURL=FilterModalController.js.map