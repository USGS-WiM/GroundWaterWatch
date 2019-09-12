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
var GroundWaterWatch;
(function (GroundWaterWatch) {
    var Models;
    (function (Models) {
        var GroundWaterSite = (function () {
            function GroundWaterSite() {
            }
            //Methods
            GroundWaterSite.FromJson = function (feature) {
                if (!feature)
                    return null;
                var obj = feature.hasOwnProperty("properties") ? feature["properties"] : null;
                var gww = new GroundWaterSite();
                gww.siteNO = obj.hasOwnProperty("SITE_NO") ? obj["SITE_NO"] : "---";
                gww.siteName = obj.hasOwnProperty("SITE_NAME") ? obj["SITE_NAME"] : "---";
                gww.measurement = obj.hasOwnProperty("LATEST_VALUE") ? obj["LATEST_VALUE"] : Number.NaN;
                gww.measurementDate = obj.hasOwnProperty("LATEST_DATE") ? obj["LATEST_DATE"] : null;
                gww.wellDepth = obj.hasOwnProperty("WELL_DEPTH") ? obj["WELL_DEPTH"] : Number.NaN;
                gww.localAquiferName = obj.hasOwnProperty("LOCAL_AQUIFER_NAME") ? obj["LOCAL_AQUIFER_NAME"] : "---";
                gww.stateName = obj.hasOwnProperty("STATE_NM") ? obj["STATE_NM"] : "---";
                gww.countyName = obj.hasOwnProperty("COUNTY_NM") ? obj["COUNTY_NM"] : "---";
                gww.geometry = feature.hasOwnProperty("geometry") ? obj["geometry"] : null;
                return gww;
            };
            return GroundWaterSite;
        }()); //end class
        Models.GroundWaterSite = GroundWaterSite;
    })(Models = GroundWaterWatch.Models || (GroundWaterWatch.Models = {}));
})(GroundWaterWatch || (GroundWaterWatch = {})); //end module 
//# sourceMappingURL=GroundWaterWatchSite.js.map