//------------------------------------------------------------------------------
//----- SidebarController ------------------------------------------------------
//------------------------------------------------------------------------------
//-------1---------2---------3---------4---------5---------6---------7---------8
//       01234567890123456789012345678901234567890123456789012345678901234567890
//-------+---------+---------+---------+---------+---------+---------+---------+
// copyright:   2014 WiM - USGS
//    authors:  Jeremy K. Newson USGS Wisconsin Internet Mapping
//   purpose:  
//discussion:   Controllers are typically built to reflect a View. 
//              and should only contailn business logic needed for a single view. For example, if a View 
//              contains a ListBox of objects, a Selected object, and a Save button, the Controller 
//              will have an ObservableCollection ObectList, 
//              Model SelectedObject, and SaveCommand.
//Comments
//04.14.2015 jkn - Created
//Imports"
var GroundWaterWatch;
(function (GroundWaterWatch) {
    var Controllers;
    (function (Controllers) {
        'use strinct';
        var SidebarController = (function () {
            function SidebarController($scope, toaster, $analytics, $stateParams, service, modalService, gwwService, eventmanager, $window) {
                this.$window = $window;
                $scope.vm = this;
                this.toaster = toaster;
                this.angulartics = $analytics;
                this.searchService = service;
                this.groundwaterwatchService = gwwService;
                this.modalService = modalService;
                this.eventManager = eventmanager;
                this.init();
            }
            Object.defineProperty(SidebarController.prototype, "selectedStateNetworkItem", {
                get: function () {
                    return this._selectedStateNetworkItem;
                },
                set: function (val) {
                    if (!val.hasOwnProperty("name"))
                        return;
                    if (this._selectedStateNetworkItem == val || val == null)
                        return;
                    this._selectedStateNetworkItem = val;
                    this.OpenNetworkPage(NetworkType.STATE, val);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SidebarController.prototype, "States", {
                get: function () {
                    return this.groundwaterwatchService.StateList;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SidebarController.prototype, "selectedAquiferNetworkItem", {
                get: function () {
                    return this._selectedStateNetworkItem;
                },
                set: function (val) {
                    if (!val.hasOwnProperty("name"))
                        return;
                    if (this._selectedStateNetworkItem == val || val == null)
                        return;
                    this._selectedStateNetworkItem = val;
                    this.OpenNetworkPage(NetworkType.AQUIFER, val);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SidebarController.prototype, "Aquifers", {
                get: function () {
                    return this.groundwaterwatchService.AquiferList;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SidebarController.prototype, "selectedLocalNetworkItem", {
                get: function () {
                    return this._selectedStateNetworkItem;
                },
                set: function (val) {
                    if (!val.hasOwnProperty("name"))
                        return;
                    if (this._selectedStateNetworkItem == val || val == null)
                        return;
                    this._selectedStateNetworkItem = val;
                    this.OpenNetworkPage(NetworkType.LOCAL, val);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SidebarController.prototype, "LocalNetworks", {
                get: function () {
                    return this.groundwaterwatchService.NetworkList;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SidebarController.prototype, "PrimaryNetworks", {
                get: function () {
                    return this.groundwaterwatchService.PrimaryNetworkList;
                },
                enumerable: true,
                configurable: true
            });
            SidebarController.prototype.getLocations = function (term) {
                return this.searchService.getLocations(term);
            };
            SidebarController.prototype.setProcedureType = function (pType) {
                if (this.selectedProcedure == pType) {
                    this.selectedProcedure = 0;
                    return;
                }
                if (!this.canUpdateProcedure(pType)) {
                    return;
                }
                this.selectedProcedure = pType;
            };
            SidebarController.prototype.toggleSideBar = function () {
                if (this.sideBarCollapsed)
                    this.sideBarCollapsed = false;
                else
                    this.sideBarCollapsed = true;
            };
            SidebarController.prototype.zoomRegion = function (inRegion) {
                var region = angular.fromJson(inRegion);
            };
            SidebarController.prototype.startSearch = function (e) {
                e.stopPropagation();
                e.preventDefault();
                $("#sapi-searchTextBox").trigger($.Event("keyup", { "keyCode": 13 }));
            };
            SidebarController.prototype.removeFilter = function (index, filter) {
                this.SelectedFilters.splice(index, 1);
                if (filter.Type == GroundWaterWatch.Models.FilterType.COUNTY || filter.Type == GroundWaterWatch.Models.FilterType.STATE) {
                    var fname = filter.Type == GroundWaterWatch.Models.FilterType.COUNTY ? "COUNTY" : "STATE";
                    this.eventManager.RaiseEvent(WiM.Directives.onLayerChanged, this, new WiM.Directives.LegendLayerChangedEventArgs(fname + filter.item.code, "visible", false));
                }
            };
            SidebarController.prototype.ClearFilters = function () {
                var _this = this;
                this.SelectedFilters.forEach(function (f) {
                    var fname = f.Type == GroundWaterWatch.Models.FilterType.COUNTY ? "COUNTY" : "STATE";
                    _this.eventManager.RaiseEvent(WiM.Directives.onLayerChanged, _this, new WiM.Directives.LegendLayerChangedEventArgs(fname + f.item.code, "visible", false));
                });
                this.SelectedFilters.splice(0, this.SelectedFilters.length);
            };
            SidebarController.prototype.AddFilter = function () {
                this.modalService.openModal(GroundWaterWatch.Services.ModalType.e_filter);
            };
            //special function for searching arrays but ignoring angular hashkey
            SidebarController.prototype.checkArrayForObj = function (arr, obj) {
                for (var i = 0; i < arr.length; i++) {
                    if (angular.equals(arr[i], obj)) {
                        return i;
                    }
                }
                ;
                return -1;
            };
            SidebarController.prototype.OpenNetworkPage = function (networkType, SelectedNetworkType) {
                console.log("opening link " + networkType.toString());
                this.OpenedNetwork = -1;
                var url = configuration.baseurls["gwwURL"];
                var pResource = this.groundwaterwatchService.SelectedPrimaryNetwork.code;
                switch (networkType) {
                    case NetworkType.STATE:
                        var params = "?";
                        if (pResource == "AWL")
                            params += "sc={0}&sa={1}".format(SelectedNetworkType.code, SelectedNetworkType.abbr);
                        else if (pResource.length > 3) {
                            //redigest longtermnetwork query
                            params += "sc={0}&a={1}&d={2}".format(SelectedNetworkType.code, this.getLTNFrequency(pResource.substr(2)), this.getLTNTimeperiod(pResource.substr(0, 2)));
                            pResource = "LTN";
                        }
                        else
                            params += "ncd={0}&sc={1}".format(pResource, SelectedNetworkType.code);
                        url += this.getPrimaryNetworkResource(pResource) + params;
                        break;
                    case NetworkType.AQUIFER:
                    case NetworkType.LOCAL:
                        url += this.getNetworkResource(SelectedNetworkType.GWWMapType) + "?ncd=" + SelectedNetworkType.code;
                        break;
                } //endswitch
                console.log(url);
                this.sm("Opening " + SelectedNetworkType.name + " page. Please wait.", GroundWaterWatch.Models.NotificationType.e_wait, "Page Notification");
                this.$window.open(url, "_self"); //_blank
            };
            //Helper Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            SidebarController.prototype.init = function () {
                //init event handler
                this.SelectedFilters = this.groundwaterwatchService.SelectedGWFilters;
                this.sideBarCollapsed = false;
                this.selectedProcedure = ProcedureType.NetworkType;
            };
            SidebarController.prototype.canUpdateProcedure = function (pType) {
                //console.log('in canUpdateProcedure');
                //Project flow:
                var msg;
                try {
                    switch (pType) {
                        case ProcedureType.Search:
                            return true;
                        case ProcedureType.NetworkType:
                            return true;
                        case ProcedureType.Filter:
                            return true;
                        default:
                            return false;
                    } //end switch          
                }
                catch (e) {
                    this.sm(e.message, GroundWaterWatch.Models.NotificationType.e_error, "Proceedure");
                    return false;
                }
            };
            SidebarController.prototype.getNetworkResource = function (mapType) {
                //recieved from 
                switch (mapType) {
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                        return configuration.redirects["NetworkResource1357"];
                    case 2:
                        return configuration.redirects["NetworkResource2"];
                    case 4:
                        return configuration.redirects["NetworkResource4"];
                    case 6:
                        return configuration.redirects["NetworkResource6"];
                    case 8:
                        return configuration.redirects["NetworkResource8"];
                    case 9:
                    case -1:
                        return configuration.redirects["NetworkResource9"];
                    default:
                        return "";
                }
            };
            SidebarController.prototype.getPrimaryNetworkResource = function (NetworkRecsource) {
                switch (NetworkRecsource) {
                    case "AWL":
                        return configuration.redirects["StateMap"];
                    case "LTN":
                        return configuration.redirects["LTNStateMap"];
                    default:
                        return configuration.redirects["NetMap"];
                } //end switch
            };
            SidebarController.prototype.getLTNTimeperiod = function (val) {
                try {
                    switch (val) {
                        case "20":
                            return "1";
                        case "30":
                            return "2";
                        case "50":
                            return "3";
                        default:
                            return "1";
                    } //end switch
                }
                catch (e) {
                    return "1";
                }
            };
            SidebarController.prototype.getLTNFrequency = function (val) {
                try {
                    switch (val) {
                        case "List":
                            return "1";
                        case "Month":
                            return "2";
                        case "Daily":
                            return "3";
                        default:
                            return "1";
                    } //end switch
                }
                catch (e) {
                    return "1";
                }
            };
            SidebarController.prototype.sm = function (m, t, title, showclosebtn, id, tmout) {
                if (title === void 0) { title = ""; }
                if (showclosebtn === void 0) { showclosebtn = false; }
                if (id === void 0) { id = null; }
                if (tmout === void 0) { tmout = 5000; }
                this.toaster.pop(new GroundWaterWatch.Models.Notification(m, t, title, showclosebtn, tmout, id));
            };
            SidebarController.prototype.clrm = function (id) {
                if (id === void 0) { id = null; }
                this.toaster.clear();
            };
            //Constructor
            //-+-+-+-+-+-+-+-+-+-+-+-
            SidebarController.$inject = ['$scope', 'toaster', '$stateParams', '$analytics', 'WiM.Services.SearchAPIService', 'GroundWaterWatch.Services.ModalService', 'GroundWaterWatch.Services.GroundWaterWatchService', 'WiM.Event.EventManager', '$window'];
            return SidebarController;
        }()); //end class
        var ProcedureType;
        (function (ProcedureType) {
            ProcedureType[ProcedureType["Search"] = 1] = "Search";
            ProcedureType[ProcedureType["NetworkType"] = 2] = "NetworkType";
            ProcedureType[ProcedureType["Filter"] = 3] = "Filter";
        })(ProcedureType || (ProcedureType = {}));
        var NetworkType;
        (function (NetworkType) {
            NetworkType[NetworkType["STATE"] = 1] = "STATE";
            NetworkType[NetworkType["AQUIFER"] = 2] = "AQUIFER";
            NetworkType[NetworkType["LOCAL"] = 3] = "LOCAL";
        })(NetworkType || (NetworkType = {}));
        angular.module('GroundWaterWatch.Controllers')
            .controller('GroundWaterWatch.Controllers.SidebarController', SidebarController);
    })(Controllers = GroundWaterWatch.Controllers || (GroundWaterWatch.Controllers = {}));
})(GroundWaterWatch || (GroundWaterWatch = {})); //end module
//# sourceMappingURL=SidebarController.js.map