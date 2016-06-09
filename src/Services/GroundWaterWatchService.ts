//------------------------------------------------------------------------------
//----- GroundWaterWatchService -----------------------------------------------------
//------------------------------------------------------------------------------

//-------1---------2---------3---------4---------5---------6---------7---------8
//       01234567890123456789012345678901234567890123456789012345678901234567890
//-------+---------+---------+---------+---------+---------+---------+---------+

// copyright:   2016 WiM - USGS

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
//05.16.2016 jkn - Created

//Import
module GroundWaterWatch.Services {
    'use strict'
    export interface IGroundWaterWatchService {
        GWSiteList: Array<Models.ISimpleGroundWaterSite>;
        SelectedGWSite: Models.ISimpleGroundWaterSite;
        SelectedGWFilters: Array<Models.IGroundWaterFilterSite>;

        //GetFilterType(fType: Models.FilterType): ng.IPromise<Array<Models.IGroundWaterFilterSite>>
        AddFilterTypes(FiltersToAdd: Array<Models.IGroundWaterFilterSite>): void;

    }
    export var onSelectedGWSiteChanged: string = "onSelectedGWSiteChanged";
    class GroundWaterWatchService extends WiM.Services.HTTPServiceBase implements IGroundWaterWatchService{       
        //Events
        //-+-+-+-+-+-+-+-+-+-+-+-
        

        //Properties
        //-+-+-+-+-+-+-+-+-+-+-+-
        private _eventManager: WiM.Event.IEventManager;

        private _GWSiteList: Array<Models.ISimpleGroundWaterSite>;
        public get GWSiteList(): Array<Models.ISimpleGroundWaterSite> {
            return this._GWSiteList;
        }

        private _selectedGWSite: Models.ISimpleGroundWaterSite;
        public get SelectedGWSite(): Models.ISimpleGroundWaterSite {
            return this._selectedGWSite;
        }
        public set SelectedGWSite(val: Models.ISimpleGroundWaterSite) {
            if (val != this._selectedGWSite) {
                this._selectedGWSite = val;
                this._eventManager.RaiseEvent(onSelectedGWSiteChanged, this, WiM.Event.EventArgs.Empty);
            }//endif
        }

        public SelectedGWFilters: Array<Models.IGroundWaterFilterSite> =[];
        //Constructor
        //-+-+-+-+-+-+-+-+-+-+-+-
        constructor($http: ng.IHttpService, evntmngr:WiM.Event.IEventManager) {
            super($http, configuration.baseurls['GroundWaterWatch'])
            this._eventManager = evntmngr;
            this.init();
        }

        //Methods
        //-+-+-+-+-+-+-+-+-+-+-+- 
       
        public AddFilterTypes(FiltersToAdd: Array<Models.IGroundWaterFilterSite>): void {
            FiltersToAdd.forEach(x=> this.SelectedGWFilters.push(x))            
        }

        //HelperMethods
        //-+-+-+-+-+-+-+-+-+-+-+-
        private init(): void {
            this._eventManager.AddEvent(onSelectedGWSiteChanged);
            this.loadGWSites();
            this.SelectedGWFilters.push(new Models.GroundWaterFilterSite("State1 Test Filter", Models.FilterType.STATE));
            this.SelectedGWFilters.push(new Models.GroundWaterFilterSite("State2 Test Filter", Models.FilterType.STATE));
        }
        private loadGWSites() {
            var url = "http://cida-test.er.usgs.gov/ngwmn-geoserver/ngwmn/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=ngwmn%3ALatest_WL_Percentile&STYLES&LAYERS=ngwmn%3ALatest_WL_Percentile&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=50&Y=50&SRS=EPSG%3A4269&WIDTH=101&HEIGHT=101&BBOX=-114.0380859375%2C28.3447265625%2C-105.1611328125%2C37.2216796875";
            var request: WiM.Services.Helpers.RequestInfo = new WiM.Services.Helpers.RequestInfo(url, true);
            this._GWSiteList = [];
            this.Execute(request).then(
                (response: any) => {
                    if (response.data.features) {
                        response.data.features.forEach((item) => {
                            this._GWSiteList.push(Models.GroundWaterSite.FromJson(item));
                        });//next
                    }//endif
                }, (error) => {
                    console.log('No gww sites found');                    
                }).finally(() => {
                });
        }
    }//end class

    factory.$inject = ['$http', 'WiM.Event.EventManager'];
    function factory($http: ng.IHttpService, evntmngr: WiM.Event.IEventManager ) {
        return new GroundWaterWatchService($http, evntmngr)
    }
    angular.module('GroundWaterWatch.Services')
        .factory('GroundWaterWatch.Services.GroundWaterWatchService', factory)
}//end module  