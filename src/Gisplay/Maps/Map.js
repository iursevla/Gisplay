import { BGMapWrapper } from './Background Maps/BGMapWrapper';
import { Aesthetic } from '../Aesthetic';
import { GisplayOptions } from '../GisplayOptions';
import { WebGLUtils } from '../Helpers/WebGLUtils';
import { ColorBrewer } from '../Helpers/ColorBrewer';

/**
 * This class contains the Map class which represents the current map.
 * Each map has a group of functions available. There is only one map yet(maybe there will be two if we want to compare two).
 * @see Diogo's thesis 57-60 + 64/65
 */
export class Map {

    /**
     * Map constructor. All Map subclasses should call this first with super(...).
     * @param {BGMapWrapper|Object} bgmap - Background map.
     * @param {JSON} geometry - Geometry read from the file.
     * @param {Object} userOptions - The user defined options. 
     * @todo With the type of the map we can do an if statement inside constructor to use or not some of the variables.
     */
    constructor(bgmap, geometry, userOptions) {
        //console.log("Map constructor called -> super()");
        /**
          * This object holds for each point it's long, lat and associated properties. 
          * This points will be used by k-d Tree. And k-d Tree is used to find the closest point to where the user clicked.
          * @type {Array<{lon: number, lat: number, properties: JSON}>}
          */
        this.treepoints = [];

        // ####################### DOT MAP ONLY
        /**
          * Holds the points for each Aesthethic object.
          * @type {Array<Array<number>>}
          */
        this.tempAestheticPoints = new Array();

        // ####################### ALL MAPS
        /**
         * Aesthetic objects that were saved.
         * @type {Array<Aesthetic>}
         */
        this.aesthetics = new Array();
        /**
         * JSON object with the geometry that was read from the file.
         * @type {JSON}
         */
        this.geometry = geometry;
        /**
         * This map unique identifier.
         * @type {number}
         */
        this.id = window.mapcount++;

        /**
         * KdTree object to hold that will be used to calculate the closest point to the coordinates where the user made a click.
         * @type {kdTree}
         * @see Diogo's thesis Page 61.
         * @see https://github.com/ubilabs/kd-tree-javascript
         */
        this.kdtree = undefined;
        /**
         * RBush(Rtree implementation) that is used to calculate the polygon closest to the coordinates where the user made a click.
         * @type {PolygonLookup}
         * @see Diogo's thesis page 61.
         * @see https://github.com/pelias/polygon-lookup
         * @see https://github.com/mourner/rbush
         */
        this.rtree = undefined;
        /**
         * Polygons do/do not exist. This is used to know if it to create a rtree or not on buildTrees method.
         * @type {boolean}
         */
        this.hasPolygons = false;

        /**
         * This is the maixmum value found on the dataset. The final value for the break. E.g. [2, 37[ 37 is the max. 
         * Used for PSymbol Map and Change Map because on those maps it's important to take in consideration this values to define the Feature color.
         * @see Diogo's thesis page 63 5.1.3 
         * @type {number}
         */
        this.max = null;
        /**
         * This is the minimum value found on the dataset. The initial value for the break. E.g. [2, 37[ 2 is the min.
         * Used for PSymbol Map and Change Map because on those maps it's important to take in consideration this values to define the Feature color.
         * @see Diogo's thesis page 63 5.1.3
         * @type {number}
         */
        this.min = null;
    }

    /**
     * M1) Loads user and default options. For each case if it isn't provided by the user, then it uses
     * the default option. 1st method to be called.
     * @param {Object} userOptions - Options given by the user. 
     * @param {Object} bgmap  - The background map provider.
     */
    loadOptions(userOptions, bgmap) {
        /**
         * All the options available in the Gisplay API.
         * @type {GisplayOptions}
         */
        this.gisplayOptions = new GisplayOptions(userOptions);

        /**
         * This is the Gisplay API Background map wrapper. It contains the background map provider object to access it's methods (zoom, coordinates,etc).
         * This map(Gisplay Map) will  be drawn over the background map(bGMap).
         * @type {BGMapWrapper}
         */
        this.bGMap = bgmap;
        if (this.gisplayOptions.showLoader)
            this.showLoader();
    }

    /**
     * M2) Calls the Background Map Wrapper to create the loader to be used later when the user feeds data to the API.
     * @deprecated Not used anymore
     */
    showLoader() {
        this.bGMap.showLoader();
    }

    /**
     * M3) Initializes the API by: creating canvas, the WebGL program and setting up all needed events.
     * @return {void}
     */
    initializeCanvasAndEvents() {
        this.createCanvas();
        WebGLUtils.createWebGLProgram(this._webgl);
        this.setupEvents(this.id);
    }

    /**
     * M4) Creates a canvas element and WebGL associated information.
     */
    createCanvas() {
        const canvas = this.bGMap.createCanvas(this.id);

        /**
         * @type {Object} _webgl - WebGL object.  Init webgl properties
         * @property  {WebGLRenderingContext} _webgl.gl - The WebGLRenderingContext to be used.
         * @property  {WebGLProgram} _webgl.program -  The WebGLProgram to be used. 
         * @property  {Float32Array} _webgl.projection - The projection to be used. Deprecated in favor of better projection to work with multiple map background providers.
         * @see Diogo's thesis page 64+
         */
        this._webgl = {
            gl: null,
            program: null
        };

        this._webgl.gl = canvas.getContext("webgl");
        window.canvas = canvas;
        this._webgl.gl.viewport(0, 0, this.bGMap.getContainer().offsetWidth, this.bGMap.getContainer().offsetHeight);
        this._webgl.gl.disable(this._webgl.gl.DEPTH_TEST);
    }

