﻿//------------------------------------------------------------------------------
//----- IGroundWaterFilterSite -------------------------------------------------
//------------------------------------------------------------------------------

//-------1---------2---------3---------4---------5---------6---------7---------8
//       01234567890123456789012345678901234567890123456789012345678901234567890
//-------+---------+---------+---------+---------+---------+---------+---------+

// copyright:   2014 WiM - USGS

//    authors:  Jeremy K. Newson USGS Wisconsin Internet Mapping
//             
// 
//   purpose:  filter for GWW site
//          
//discussion:
//

//Comments
//08.20.2014 jkn - Created


//Imports"
// Interface
module GroundWaterWatch.Models {
    export interface IGroundWaterFilterSite {
        item: IFilterSite
        Type:FilterType
    }

    export class GroundWaterFilterSite implements IGroundWaterFilterSite {
        //properties
        public item: IFilterSite
        public Type: FilterType

        constructor(n:IFilterSite, t:FilterType) {
            this.item = n;
            this.Type = t;
        }

    }//end class

    export enum FilterType {
        STATE = 1,
        COUNTY = 2,
        NETWORK =3,
        AQUIFER = 4,
        SITE=5
    }
}//end module 