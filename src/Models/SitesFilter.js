//------------------------------------------------------------------------------
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
var GroundWaterWatch;
(function (GroundWaterWatch) {
    var Models;
    (function (Models) {
        var GroundWaterFilterSite = (function () {
            function GroundWaterFilterSite(n, t) {
                this.item = n;
                this.Type = t;
            }
            return GroundWaterFilterSite;
        }()); //end class
        Models.GroundWaterFilterSite = GroundWaterFilterSite;
        var FilterType;
        (function (FilterType) {
            FilterType[FilterType["STATE"] = 1] = "STATE";
            FilterType[FilterType["COUNTY"] = 2] = "COUNTY";
            FilterType[FilterType["NETWORK"] = 3] = "NETWORK";
            FilterType[FilterType["AQUIFER"] = 4] = "AQUIFER";
            FilterType[FilterType["SITE"] = 5] = "SITE";
        })(FilterType = Models.FilterType || (Models.FilterType = {}));
    })(Models = GroundWaterWatch.Models || (GroundWaterWatch.Models = {}));
})(GroundWaterWatch || (GroundWaterWatch = {})); //end module 
//# sourceMappingURL=SitesFilter.js.map