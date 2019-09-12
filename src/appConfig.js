var configuration = {}
configuration.projectName = "Groundwater Watch";
configuration.baseurls =
{   
    'NWISurl': 'http://waterservices.usgs.gov/nwis',
    'gwwURL': 'http://152.61.235.95',
    'SearchAPI': 'http://txpub.usgs.gov/DSS/search_api/1.1/dataService/dataService.ashx',
    'NationalMapRasterServices': 'http://raster.nationalmap.gov/arcgis/rest/services',
    'GroundWaterWatch': 'https://cida.usgs.gov/gww-geoserver/',
    //'GroundWaterWatch': 'https://cida-test.er.usgs.gov/gww-geoserver/',
    'NationalCompositeHydrographs': 'https://groundwaterwatch.usgs.gov/composite.asp'
}

configuration.queryparams =
{
    "NWISsite": '/site/?format=mapper,1.0&stateCd={0}&siteType=GL,OC,OC-CO,ES,LK,ST,ST-CA,ST-DCH,ST-TS&hasDataTypeCd=iv',
    'NLCDQueryService': '/LandCover/USGS_EROS_LandCover_NLCD/MapServer/4',
    'WMSquery': '/groundwaterwatch/wms?INFO_FORMAT=application/json&EXCEPTIONS=application/json&REQUEST=GetFeatureInfo&SERVICE=wms&VERSION=1.1.0&WIDTH={0}&HEIGHT={1}&X={2}&Y={3}&BBOX={4}&LAYERS=groundwaterwatch:Latest_WL_Percentile&QUERY_LAYERS=groundwaterwatch:Latest_WL_Percentile&buffer=10',
    'WFSquery': '/groundwaterwatch/wfs?SERVICE=wfs&VERSION=1.1.0&outputFormat=application/json&REQUEST=getfeature&typename=groundwaterwatch:Latest_WL_Percentile'
}

configuration.basemaps =
{
    national: {
        name: "National Geographic",
        type: "agsBase",
        layer: "NationalGeographic",
        visible: true
    },
    "tnmBaseMap": {
        "name": "USGS National Map",
        "visible": false,
        "type": 'group',
        "layerOptions": {
            "layers": [
                {
                    "name": "tiles",
                    "url": "http://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer",
                    "type": 'agsTiled',
                    "layerOptions": {
                        "opacity": 0.8,
                        "minZoom": 0,
                        "maxZoom": 15,
                        "attribution": "<a href='http://www.doi.gov'>U.S. Department of the Interior</a> | <a href='http://www.usgs.gov'>U.S. Geological Survey</a> | <a href='http://www.usgs.gov/laws/policies_notices.html'>Policies</a>"
                    }
                },
                {
                    "name": "dynamic",
                    "url": "http://services.nationalmap.gov/arcgis/rest/services/USGSTopoLarge/MapServer",
                    "type": 'agsDynamic',
                    "layerOptions": {
                        "format": "png8",
                        "f": "image",
                        "position": "back",
                        "opacity": 0.7,
                        "zIndex": -100,
                        "minZoom": 16,
                        "maxZoom": 20,
                        "attribution": "<a href='http://www.doi.gov'>U.S. Department of the Interior</a> | <a href='http://www.usgs.gov'>U.S. Geological Survey</a> | <a href='http://www.usgs.gov/laws/policies_notices.html'>Policies</a>"
                    }
                }
            ]
        }
    },
    streets: {
        name: "ESRI Streets",
        type: "agsBase",
        layer: "Streets",
        visible: true
    },
    topo: {
        name: "ESRI World Topographic",
        type: "agsBase",
        layer: "Topographic",
        visible: false
    },
    oceans: {
        name: "ESRI Oceans",
        type: "agsBase",
        layer: "Oceans",
        visible: false
    },
    gray: {
        name: "ESRI Gray",
        type: "agsBase",
        layer: "Gray",
        visible: false
    },
    imagery: {
        name: "ESRI Imagery",
        type: "agsBase",
        layer: "Imagery",
        visible: false
    }
}// end baselayer

configuration.redirects = {
    Site: "AWLSitesTEST.asp",
    StateMap: "/StateMapTEST.asp",
    LTNStateMap: "/ltn/StateMapLTN.asp",
    NetMap: "/NetMapT1L2.asp",
    NetworkResource1357:"/net/ogwnetwork.asp",
    NetworkResource2:"/netmapT2L1.asp",
    NetworkResource4:"/netmapT4L1.asp",
    NetworkResource6:"/netmapT6L1.asp",
    NetworkResource8:"/netmapT2L1.asp",
    NetworkResource9:"/netmapT9L1.asp"
}
configuration.overlayedLayers = {
    draw: {
        name: 'draw',
        type: 'group',
        visible: true,
        layerParams: {
            'showOnSelector': false,
        }
    },
    states: {
        name: 'States',
        type: 'agsDynamic',
        url: 'https://gis.geo.census.gov/arcgis/rest/services/cedr/sahie_cedr/MapServer',
        visible: true,
        layerOptions: {
            layers: [7],
            opacity: 1
        },
        layerParams: {
            'showOnSelector': false,
        }
    },
    counties: {
        name: 'Counties',
        type: 'agsDynamic',
        url: 'https://gis.geo.census.gov/arcgis/rest/services/cedr/sahie_cedr/MapServer',
        visible: true,
        layerOptions: {
            layers: [15],
            minZoom: 7,
            maxZoom: 20,
            opacity: 1
        },
        layerParams: {
            'showOnSelector': false,
        }
    },
    gww: {
        name: 'Groundwater Sites',
        type: 'wms',
        visible: true,
        url: configuration.baseurls['GroundWaterWatch'] + '/groundwaterwatch/wms',
        legendURL: 'data:image/png;base64,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',
        layerParams: {
            layers: 'groundwaterwatch:Latest_WL_Percentile',
            format: 'image/png',
            transparent: true,
            version: '1.1.0',
            zIndex:100
            }
    }
    //http://docs.geoserver.org/stable/en/user/services/wms/reference.html#wms-getmap
}//end overlayedLayers