    /**
     * M8) Setup all events used by the API. Right now the API uses: drag, zoom and click events. 
     * This events will be fired by the background map provider and we can use them to draw(zoom and pan) or alert information(click).
     * Pan/Zoom = move, click = click
     * rtree will be used to find the closest polygon to the where the clicked event happened.
     * kdtree will be used to find the closest point to where the click event happened.
     * @todo This method is doing uneccessary job if the user set interative to false and mapOnClickFunction is undefined.
     * @param {number} mappos - This map id. 
     * @return {void}
     * @see https://www.mapbox.com/mapbox-gl-js/api/#events
     * @see http://stackoverflow.com/a/34349737
     */
    setupEvents(mappos) {
        /*if(!this.gisplayOptions.interactive && this.gisplayOptions.mapOnClickFunction === undefined)
            return;*/
        this.bGMap.addPanEvent(() => this.draw());
        this.bGMap.addZoomEvent(() => this.draw());
        this.bGMap.addClickEvent(this);
    }

    /**
     * To be called when the user clicks on the map.
     * @param {number} lng - Longitude of the click event. 
     * @param {number} lat - Latitude of the click event.
     * @memberOf Map
     */
    clickEvent(lng, lat) {
        /**
         * When dealing with polygons rtree will be used.
         * @see Diogo's thesis Page 62
         */
        if (this.rtree !== undefined)
            this.searchRTree(lng, lat);

        /**
         * When dealing with points kdtree will be used.
         * @see Diogo's thesis page 62
         */
        if (this.kdtree !== undefined)
            this.searchKdTree(lng, lat);
    }

    /**
     * Search the rtree for the closest polygon from the lng, lat that was clicked.
     * @param {number} lng - The longitude of the click.
     * @param {number} lat - The latitude of the click.
     * @returns {void}
     * @memberOf Map
     */
    searchRTree(lng, lat) {
        let rtreeSearchResult = this.rtree.search(lng, lat);
        if (rtreeSearchResult === undefined)
            return;
        else {
            let res = "";
            let showPrtOnClick = this.gisplayOptions.showPropertiesOnClick;
            if (showPrtOnClick !== null) {
                for (let i = 0; i < showPrtOnClick.length; i += 2) {
                    if (i === 0)
                        res += `${showPrtOnClick[i + 1]}: ${rtreeSearchResult.properties[showPrtOnClick[i]]}`;
                    else
                        res += `\n${showPrtOnClick[i + 1]}: ${rtreeSearchResult.properties[showPrtOnClick[i]]}`;
                }
            }
            else {
                let keys = Object.keys(rtreeSearchResult.properties);
                for (let [i, key] of keys.entries())
                    if (key !== "_gisplayid")
                        i == 0 ? res += `${key}: ${rtreeSearchResult.properties[key]}` : res += `\n${key}: ${rtreeSearchResult.properties[key]}`;
            }

            if (this.gisplayOptions.interactive)
                alert(res);//todo
            if (this.gisplayOptions.mapOnClickFunction !== undefined)
                this.gisplayOptions.mapOnClickFunction(rtreeSearchResult);
        }
    }

    /**
     * Search the rtree for the closest point from the lng, lat that was clicked. 
     * @param {number} lon - The longitude of the click.
     * @param {number} lat - The latitude of the click.
     * @returns {void}
     * @memberOf Map
     */
    searchKdTree(lon, lat) {
        let nearest = this.kdtree.nearest({ lon, lat }, 1, 128 / ((2 ** (this.bGMap.getZoom() * 2))));
        if (nearest.length <= 0)
            return;
        else {
            let kdTreeSearchResult = nearest[0][0];
            let res = "";
            let showPrtOnClick = this.gisplayOptions.showPropertiesOnClick;
            if (showPrtOnClick !== null) { //TODO: Remove if dentro do for e passar a começar no i=1 e passar o if para antes do for
                for (let i = 0; i < showPrtOnClick.length; i += 2) {
                    if (i === 0)
                        res += `${showPrtOnClick[i + 1]}: ${kdTreeSearchResult.properties[showPrtOnClick[i]]}`;
                    else
                        res += `\n${showPrtOnClick[i + 1]}: ${kdTreeSearchResult.properties[showPrtOnClick[i]]}`;
                }
            }
            else {
                let keys = Object.keys(kdTreeSearchResult.properties);
                for (let [i, key] of keys.entries())
                    if (key !== "_gisplayid")
                        i == 0 ? res += `${key}: ${kdTreeSearchResult.properties[key]}` : res += `\n${key}: ${kdTreeSearchResult.properties[key]}`;
            }

            if (this.gisplayOptions.interactive)
                alert(res);
            if (this.gisplayOptions.mapOnClickFunction !== undefined)
                this.gisplayOptions.mapOnClickFunction(kdTreeSearchResult);
        }
    }

