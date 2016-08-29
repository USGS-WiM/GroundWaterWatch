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
        getFilterRequest(): string;
        queryGWsite(latlong: any, boundsString: any, x: any, y: any, width: any, height: any);

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
        public queriedGWsite: boolean;

        public SelectedGWFilters: Array<Models.IGroundWaterFilterSite> = [];

        //Constructor
        //-+-+-+-+-+-+-+-+-+-+-+-
        constructor($http: ng.IHttpService, evntmngr:WiM.Event.IEventManager) {
            super($http, configuration.baseurls['GroundWaterWatch'])
            this._eventManager = evntmngr;
            this.queriedGWsite = false;
            
            this.init();
        }

        //Methods
        //-+-+-+-+-+-+-+-+-+-+-+- 
       
        public AddFilterTypes(FiltersToAdd: Array<Models.IGroundWaterFilterSite>): void {
            FiltersToAdd.forEach(x=> this.SelectedGWFilters.push(x)) 
            this.updateGWWSiteList();                     
        }
        public getFilterRequest(): string {
               //NETWORK_CD         = ncd
               //STATE_CD           = sc
               //COUNTY_CD          = cc
               //SITE_NO            = S
            if (this.SelectedGWFilters.length < 1) return "";
            var filter:Array<string> = [];
            
            var groupedFeature = this.SelectedGWFilters.group("Type");

            var states = groupedFeature.hasOwnProperty(Models.FilterType.STATE.toString()) ?
                groupedFeature[Models.FilterType.STATE.toString()].map((item: Models.GroundWaterFilterSite) => { return item.Name }) : null;
            if (states !== null) filter.push("STATE_CD in ('" + states.join("','") + "')"); 

            var network = groupedFeature.hasOwnProperty(Models.FilterType.NETWORK.toString()) ?
                groupedFeature[Models.FilterType.NETWORK.toString()].map((item: Models.GroundWaterFilterSite) => { return item.Name }) : null;
            if (network !== null) filter.push("NETWORK_CD in ('" + network.join("','") + "')");

            var county = groupedFeature.hasOwnProperty(Models.FilterType.COUNTY.toString()) ?
                groupedFeature[Models.FilterType.COUNTY.toString()].map((item: Models.GroundWaterFilterSite) => { return item.Name }) : null;
            if (county !== null) filter.push("COUNTY_CD in ('" + county.join("','") + "')");

            var site = groupedFeature.hasOwnProperty(Models.FilterType.SITE.toString()) ?
                groupedFeature[Models.FilterType.SITE.toString()].map((item: Models.GroundWaterFilterSite) => { return item.Name }) : null;
            if (site !== null) filter.push("SITE_NO in ('" + site.join("','") + "')");

            return filter.join(" AND ");
        }
        public queryGWsite(latlong: any, boundsString: any, x: any, y: any, width: any, height: any) {

            this.queriedGWsite = false;
            //create false bounding box
            //http://gis.stackexchange.com/questions/102169/query-wms-getfeatureinfo-with-known-latitude-and-longitude

            //groundwaterwatch:Latest_WL_Percentile
            var url = configuration.baseurls['GroundWaterWatch'] + "/groundwaterwatch/wms?";
            url += "&INFO_FORMAT=application/json";
            url += "&EXCEPTIONS=application/json";
            url += "&REQUEST=GetFeatureInfo";
            url += "&SERVICE=wms&VERSION=1.1.1&WIDTH=" + width + "&HEIGHT=" + height + "&X=" + x + "&Y=" + y + "&BBOX=" + boundsString;
            url += "&LAYERS=groundwaterwatch:Latest_WL_Percentile&QUERY_LAYERS=groundwaterwatch:Latest_WL_Percentile&buffer=10";

            var request: WiM.Services.Helpers.RequestInfo = new WiM.Services.Helpers.RequestInfo(url, true);

            this.Execute(request).then(
                (response: any) => {
                    this.queriedGWsite = true;

                    if (response.data.features && response.data.features.length > 0) {
                        response.data.features.forEach((item) => {
                            console.log(item);

                            this.SelectedGWSite = item;
                            //this._eventManager.RaiseEvent(onSelectedGWSiteChanged, this, WiM.Event.EventArgs.Empty);
                        });//next
                    }//endif
                    else {
                        console.log('No gww sites found');
                        this.SelectedGWSite = null;
                    }
                }, (error) => {
                    console.log('No gww sites found');                    
                }).finally(() => {
                });
        }
        
        //HelperMethods
        //-+-+-+-+-+-+-+-+-+-+-+-
        private init(): void {
            this._GWSiteList = [];
            this._eventManager.AddEvent(onSelectedGWSiteChanged);
        }
        //https:// github.com / USGS - WiM / streamest / blob / 180a4c7db6386fdaa0ab846395517d3ac3b36967/ src / Services / StudyAreaService.ts#L527
        //ABBREV = 'CO'
        //STATE = '08'
        //outfeilds COUNTY,STATE,ABBREV,NAME
        private updateGWWSiteList() {
            var filter = this.getFilterRequest();
            
            var url = configuration.baseurls['GroundWaterWatch'] + "/groundwaterwatch/wfs?";
            url += "&SERVICE=wfs&VERSION=1.1.1";
            url += "&outputFormat=application/json";
            url += "&REQUEST=getfeature";
            url += "&typename=groundwaterwatch:Latest_WL_Percentile";
            if (filter != "") url += "&CQL_FILTER=" + filter;
            var request: WiM.Services.Helpers.RequestInfo = new WiM.Services.Helpers.RequestInfo(url, true);

            this.Execute(request).then(
                (response: any) => {
                    this.queriedGWsite = true;

                    if (response.data.features && response.data.features.length > 0) {
                        response.data.features.forEach((item) => {
                            console.log(item);
                            //this._eventManager.RaiseEvent(onSelectedGWSiteChanged, this, WiM.Event.EventArgs.Empty);
                        });//next
                    }//endif
                    else {
                        console.log('No gww sites found');
                        this.SelectedGWSite = null;
                    }
                }, (error) => {
                    console.log('No gww sites found');
                }).finally(() => {
                });

        }


        //Event Handlers
        //-+-+-+-+-+-+-+-+-+-+-+-

    }//end class

    factory.$inject = ['$http', 'WiM.Event.EventManager'];
    function factory($http: ng.IHttpService, evntmngr: WiM.Event.IEventManager ) {
        return new GroundWaterWatchService($http, evntmngr)
    }
    angular.module('GroundWaterWatch.Services')
        .factory('GroundWaterWatch.Services.GroundWaterWatchService', factory)
}//end module  