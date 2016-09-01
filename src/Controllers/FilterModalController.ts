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

module GroundWaterWatch.Controllers {

    'use string';
    interface IFilterModalControllerScope extends ng.IScope {
        vm: IFilterModalController;
    }
    interface IModal {
        Close():void
    }    
    interface IFilterModalController extends IModal {
        SelectedState: Array<Models.IState>;
        SelectedCounties: Array<Models.ICounty>;
        SelectedAquifers: Array<Models.IAquifer>;
        SelectedNetworks: Array<Models.INetwork>;

        States: Array<Models.IState>;
        Counties: Array<Models.ICounty>;
        Aquifers: Array<Models.IAquifer>;
        Networks: Array<Models.INetwork>;
    }
    class FilterModalController implements IFilterModalController {
        
        //Properties
        //-+-+-+-+-+-+-+-+-+-+-+-
        private modalInstance: ng.ui.bootstrap.IModalServiceInstance;
        private GWWService: Services.IGroundWaterWatchService;

        public selectedProcedure: number;

        public get States(): Array<Models.IState> {
            return this.GWWService.StateList;
        }
        private _selectedState: Array<Models.IState>;
        public set SelectedState(val: Array<Models.IState>) {
            if (val != this._selectedState) this._selectedState = val;
            if (this._selectedState.length < 1) return;            
            if (!val[0].hasOwnProperty("Counties") || val[0].Counties == null) this.GWWService.loadCounties(val[0]);
            //reset selected counties
            this.SelectedCounties.length = 0;
        }
        public get SelectedState(): Array<Models.IState> {
            return this._selectedState;
        }
    
       
        public SelectedAquifers: Array<Models.IAquifer>;
        public get Aquifers(): Array<Models.IAquifer> {
            return this.GWWService.AquiferList;
        }
        public SelectedNetworks: Array<Models.INetwork>;
        public get Networks(): Array<Models.INetwork> {
            return this.GWWService.NetworkList;
        }

        public SelectedCounties: Array<Models.ICounty>;
        public get Counties(): Array<Models.ICounty> {
            if (this.SelectedState.length<1 || this.SelectedState[0].Counties.length<0) return undefined;
            return this.SelectedState[0].Counties;
        }
        //Constructor
        //-+-+-+-+-+-+-+-+-+-+-+-
        static $inject = ['$scope', '$modalInstance', 'GroundWaterWatch.Services.GroundWaterWatchService'];
        constructor($scope: IFilterModalControllerScope, modal:ng.ui.bootstrap.IModalServiceInstance, gwwService:Services.IGroundWaterWatchService) {
            $scope.vm = this;
            this.modalInstance = modal;
            this.GWWService = gwwService;
            this.init();  

            $scope.$watchCollection(() => this.SelectedState, (newval, oldval) => {
                if (newval == oldval) return;
            if (!newval[0].hasOwnProperty("Counties") || newval[0].Counties == null) this.GWWService.loadCounties(newval[0]);
            //reset selected counties
            this.SelectedCounties.length = 0;
            });
        }  
        //Methods  
        //-+-+-+-+-+-+-+-+-+-+-+-

        public Apply(): void {
            if (this.SelectedState.length>0 && this.SelectedCounties.length < 1) this.GWWService.AddFilterTypes([new Models.GroundWaterFilterSite(this.SelectedState[0], Models.FilterType.STATE)]);
            if (this.SelectedCounties.length > 0) this.GWWService.AddFilterTypes(this.SelectedCounties.map((c) => {return new Models.GroundWaterFilterSite(c,Models.FilterType.COUNTY) }));
            //if (this.SelectedAquifers.length > 0) this.GWWService.AddFilterTypes(this.SelectedAquifers);
            this.modalInstance.dismiss('cancel')
        }
        public Close(): void {
            this.modalInstance.dismiss('cancel')
        }
        public Reset(): void {
            this.SelectedState.length =0;
            this.SelectedCounties.length = 0;
            this.SelectedAquifers = null;
        }
        //Helper Methods
        //-+-+-+-+-+-+-+-+-+-+-+-
        private init(): void {
            this.selectedProcedure = 1;           
            this.SelectedCounties = [];
            this.SelectedState = [];          
        }
      
    }//end  class

    angular.module('GroundWaterWatch.Controllers')
        .controller('GroundWaterWatch.Controllers.FilterModalController', FilterModalController);
}//end module 