    /** ########################   METHOD from Gisplay.js    ######################## */
    /**
     * M9) Method that executes all the process associated with the creation of the thematic map.
     * @memberOf Map
     */
    makeMap() {
        let opts = this.gisplayOptions;
        setTimeout(() => { //TODO: Remove setTimeout(it is only here to allo the loader to appear)
            if (opts.numberOfClasses === undefined)
                opts.numberOfClasses = this.defaults().numberOfClasses;
            this.preProcessData(this.geometry, opts.numberOfClasses, opts.classBreaksMethod, opts.colorScheme);

            this.loadGeoJSON(this.geometry);
            this.draw();

            if (opts.showLegend)
                this.buildLegend();
            if (opts.showLoader) //@TODO: Change this if to be the 1st thing done inside the setTimeout
                this.showLoader();
        }, 1);
    }

    /**
     * M11) Creates Aesthetic objects. If there's the need to calculate the class intervals,
     * the method calcClassBreaks is called 
     * @param {JSON} geojson - GeoJSON object.
     * @param {number} numberOfClasses - Number of classes that the Legend will contain.
     * @param {string} classBreaksMethod - Algorithm to be used to calculate class breaks. Only used it class breaks are not given by the user.
     * @param {string[]} colorScheme - Color scheme to be used by this map.
     * @memberOf Map
     */
    preProcessData(geojson, numberOfClasses, classBreaksMethod, colorScheme) {
        /**
         * @type {Array<Aesthetic>}
         */
        const aesarray = []; //Array of aesthetic objects loaded from the file
        const numberValues = []; //The attr is a number
        const stringValues = []; //The attr is a string
        let classBreaks; //Class Breaks given by the user or calculated by the API
        let fcolor; //Fill Colors to be used
        let opts = this.gisplayOptions; //Options given by the user and defaults

        let geoJsonFeaturesLength = geojson.features.length;
        for (let i = 0; i < geoJsonFeaturesLength && (i < opts.maxFeatures); i++) { //@TODO?: Two fors one if attr is a string another if it a number
            let attrValue = geojson.features[i].properties[opts.attr];
            if (attrValue !== null && typeof attrValue === 'number') { //If "f3" exists and its a number
                numberValues.push(attrValue);
                this.max = Math.max(this.max, attrValue);
                this.min = Math.min(this.min, attrValue);
            }
            else if (!stringValues.includes(attrValue)) //If its a string
                stringValues.push(geojson.features[i].properties[opts.attr]);
        }

        if (numberValues.length > 0) { //Quantitative
            if (opts.classBreaks === undefined) { //Not given by the user then calculate them
                if (numberOfClasses > 1)
                    classBreaks = this.calcClassBreaks(numberValues, classBreaksMethod, numberOfClasses);
                else
                    classBreaks = [this.min, this.max]; //Change Map
            }
            else //Given by the user
                classBreaks = opts.classBreaks;

            if (classBreaks.length > 2) {
                if (colorScheme !== undefined)
                    fcolor = chroma.scale(colorScheme).colors(classBreaks.length - 1);
                else
                    fcolor = this.getDefaultColors(classBreaks.length - 1);//chroma.scale(colorscheme).colors(classBreaks.length);

                for (let i = 0; i < classBreaks.length - 1; i++) {
                    let [r, g, b] = chroma(fcolor[i]).rgb(); // let color = chroma(fcolor[i]).rgb();
                    let aes;
                    if (i !== classBreaks.length - 2)
                        aes = new Aesthetic(i, opts.attr, [Math.round(r), Math.round(g), Math.round(b), opts.alpha], [0, 0, 0, 1], null, [classBreaks[i], classBreaks[i + 1]]);
                    else {
                        aes = new Aesthetic(i, opts.attr, [Math.round(r), Math.round(g), Math.round(b), opts.alpha], [0, 0, 0, 1], null, [classBreaks[i], classBreaks[i + 1]]);
                        aes.outer = true;
                    }
                    aesarray.push(aes);
                }
            }
            else {
                colorScheme = this.getDefaultColors(classBreaks.length);
                let [r, g, b] = chroma(colorScheme[0]).rgb();// let color = chroma(colorscheme[0]).rgb();
                let aes = new Aesthetic(0, opts.attr, [Math.round(r), Math.round(g), Math.round(b), opts.alpha], [0, 0, 0, 1], null, [classBreaks[0], classBreaks[1]]);
                aes.outer = true;
                aesarray.push(aes);
            }
        }
        else { //Qualitative
            if (stringValues.length > 0) {
                classBreaks = stringValues;
                if (colorScheme !== undefined)//User defined colorScheme
                    fcolor = chroma.scale(colorScheme).colors(classBreaks.length);
                else
                    fcolor = this.getDefaultColors(classBreaks.length, 'Qualitative');//chroma.scale(colorscheme).colors(classBreaks.length);

                for (let i = 0; i < classBreaks.length; i++) {
                    let [r, g, b] = chroma(fcolor[i]).rgb();// let color = chroma(fcolor[i]).rgb();
                    let aes = new Aesthetic(i, opts.attr, [Math.round(r), Math.round(g), Math.round(b), 1], [0, 0, 0, 1], null, [stringValues[i]]);
                    aesarray.push(aes);
                }
            }
        }

        /**
         * All the Aesthetics that were read from the GeoJSON file.
         * @type {Array<Aesthetic>}
         */
        this.aesthetics = aesarray;
    }

