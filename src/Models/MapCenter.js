//------------------------------------------------------------------------------
//----- IMapCenter -------------------------------------------------
//------------------------------------------------------------------------------
//-------1---------2---------3---------4---------5---------6---------7---------8
//       01234567890123456789012345678901234567890123456789012345678901234567890
//-------+---------+---------+---------+---------+---------+---------+---------+
// copyright:   2014 WiM - USGS
//    authors:  Jeremy K. Newson USGS Wisconsin Internet Mapping
//             
// 
//   purpose:  mapCenter
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
        var MapCenter = (function () {
            //Constructor
            //-+-+-+-+-+-+-+-+-+-+-+-
            function MapCenter(lt, lg, zm) {
                this.lat = lt;
                this.lng = lg;
                this.zoom = zm;
            }
            return MapCenter;
        }());
    })(Models = GroundWaterWatch.Models || (GroundWaterWatch.Models = {}));
})(GroundWaterWatch || (GroundWaterWatch = {})); //end module 
//# sourceMappingURL=MapCenter.js.map