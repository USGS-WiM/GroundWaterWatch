//------------------------------------------------------------------------------
//----- Point ------------------------------------------------------------------
//------------------------------------------------------------------------------

//-------1---------2---------3---------4---------5---------6---------7---------8
//       01234567890123456789012345678901234567890123456789012345678901234567890
//-------+---------+---------+---------+---------+---------+---------+---------+

// copyright:   2014 WiM - USGS

//    authors:  Jeremy K. Newson USGS Wisconsin Internet Mapping
//             
// 
//   purpose:  
//          
//discussion:
//

//Comments
//08.20.2014 jkn - Created


//Imports"
// Interface
module GroundWaterWatch.Models {
    export interface ISimpleGroundWaterSite {
        siteNO: string
        siteName: string
        measurement: number
        measurementDate: Date
        wellDepth: number
        localAquiferName: string
        stateName: string
        countyName: string
        geometry: any

    }

    export class GroundWaterSite implements ISimpleGroundWaterSite {
        //properties
        public siteNO: string
        public siteName: string
        public measurement: number
        public measurementDate: Date
        public wellDepth: number
        public localAquiferName: string
        public stateName: string
        public countyName: string
        public geometry:any

        constructor() {
        }
        //Methods
        public static FromJson(feature: Object): ISimpleGroundWaterSite {
            if (!feature) return null;
            var obj = feature.hasOwnProperty("properties") ? feature["properties"] : null;

            var gww: ISimpleGroundWaterSite = new GroundWaterSite();
            gww.siteNO = obj.hasOwnProperty("SITE_NO") ? <string>obj["SITE_NO"] : "---";
            gww.siteName = obj.hasOwnProperty("SITE_NAME") ? <string>obj["SITE_NAME"] : "---";
            gww.measurement = obj.hasOwnProperty("LATEST_VALUE") ? <number>obj["LATEST_VALUE"] : Number.NaN;
            gww.measurementDate = obj.hasOwnProperty("LATEST_DATE") ? <Date> obj["LATEST_DATE"] : null;
            gww.wellDepth = obj.hasOwnProperty("WELL_DEPTH") ? <number>obj["WELL_DEPTH"] : Number.NaN; 
            gww.localAquiferName = obj.hasOwnProperty("LOCAL_AQUIFER_NAME") ? <string>obj["LOCAL_AQUIFER_NAME"] : "---";
            gww.stateName = obj.hasOwnProperty("STATE_NM") ? obj["STATE_NM"] : "---";
            gww.countyName = obj.hasOwnProperty("COUNTY_NM") ? obj["COUNTY_NM"] : "---";

            gww.geometry = feature.hasOwnProperty("geometry") ? obj["geometry"] : null;

            return gww;
        }

    }//end class
}//end module 