    /**
     * M12) Calculates the class breaks using the algorithm given(k-means, quantile or equidistant). 
     * There will be as many class breaks as number of classes(numberOfClasses) given as input. 
     * @param {number[]} numberValues - The data values that will be used to be compute the breaks. 
     * @param {string} classBreakMethod - The algorithm to use to calculate the class breaks.
     * @param {number} numberOfClasses - Number of classes the result expects.
     * @returns {number[]} - The class breaks resulting from the use of the given algorithm and the number of classes.
     * @see http://gka.github.io/chroma.js/#chroma-limits
     * @memberOf Map
     */
    calcClassBreaks(numberValues, classBreakMethod, numberOfClasses) {
        let classBreaks;
        switch (classBreakMethod) {
            case 'equidistant':
                classBreaks = chroma.limits(numberValues, 'e', numberOfClasses);
                break;

            case 'quantile':
                classBreaks = chroma.limits(numberValues, 'q', numberOfClasses);
                break;

            case 'k-means':
                classBreaks = chroma.limits(numberValues, 'k', numberOfClasses);
                break;

            default:
                classBreaks = chroma.limits(numberValues, 'q', numberOfClasses);
                break;
        }
        return classBreaks;
    }

    /**
     * M13) Loads GeoJSON object that came from the file uploaded by the user. 
     * Extracts the Features present in the geometry object and inserts them in Aesthetic object(s)
     * This method will create and insert features to Aesthetic objects and build trees of relationships between points or polygons.
     * @param {JSON} geojson - GeoJSON read from the file.
     * @see https://www.dashingd3js.com/lessons/geojson
     * @memberOf Map
     */
    loadGeoJSON(geojson) {
        for (let i = 0; i < geojson.features.length && (this.gisplayOptions.maxFeatures === undefined || i < this.gisplayOptions.maxFeatures); i++) {
            geojson.features[i].properties['_gisplayid'] = i;
            const geometry = geojson.features[i].geometry;
            const properties = geojson.features[i].properties;
            this.createAndInsertFeature(i, geometry, properties);
        }
        this.buildTrees(geojson); //@TODO: Only call this method if it's a low end device aka options.memorySaver is on
    }

    /**
     * M14) Creates a Feature and then calls a method to insert said Feature in one or more Aesthetic objects.
     * @param {number} featureId - Id of the Feature.
     * @param {JSON} geometry - GeoJSON Geometry Object. 
     * @param {JSON} properties - GeoJSON properties Object.
     * @see http://geojson.org/geojson-spec.html#geometry-objects
     * @memberOf Map
     */
    createAndInsertFeature(featureId, geometry, properties) {
        const gl = this._webgl.gl;
        /**
         * @type {GisplayOptions}
         */
        let opts = this.gisplayOptions;
        if (opts.minuend !== undefined && opts.subtrahend !== undefined
            && typeof properties[opts.minuend] === 'number' && typeof properties[opts.subtrahend] === 'number'
            && properties[opts.minuend] !== undefined && properties[opts.subtrahend] !== undefined) {
            properties[opts.attr] = properties[opts.minuend] - properties[opts.subtrahend]; //Used for Change map
        }

        //let isPoint = geometry.type == "Point";
        if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
            this.hasPolygons = true;
            const polygons = this.processPolygon({ geometry, properties });

            const currentTriangles = []; //Polygon Triangles vertices
            const bufferT = []; //WebGL Buffers with  triangles
            const currentBorders = []; //Polygon Borders vertices
            const bufferB = []; //Buffer borders

            for (let i = 0; i < polygons.length; i++) { //For each Polygon
                const trianglesPolygon = polygons[i].triangles;
                const border = polygons[i].vertices;
                currentTriangles[i] = new Array(); //Add This Polygon triangles
                currentBorders[i] = new Array(); //Add this Polygon borders

                for (let j = 0; j < trianglesPolygon.length; j++) { //Triangles
                    currentTriangles[i].push(border[trianglesPolygon[j] * 2], border[trianglesPolygon[j] * 2 + 1]);

                    if (j === trianglesPolygon.length - 1) {
                        bufferT.push(gl.createBuffer());

                        let vertArray = new Float32Array(currentTriangles[i]);
                        gl.fsize = vertArray.BYTES_PER_ELEMENT;
                        gl.bindBuffer(gl.ARRAY_BUFFER, bufferT[i]);
                        gl.bufferData(gl.ARRAY_BUFFER, vertArray, gl.STATIC_DRAW);

                        bufferT[i].itemSize = 2;
                        bufferT[i].numItems = vertArray.length / 2;
                    }
                }

                for (let k = 0; k < border.length; k += 2) { //Borders
                    currentBorders[i].push(border[k], border[k + 1]);

                    if (k === border.length - 2) {
                        bufferB.push(gl.createBuffer());

                        let vertArray = new Float32Array(currentBorders[i]);
                        gl.fsize = vertArray.BYTES_PER_ELEMENT;
                        gl.bindBuffer(gl.ARRAY_BUFFER, bufferB[i]);
                        gl.bufferData(gl.ARRAY_BUFFER, vertArray, gl.STATIC_DRAW);

                        bufferB[i].itemSize = 2;
                        bufferB[i].numItems = vertArray.length / 2;
                    }
                }
            }
            this.insertFeature(featureId, properties, bufferT, bufferB, []);
        }

