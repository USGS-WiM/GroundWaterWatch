var configuration = {}
configuration.projectName = "Groundwater Watch";
configuration.baseurls =
{   
    'NWISurl': 'http://waterservices.usgs.gov/nwis',
    'SearchAPI': 'http://txpub.usgs.gov/DSS/search_api/1.1/dataService/dataService.ashx',
    'NationalMapRasterServices': 'http://raster.nationalmap.gov/arcgis/rest/services',
    'GroundWaterWatch': 'http://cida-test.er.usgs.gov/gww-geoserver',
    'siteservices': 'http://services.wim.usgs.gov/groundwaterwatch'
}

configuration.queryparams =
{
    "NWISsite": '/site/?format=mapper,1.0&stateCd={0}&siteType=GL,OC,OC-CO,ES,LK,ST,ST-CA,ST-DCH,ST-TS&hasDataTypeCd=iv',
    'NLCDQueryService': '/LandCover/USGS_EROS_LandCover_NLCD/MapServer/4'
}
configuration.networkTypes = [
    {
        networkCode:"AWL",
        networkDescription: "Active Groundwater Level Network"
    },
    {
        networkCode:"LWL",
        networkDescription: "Below Normal Groundwater Levels"
    },
    {
        networkCode:"CRN",
        networkDescription: "Climate Response Network"
    },
    {
        networkCode:"RTN",
        networkDescription: "Real-Time Groundwater Level Network"
    },
    {
        networkCode:"LTN",
        networkDescription: "Long-Term Groundwater Data Network"
    },
    {
        networkCode:"SPR",
        networkDescription: "Active Spring Monitoring Sites"
    },
]

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

configuration.overlayedLayers = {
    states: {
        name: 'States',
        type: 'agsDynamic',
        url: 'https://gis.geo.census.gov/arcgis/rest/services/cedr/sahie_cedr/MapServer',
        visible: true,
        layerOptions: {
            layers: [7],
            opacity: 1
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
        }
    },
    gww: {
        name: 'Groundwater Sites',
        type: 'wms',
        visible: true,
        url: configuration.baseurls['GroundWaterWatch'] + '/groundwaterwatch/wms',
        layerParams: {
            layers: 'groundwaterwatch:Latest_WL_Percentile',
            format: 'image/png',
            transparent: true,
            version: '1.1.0'
            }
    }
    //http://docs.geoserver.org/stable/en/user/services/wms/reference.html#wms-getmap
}//end overlayedLayers