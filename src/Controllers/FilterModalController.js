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
                var _this = this;
                $scope.vm = this;
                this.modalInstance = modal;
                this.GWWService = gwwService;
                this.init();
                $scope.$watchCollection(function () { return _this.SelectedState; }, function (newval, oldval) {
                    if (newval == oldval)
                        return;
                    if (!newval[0].hasOwnProperty("Counties") || newval[0].Counties == null)
                        _this.GWWService.loadCounties(newval[0]);
                    //reset selected counties
                    _this.SelectedCounties.length = 0;
                });
            }
            Object.defineProperty(FilterModalController.prototype, "States", {
                get: function () {
                    return this.GWWService.StateList;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FilterModalController.prototype, "SelectedState", {
                get: function () {
                    return this._selectedState;
                },
                set: function (val) {
                    if (val != this._selectedState)
                        this._selectedState = val;
                    if (this._selectedState.length < 1)
                        return;
                    if (!val[0].hasOwnProperty("Counties") || val[0].Counties == null)
                        this.GWWService.loadCounties(val[0]);
                    //reset selected counties
                    this.SelectedCounties.length = 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FilterModalController.prototype, "Aquifers", {
                get: function () {
                    return this.GWWService.AquiferList;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FilterModalController.prototype, "Networks", {
                get: function () {
                    return this.GWWService.NetworkList;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FilterModalController.prototype, "Counties", {
                get: function () {
                    if (this.SelectedState.length < 1 || this.SelectedState[0].Counties.length < 0)
                        return undefined;
                    return this.SelectedState[0].Counties;
                },
                enumerable: true,
                configurable: true
            });
            //Methods  
            //-+-+-+-+-+-+-+-+-+-+-+-
            FilterModalController.prototype.Apply = function () {
                if (this.SelectedState.length > 0 && this.SelectedCounties.length < 1)
                    this.GWWService.AddFilterTypes([new GroundWaterWatch.Models.GroundWaterFilterSite(this.SelectedState[0], GroundWaterWatch.Models.FilterType.STATE)]);
                if (this.SelectedCounties.length > 0)
                    this.GWWService.AddFilterTypes(this.SelectedCounties.map(function (c) { return new GroundWaterWatch.Models.GroundWaterFilterSite(c, GroundWaterWatch.Models.FilterType.COUNTY); }));
                //if (this.SelectedAquifers.length > 0) this.GWWService.AddFilterTypes(this.SelectedAquifers);
                this.modalInstance.dismiss('cancel');
            };
            FilterModalController.prototype.Close = function () {
                this.modalInstance.dismiss('cancel');
            };
            FilterModalController.prototype.Reset = function () {
                this.SelectedState = [];
                this.SelectedCounties = [];
                this.SelectedAquifers = [];
                this.SelectedNetworks = [];
            };
            //Helper Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            FilterModalController.prototype.init = function () {
                this.selectedProcedure = 1;
                this.SelectedCounties = [];
                this.SelectedState = [];
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