        else if (geometry.type === "Point" && opts.isDynamic) {
            const currentPoints = new Array();
            currentPoints.push(geometry.coordinates[0], geometry.coordinates[1]);
            const bufferPoints = [];//Buffer points
            let vertArray = new Float32Array(currentPoints);

            bufferPoints.push(gl.createBuffer());
            gl.fsize = vertArray.BYTES_PER_ELEMENT;
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferPoints[0]);
            gl.bufferData(gl.ARRAY_BUFFER, vertArray, gl.STATIC_DRAW);

            bufferPoints[0].itemSize = 2;
            bufferPoints[0].numItems = vertArray.length / 2;

            this.insertFeature(featureId, properties, [], [], bufferPoints);
            this.treepoints.push({ lon: geometry.coordinates[0], lat: geometry.coordinates[1], properties });
        }

        else if (geometry.type === "Point" && !opts.isDynamic) {
            if (this.tempAestheticPoints.length === 0)
                for (let i = 0; i < this.aesthetics.length; i++)
                    this.tempAestheticPoints[i] = [];

            const aesPositions = this.fitFeature(properties);
            for (const aesPos of aesPositions)
                this.tempAestheticPoints[aesPos].push(geometry.coordinates[0], geometry.coordinates[1]);

            this.treepoints.push({ lon: geometry.coordinates[0], lat: geometry.coordinates[1], properties });
        }
    }

    /**
     * M15) Deals with polygon triangulation.
     * @param {{geometry: JSON, properties: JSON}} polygon - The geometry and properties of the polygon.
     * @returns {{triangles: Array<number>, vertices: Array<number>}} - The triangles and vertices calculated by earcut triangulation. The vertices are the outside of the polygon, the triangles are the inside.
     * @see http://www.macwright.org/2015/03/23/geojson-second-bite.html#polygons
     * @memberOf Map
     */
    processPolygon(polygon) {
        let polyarray = [];
        if (polygon.geometry.type === "Polygon") { //@TODO: [Demos never use this if statement.]
            let outsidepolygon = polygon.geometry.coordinates[0]; //See: http://geojson.org/geojson-spec.html#polygon
            let tempVerts = new Array();
            for (let out = 0; out < outsidepolygon.length - 1; out++)
                tempVerts.push(outsidepolygon[out][0], outsidepolygon[out][1]);//_vertexcount += (outsidepolygon.length + 1) / 2;
            let triangles_vert = earcut(tempVerts); // _tricount += (triangles_vert.length / 3);
            polyarray.push({ triangles: triangles_vert, vertices: tempVerts });
        }
        else if (polygon.geometry.type == "MultiPolygon") { //See http://geojson.org/geojson-spec.html#multipolygon
            for (const cs of polygon.geometry.coordinates) {
                let outsidepolygon = cs[0];
                let tempVerts = new Array();
                for (const c of outsidepolygon)
                    tempVerts.push(c[0], c[1]);
                let triangles_vert = earcut(tempVerts);
                polyarray.push({ triangles: triangles_vert, vertices: tempVerts });
            }
        }
        return polyarray;
    }

    /**
     * M16) Converts geographic coordinates(latitude, longitude) to canvas coordinate pixels.
     * @param {number} longitude - The longitude.
     * @param {number} latitude - The latitude.
     * @returns {x: number, y: number} - canvas coordinate system pixels.
     * @see http://gisgeography.com/latitude-longitude-coordinates/
     * @see https://www.w3schools.com/graphics/canvas_coordinates.asp
     * @deprecated Not used anymore. YEAH...
     * @memberOf Map
     */
    latLongToPixelXY(longitude, latitude) {
        const pi_180 = Math.PI / 180.0;
        const pi_4 = Math.PI * 4;
        const sinLatitude = Math.sin(latitude * pi_180);
        const pixelY = (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (pi_4)) * 256;
        const pixelX = ((longitude + 180) / 360) * 256;

        const pixel = { x: pixelX, y: pixelY };
        return pixel;
    }

    /**
     * M17) Inserts the Feature into one or more Aesthetic objects. If the Feature does not fit in any Aesthetic then does nothing.
     * @param {number} id - The Feature id. 
     * @param {JSON} properties - The Feature properties. 
     * @param {{itemSize: number, numItems: number}} triangles - Triangles, each in one WebGLBuffer.
     * @param {{itemSize: number, numItems: number}} borders - Borders, each in one WebGLBuffer.
     * @param {{itemSize: number, numItems: number}} points - Points, each in one WebGLBuffer.
     * @return {void}
     * @memberOf Map
     */
    insertFeature(id, properties, triangles, borders, points) {
        for (const aes of this.aesthetics)
            if (aes.checkProperty(properties[aes.getAttr()]))
                aes.addFeature(id, properties, triangles, borders, points);
        /* for (let i = 0; i < this.aesthetics.length; i++)
             if (this.aesthetics[i].checkProperty(properties[this.aesthetics[i].getAttr()]))
                 this.aesthetics[i].addFeature(id, properties, triangles, borders, points);*/
    }

    /**
     * M18) Returns an array of Aesthetic ids that tells us the objects where the Feature belongs.
     * @param {JSON} properties - The Feature properties
     * @returns {Array<number>} - The Aesthetic ids where the Feature belongs.
     * @memberOf Map
     */
    fitFeature(properties) {
        const res = [];
        for (let i = 0; i < this.aesthetics.length; i++)
            if (this.aesthetics[i].checkProperty(properties[this.aesthetics[i].getAttr()]))
                res.push(i);
        return res;
    }

    /**
     * M19) Receives the dataset as parameter. This dataset in each row contains geometry and associated properties, then it creates one tree
     * either for points or polygons. This tree can be k-d Treee or RBush(RTree)
     * @param {JSON} geojson 
     * @return {void}
     * @see Diogo's thesis page 62
     * @memberOf Map
     */
    buildTrees(geojson) {
        const gl = this._webgl.gl;
        if (this.tempAestheticPoints.length > 0) {
            for (let i = 0; i < this.tempAestheticPoints.length; i++) {
                if (this.tempAestheticPoints[i].length > 0) {
                    const vertArray = new Float32Array(this.tempAestheticPoints[i]);
                    const bufferP = [];
                    bufferP.push(gl.createBuffer());

                    gl.fsize = vertArray.BYTES_PER_ELEMENT;
                    gl.bindBuffer(gl.ARRAY_BUFFER, bufferP[0]);
                    gl.bufferData(gl.ARRAY_BUFFER, vertArray, gl.STATIC_DRAW);
                    bufferP[0].itemSize = 2;
                    bufferP[0].numItems = vertArray.length / 2;
                    this.insertGroupedFeature(i, [], [], bufferP);
                }
            }
        }
        if (this.treepoints !== null)
            this.kdtree = new kdTree(this.treepoints, (a, b) => (a.lon - b.lon) ** 2 + (a.lat - b.lat) ** 2, ["lon", "lat", "properties"]);
        if (this.hasPolygons)
            this.rtree = new PolygonLookup(geojson);
    }

    /**
     * M20) Similar to insertFeature, in this case inserts a group of Features like it was only one.
     * It creates one WebGLBuffer with all the points instead of one WebGLBuffer per point.
     * This method should only be used when we already grouped the Features by Aesthetic class (fitFeature() method).
     * This method exists to provide one alternative less expensive in terms of memory for low end devices.
     * Used only on Dot Map because on those we can easily end up with millions of different Features.
     * @param {number} id - Aesthethics id. 
     * @param {{itemSize: number, numItems: number}} triangles - Not used ?
     * @param {{itemSize: number, numItems: number}} borders - Not used ?
     * @param {{itemSize: number, numItems: number}} points - All the points for the Aesthethic object in one WebGLBuffer.
     * @memberOf Map
     */
    insertGroupedFeature(id, triangles, borders, points) {
        this.aesthetics[id].addGroupedFeature(null, triangles, borders, points);
    }

    /** ########################    LEGEND METHODS    ######################## */
    /**
     * M17) Creates a Legend element suitable for polygons based on the Aesthethic objects.
     * Should be overriden by subclasses.
     * @return {void}
     * @abstract
     * @memberOf Map
     */
    buildLegend() {
        const mapCanvas = document.getElementById(`mapCanvas${this.id}`);
        const legendDiv = document.createElement('div');
        legendDiv.id = `legendDiv${this.id}`;
        legendDiv.style.position = 'absolute';
        legendDiv.style.backgroundColor = 'white';
        legendDiv.style.width = 250;
        legendDiv.style.bottom = 20;
        legendDiv.style.right = 0;
        legendDiv.style.borderColor = 'black';
        legendDiv.style.border = 'solid';

        const table = document.createElement('table');
        const thvalue = document.createElement('th');
        const thcolor = document.createElement('th');
        table.style.zIndex = "2000";
        thcolor.style.width = 100;
        table.appendChild(thcolor);
        table.appendChild(thvalue);

        for (const currentaes of this.aesthetics) {
            const row = document.createElement('tr');
            const value = document.createElement('td');
            const color = document.createElement('td');
            const ptext = document.createElement('p');
            let text;
            if (typeof currentaes.range[0] === 'number')
                text = document.createTextNode(`[${currentaes.range[0]}, ${currentaes.range[1]}[`);
            else
                text = document.createTextNode(currentaes.range[0]);
            ptext.appendChild(text);
            value.appendChild(ptext);

            const colorDiv = document.createElement('div');
            colorDiv.style.position = 'relative';
            const rgbc = `rgba(${currentaes.fillColor[0]},${currentaes.fillColor[1]},${currentaes.fillColor[2]},${currentaes.fillColor[3]})`;
            colorDiv.style['backgroundColor'] = rgbc;
            colorDiv.style.height = 25;
            colorDiv.style.width = 80;
            color.appendChild(colorDiv);

            row.appendChild(color);
            row.appendChild(value);
            table.appendChild(row);
        }

        legendDiv.appendChild(table);
        this.bGMap.getContainer().appendChild(legendDiv);
    }

    /** ########################    WEBGL METHODS    ######################## */
    /**
     * M22) Clear current buffers to preset values.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clear
     * @memberOf Map
     */
    clear() {
        const gl = this._webgl.gl;
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.disable(gl.DEPTH_TEST);
    }

    /**
     * M23) Receiving an Aesthetics object, draws the triangles contained in it's Features,
     * using the color that the Aesthethics object has.
     * @param {Aesthetic} aes - The Aesthetic object.
     * @returns {void}
     * @see Diogo's thesis Page 58/59
     * @memberOf Map
     */
    drawTriangles(aes) {
        const gl = this._webgl.gl;
        if (gl === null)
            return;

        const fsize = Float32Array.BYTES_PER_ELEMENT;
        const currentZoom = this.bGMap.getZoom();
        const pointSize = Math.max(currentZoom - 5.0, 1.0);
        const vertexCoordsLocation = gl.getAttribLocation(this._webgl.program, 'coords');
        const vertexSizeLocation = gl.getAttribLocation(this._webgl.program, 'aPointSize');
        const fragmentColorLocation = gl.getUniformLocation(this._webgl.program, "u_color");
        const isPointLocation = gl.getUniformLocation(this._webgl.program, 'isPoint');
        let [r, g, b, a] = aes.getFillColor();

        this.setMatrices(gl);
        gl.vertexAttrib1f(vertexSizeLocation, pointSize);
        gl.uniform1f(isPointLocation, 0.0);
        gl.uniform4f(fragmentColorLocation, r / 255, g / 255, b / 255, a);// Draw Polygons' Interior

        let features = aes.getFeatures();
        for (const f of features) { // Draw Polygons' Interior
            let triangles = f.getTriangles();
            for (const t of triangles) {
                gl.bindBuffer(gl.ARRAY_BUFFER, t);
                gl.enableVertexAttribArray(vertexCoordsLocation);
                gl.vertexAttribPointer(vertexCoordsLocation, 2, gl.FLOAT, false, fsize * 2, 0);
                gl.drawArrays(gl.TRIANGLES, 0, t.numItems);
            }
        }
    }

    /**
     * M24) Receiving an Aesthetics object, draws the borders contained in it's Features, 
     * aplying the color specified in the Aeshteic object for the line color(Aeshteic.strokeColor).
     * @param {Aesthetic} aes - The Aesthetic object.
     * @returns {void}
     * @memberOf Map
     */
    drawBorders(aes) {
        const gl = this._webgl.gl;
        if (gl === null)
            return;

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        const fsize = Float32Array.BYTES_PER_ELEMENT;
        const currentZoom = this.bGMap.getZoom();
        const pointSize = Math.max(currentZoom - 5.0, 1.0);
        const vertexCoordsLocation = gl.getAttribLocation(this._webgl.program, 'coords');
        const vertexSizeLocation = gl.getAttribLocation(this._webgl.program, 'aPointSize');
        const fragmentColorLocation = gl.getUniformLocation(this._webgl.program, "u_color");
        const isPointLocation = gl.getUniformLocation(this._webgl.program, 'isPoint');
        let [r, g, b, a] = aes.getStrokeColor();

        this.setMatrices(gl);
        gl.vertexAttrib1f(vertexSizeLocation, pointSize);
        gl.uniform1f(isPointLocation, 0.0);
        gl.uniform4f(fragmentColorLocation, r / 255, g / 255, b / 255, a);

        let features = aes.getFeatures();
        for (const f of features) {
            let borders = f.getBorders();
            for (const b of borders) {
                gl.bindBuffer(gl.ARRAY_BUFFER, b);
                gl.enableVertexAttribArray(vertexCoordsLocation);
                gl.vertexAttribPointer(vertexCoordsLocation, 2, gl.FLOAT, false, fsize * 2, 0);
                gl.drawArrays(gl.LINE_LOOP, 0, b.numItems);
            }
        }
    }

    /**
     * M26) Receiving an Aesthetics object, draws the points contained in it's Features, 
     * aplying the values specified in that Aesthetic object visual variables (color and size).
     * @param {Aesthetic} aes - The Aesthetic object.
     * @returns {void}
     * @memberOf Map
     */
    drawPoints(aes) {
        const gl = this._webgl.gl;
        if (gl === null)
            return;

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        const fsize = Float32Array.BYTES_PER_ELEMENT;
        const currentZoom = this.bGMap.getZoom();
        const pointSize = Math.max(currentZoom - 4.0 + aes.getPointSize(), aes.getPointSize());
        const vertexCoordsLocation = gl.getAttribLocation(this._webgl.program, 'coords');
        const vertexSizeLocation = gl.getAttribLocation(this._webgl.program, 'aPointSize');
        const fragmentColorLocation = gl.getUniformLocation(this._webgl.program, "u_color");
        const isPointLocation = gl.getUniformLocation(this._webgl.program, 'isPoint');
        let [r, g, b, a] = aes.getFillColor();

        this.setMatrices(gl); //Set M1, M2 and M3
        gl.vertexAttrib1f(vertexSizeLocation, pointSize);
        gl.uniform1f(isPointLocation, 1.0);
        gl.uniform4f(fragmentColorLocation, r / 255, g / 255, b / 255, a);

        let features = aes.getFeatures();
        let allFeatures = aes.getAllFeatures();
        if (this.gisplayOptions.isDynamic && aes.getFeatures().length > 0) {
            for (const f of features) {
                let points = f.getPoints();
                for (const p of points) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, p);
                    gl.enableVertexAttribArray(vertexCoordsLocation);
                    gl.vertexAttribPointer(vertexCoordsLocation, 2, gl.FLOAT, false, fsize * 2, 0);
                    gl.drawArrays(gl.POINTS, 0, p.numItems);
                }
            }
        }
        else if (allFeatures !== null && !this.gisplayOptions.isDynamic) {
            for (const allF of allFeatures) {
                let points = allF.getPoints();
                for (const p of points) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, p);
                    gl.enableVertexAttribArray(vertexCoordsLocation);
                    gl.vertexAttribPointer(vertexCoordsLocation, 2, gl.FLOAT, false, fsize * 2, 0);
                    gl.drawArrays(gl.POINTS, 0, p.numItems);
                }
            }
        }
    }

    /**
     * M27) Receiving an Aesthetics object, draws the points contained in it's Features, 
     * aplying the color specified in the Aeshteic object for the line color(Aeshteic.strokeColor) 
     * and the size of the point is based on the attribute value and the specified limits.
     * @param {Aesthetic} aes - The Aesthetic object. 
     * @returns {void} 
     * @memberOf Map
     */
    drawProportionalPoints(aes) {
        const gl = this._webgl.gl;
        if (gl === null)
            return;

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        const currentZoom = this.bGMap.getZoom();
        const vertexCoordsLocation = gl.getAttribLocation(this._webgl.program, 'coords');
        const vertexSizeLocation = gl.getAttribLocation(this._webgl.program, 'aPointSize');
        const fragmentColorLocation = gl.getUniformLocation(this._webgl.program, "u_color");
        const isPointLocation = gl.getUniformLocation(this._webgl.program, 'isPoint');
        let [r, g, b] = aes.getFillColor();

        this.setMatrices(gl);
        gl.uniform1f(isPointLocation, 1.0);
        gl.uniform4f(fragmentColorLocation, r / 255, g / 255, b / 255, this.gisplayOptions.alpha); //TODO: Para 2.5D usar alpha a 0?

        const fsize = Float32Array.BYTES_PER_ELEMENT;
        let opts = this.gisplayOptions;
        if (this.gisplayOptions.isDynamic) {
            let features = aes.getFeatures();
            for (const f of features) {
                const propvalue = parseFloat(f.getProperties()[opts.attr]);
                const temppointsize = ((opts.maxPointSize - opts.minPointSize) / (this.max - this.min)) * (propvalue - this.min);
                const pointSize = Math.max(currentZoom - 4.0 + temppointsize * currentZoom / 4, 2);

                let points = f.getPoints();
                for (let p of points) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, p);
                    gl.vertexAttrib1f(vertexSizeLocation, pointSize);
                    gl.enableVertexAttribArray(vertexCoordsLocation);
                    gl.vertexAttribPointer(vertexCoordsLocation, 2, gl.FLOAT, false, fsize * 2, 0);
                    gl.drawArrays(gl.POINTS, 0, p.numItems);
                }
            }
        }
    }

    /**
     * This method will set all matrices needed to compute each point/vertex position. This will use the 
     * Before sending the matrix to webGL we change the last column transformation in X and Y to the last row X and Y 
     * because WebGL is column major. See MMatrix[6] =...
     * @memberOf Map
     */
    setMatrices(gl) {
        let lngCenter = this.bGMap.getCenterLng();
        let latCenter = this.bGMap.getCenterLat();
        let zoom = this.bGMap.getZoom();
        let tileSize = this.gisplayOptions.tileSize;
        let width = this.bGMap.getWidth();
        let height = this.bGMap.getHeight();
        let mercator = WebGLUtils.webMercatorProjection(lngCenter, latCenter, zoom, tileSize, width, height);

        let MMatrix = WebGLUtils.finalMatrix(mercator.scale, width, height, mercator.offsetX, mercator.offsetY);
        const Mloc = gl.getUniformLocation(this._webgl.program, 'M')
        gl.uniformMatrix3fv(Mloc, false, MMatrix);
    }

    /** ########################    ABSTRACT METHODS    ######################## */
    /**
     * M21) Draw map function. Must be overriden by subclasses.
     * @abstract 
     */
    draw() {
        throw new Error("Draw must be implemented by subclass.");
    }

    /**
     * M10) Defaults for each map. Subclasses should override this method.
     * @abstract 
     * @memberOf Map
     */
    defaults() {
        throw new Error("This map has no defaults defined.");
    }

    /**
     * This function should be implemented by any subclass that wants to use another way of processing data.
     * By default it loads GeoJSON but if the user wants to load another type of data it should do so by implementing this method.
     * A function similar to loadGeoJSON should also be implemented
     * @param {Object|JSON} data - Dataset to be used. 
     * TODO: Add static to this method.
     * @abstract
     */
    processData(data) {
        this.loadGeoJSON(geojson);
    }

    /**
     * Returns the colors for this map given the number of classes and the nature of the data (sequential, diverging or qualitative). 
     * @param {number} numClasses - Number of classes. 
     * @param {string} dataNature - Nature of the data.
     * @returns {Array<Array<RGB>>} Default colors for the map given the number of classes and nature of data.
     * @abstract 
     * @memberOf Map
     */
    getDefaultColors(numClasses, dataNature) {
    }
}