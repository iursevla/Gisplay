/**
 * This class will contain all the options available on the Gisplay API.
 * @see Diogo's thesis page 50-52
 */
class GisplayOptions {

    /**
     * Creates a new Options object. User options take precedence over default options.
     * @param {Object} userOptions - The user defined options.
     * @param {string} userOptions.attr -  The attribute to be mapped.
     * @param {string[]} [userOptions.colorScheme] -  The color scheme to be used.
     * @param {number} [userOptions.numberOfClasses] -  Number of classes to be used on the map Legend.
     * @param {string} [userOptions.classBreaksMethod=quantile] -  Algorithm to be used by the API to calculate classes intervals. 
     * @param {number[]} [userOptions.classBreaks=undefined] - Class intervals.
     * @param {boolean} [userOptions.interactive=true] - Show pop-up when the user clicks on a Feature.
     * @param {boolean} [userOptions.showPropertiesOnClick=null] - Show pop-up when the user clicks on a Feature.
     * @param {boolean} [userOptions.showLegend=true] - Show map Legend.
     * @param {string} [userOptions.minuend=undefined] - The minimum property of the GeoJSON feature object.
     * @param {string} [userOptions.subtrahend=undefined] - The property to subtract from minuend.
     * @param {string} [userOptions.legendTitle=this.attr] - Legend title for the Legend.
     * @param {boolean} [userOptions.showLoader=true] - Show loader when loading data.
     * @param {boolean} [userOptions.useCustomMapService=false] - Use custom map service.
     * @param {number} [userOptions.minPointSize=1.0] - Minimum point size.
     * @param {number} [userOptions.maxPointSize=10.0] - Maximum point size.
     * @param {boolean} [userOptions.sizeByClass=false] - Specify the size of the dots on a PSymbols Map using classes.
     * @param {boolean} [userOptions.memorySaver=false] - Save memory on Dot Maps.
     * @param {boolean} [userOptions.colorSchemeId=1] - The color scheme id to use.
     * @param {Function} [userOptions.legendOnClickFunction] - Function to be called when the user clicks on a Legend class.
     * @param {Function} [userOptions.mapOnClickFunction] - Function to be called when the user clicks on the Map (on a Feature).
     * @param {number} [userOptions.alpha=0.8] - Alpha to be used in WebGL.
     * @param {number} [userOptions.maxFeatures=Number.MAX_VALUE] - The max number of features to be displayed.
     * @param {number} [userOptions.numberOfLegendItems=2] - The number of Legend items (Used on PSymbols Map).
     * @param {number} [userOptions.intensity=1] - Intensity for Heat Map.
     * @param {string} [userOptions.legendPosition=br] - The Legend position(br=bottom right).
     * @param {number} [userOptions.legendNumberFormat=0] - Number of decimal numbers to show on the numerical values of the Legend.
     * @param {number} [userOptions.tileSize=256] - Size of each background map tile.
     */
    constructor(userOptions) {
        /**
         * The attribute to be mapped.
         * @see Chapter 4 Page 50 of Diogo's thesis.
         * @type {string} 
         */
        this.attr = userOptions.attr;
        //TODO: Uncoment next line
        //if(!this.attr) throw new Error("Attribute not defined in userOptions, please define one attribute to be mapped");
        /**
         * Array of colors to be used by the API. 
         * @see Chapter 4 Page 50 of Diogo's thesis.
         * @type {string[]}
         */
        this.colorScheme = userOptions.colorScheme;
        /**
         * Number of classes to be used on the map Legend. This option should be used when the user wants the API
         * to calculate the classes (aka ranges) using the given number. Otherwise the API will calculate the appropriate number of classes to use.
         * @type{number}
         */
        this.numberOfClasses = userOptions.numberOfClasses;
        /**
         * Algorithm to be used by the API to calculate classes intervals. 
         * Defaults to quantile if the user does not provide any or if it provides one that isn't on the list of available algorithms.
         * Available options are 'quantile', 'equidistant', 'k-means'.
         * @type {string}
         */
        this.classBreaksMethod = this.getAvailableClassBreaksMethods().indexOf(userOptions.classBreaksMethod) > 0 ? userOptions.classBreaksMethod : 'quantile';
        /**
         * Class intervals. If this is defined then numberOfClasses and classBreakMethod are ignored.
         * @type {number[]}
         */
        this.classBreaks = userOptions.classBreaks; //undefined n era preciso
        /**
         * When we click on a feature that is on the map, show properties of said Feature or not.
         * @type {boolean}
         */
        this.interactive = (userOptions.interactive !== undefined) ? userOptions.interactive : true;
        /**
         * Properties and description to be shown when the user clicks on a Feature.
         * @todo NOT USED? 
         * @type {string[]}
         */
        this.showPropertiesOnClick = userOptions.showPropertiesOnClick || null;
        /**
         * Whether or not to show the map Legend.
         * @type {boolean}
         */
        this.showLegend = (userOptions.showLegend !== undefined) ? userOptions.showLegend : true;
        /**
         * The minimum property of the GeoJSON feature object. Used on Change Map.
         * @type {string}
         */
        this.minuend = userOptions.minuend;
        /**
         * The property of the GeoJSON feature object to subtract from the minimum. Used on Change Map.
         * @type {string}
         */
        this.subtrahend = userOptions.subtrahend;
        /**
         * The title to be used on the Legend. Third option is used for Change Map.
         * @type {string}
         */
        this.legendTitle = userOptions.legendTitle || this.attr || (`${this.minuend} - ${this.subtrahend}`);
        /**
         * Whether to show or not the loader when we the API is loading the needed data.
         * @type {boolean}
         */
        this.showLoader = userOptions.showLoader || true;
        /**
         * True when the user wants to use another background map service than those who are supported by default by the API.
         * If this is true then the user should send the custom map service when creating the new Map. 
         * @type {boolean} 
         */
        this.useCustomMapService = userOptions.useCustomMapService || false;
        /**
         * The minimum size of the points to be drawn on the Map. Will be used on PSymbols and maybe on Dot Map/Heat Map.
         * @type {number}
         */
        this.minPointSize = userOptions.minPointSize === undefined ? 1.0 : parseFloat(userOptions.minPointSize); //N preciso do if no PSymbols?
        /**
         * The maximum size of the points to be drawn on the Map. Will be used on PSymbols. The dot with highest value 
         * on the features will have the size given by the user.
         * @type {number}
         */
        this.maxPointSize = userOptions.maxPointSize === undefined ? 10.0 : parseFloat(userOptions.maxPointSize); //N preciso do if no PSymbols?
        /**
         * If the user wants to specify the size of the dots on a PSymbols Map using classes, this attribute should be true.
         * @type {boolean}
         */
        this.sizeByClass = userOptions.sizeByClass || false;
        /**
         * If false each feature will have it's own WebGLBuffer, otherwise the geometry will be grouped creating one WebGLBuffer by
         * Aesthetic class. As the name implies allows memory saving and with this improves performance in lower end devices. 
         * Only Available/Relevant to Dot Maps.
         * @type {boolean}
         */
        this.memorySaver = userOptions.memorySaver || true;
        /**
         * Function to be called when the user clicks on a Legend class. This function should receive an object of type Aesthetic.
         * @type {Function}
         */
        this.legendOnClickFunction = userOptions.legendOnClickFunction;
        /**
         * Function to be called when the user clicks on the Map (on a Feature). This function should receive an array, which are the Feature properties.
         * @type {Function}
         */
        this.mapOnClickFunction = userOptions.mapOnClickFunction;

        /** #####################       OTHER OPTIONS(Non Described on the Thesis draft)      ############################## */
        /**
         * Alpha to be used in WebGL.
         * 0 means fully transparent <-> 1 fully opaque.
         * @type {number}
         */
        this.alpha = userOptions.alpha || 1.0;
        /**
         * The max number of features to be displayed. If not given by the user then it is the maximum numnber allowed.
         * Number.MAX_VALUE = 1.79E+308
         * @type {number}
         */
        this.maxFeatures = userOptions.maxFeatures || Number.MAX_VALUE;
        /**
         * The number of legend items. Used for PSymbols Map.
         * @type {number}
         */
        this.numberOfLegendItems = userOptions.numberOfLegendItems || 2;
        /**
         * The size of each background map tile. Used by most background map providers is 256.
         * @type {number}
         */
        this.tileSize = userOptions.tileSize || 256;

        /** #####################       OTHER NON-USER DEFINED OPTIONS      ############################## */
        /**
         * If it is dynamic or not. When dynamic is set to true it will join all Features on one Aesthetic class in the same Feature and this way it can draw all elements at once.
         * It's the inverse of the memorySaver value.
         * @type {boolean}
         */
        this.isDynamic = !this.memorySaver;

        /**
         * Enable/Disable Legend toggle.
         * @type {boolean} 
         */
        this.legendToggle = true;

        /** #####################       DEPRECATED ############################## */
        /**
         * Intensity of a heat map. Higher values of intensity means more red in the end color. Otherwise more green.
         * @deprecated Not used ATM, should probably be used for Heat Maps.
         * @type {number}
         */
        this.intensity = userOptions.intensity || 1.0;
        /**
         * The user defined position of the Legend over the map. Allowed positions tl, tr, bl, br.
         * @type {string}
         * @deprecated Currently not in use. Maybe implement later.
         */
        this.legendPosition = userOptions.legendPosition || 'br';
        /**
         * Number of decimal numbers to show on the numerical values of the Legend.
         * @deprecated Currently not in use. Maybe implement later.
         * @type {number}
         */
        this.legendNumberFormat = userOptions.legendNumberFormat || 0;

        /** #####################      OTHER GLOBAL OPTIONS     ############################## */
        this.profiling = userOptions.profiling || true;
    }

    /**
     * Returns the available class break methods.
     * @returns {string[]} - All available class break methods under Gisplay API.
     * @memberOf GisplayOptions
     */
    getAvailableClassBreaksMethods() {
        return ["quantile", "k-means", "equidistant"];
    }
}

class ColorBrewer {

    /**
     * Returns an array with numOfClasses elements that are the colors for the given type of color scheme and it's name.
     * @static
     * @param {string} type - The type of color scheme (Options are: Sequential, Diverging and Qualitative).
     * @param {string} name - Name of the color scheme to search.
     * @param {number} numOfClasses - Number of classes to search.
     * @returns {Array<RGB>} - Array with the colors given by Color Brewer.
     * @memberOf ColorBrewer
     */
    static getColorScheme(type, name, numOfClasses) {
        let colorBrewer = this.getColorBrewerVariable();
        return colorBrewer[type][name][numOfClasses];
    }

    /**
     * Returns all the ColorBrewer diverging color schemes. 
     * @static
     * @returns {Object} - all the ColorBrewer diverging color schemes. 
     * @memberOf ColorBrewer
     */
    static getDivergingColorSchemes() {
        return this.getColorBrewerVariable().Diverging;
    }

    /**
     * Returns all the ColorBrewer qualitative color schemes.
     * @static
     * @returns {Object} - all the ColorBrewer qualitative color schemes.
     * @memberOf ColorBrewer
     */
    static getQualitativeColorSchemes() {
        return this.getColorBrewerVariable().Qualitative;
    }

    /**
     * Returns all the ColorBrewer the sequential color schemes.
     * @static
     * @returns {Object} - all the ColorBrewer sequential color schemes.
     * @memberOf ColorBrewer
     */
    static getSequentialColorSchemes() {
        return this.getColorBrewerVariable().Sequential;
    }

    /**
     * This is just an alias for the method getColorSchemesByName(name).
     * @static
     * @param {string} name 
     * @returns {Object} an object with multiple color schemes for each number of classes associated with the color scheme given as input.
     * @memberOf ColorBrewer
     */
    static byName(name) {
        return this.getColorSchemesByName(name);
    }

    /**
     * Return an object with multiple color schemes for each number of classes associated with the color scheme given as input.
     * @static
     * @param {string} name 
     * @returns {Object} an object with multiple color schemes for each number of classes associated with the color scheme given as input.
     * @memberOf ColorBrewer
     */
    static getColorSchemesByName(name) {
        let colorSchemes = this.getColorBrewerVariable();
        for (const key of Object.keys(colorSchemes))
            if (colorSchemes[key][name])
                return colorSchemes[key][name];
        throw new Error("Name of Color Scheme not found on ColorBrewer list of available colors schemes.");
    }

    /**
     * Returns all ColorSchemes that contain the number of class given as input.
     * @static
     * @param {number} numberOfClasses - number of classes to search for.
     * @returns {Object} - Object with 
     * @memberOf ColorBrewer
     */
    static byNumber(numberOfClasses) {
        return this.getAllColorSchemesByNumberOfClasses(numberOfClasses);
    }

    /**
     * Returns an object of color schemes with only those the objects for the specified number of classes.
     * @static
     * @param {number} numberOfClasses 
     * @returns {Object} - an object of color schemes with only those the objects for the specified number of classes.
     * @memberOf ColorBrewer
     */
    static getAllColorSchemesByNumberOfClasses(numberOfClasses) {
        let colorSchemes = this.getColorBrewerVariable();
        let res = {};
        for (const cs of Object.keys(colorSchemes)) //Create {Diverging: {}, Qualitative: ...}
            res[cs] = {};
        for (const cs of Object.keys(colorSchemes))
            for (const name of Object.keys(colorSchemes[cs]))
                if (colorSchemes[cs][name][numberOfClasses] !== undefined)
                    res[cs][name] = colorSchemes[cs][name][numberOfClasses];//(colorSchemes[cs][name][numberOfClasses]);
        return res;
    }

    /**
     * For the given color scheme name and number of classes returns the RGB colors associated with them.
     * @static 
     * @param {string} name 
     * @param {number} numberOfClasses 
     * @returns {Array<RGB>} Array of colors associated with color scheme name and number of classes.
     * @memberOf ColorBrewer
     */
    static byNameAndNumber(name, numberOfClasses) {
        let res = this.byName(name)[numberOfClasses];
        if (res === undefined)
            throw new Error("Illegal number of classes provided.");
        return res;
    }

    /**
     * @static
     * @param {number} numberOfClasses 
     * @returns {Array<Object>}
     * @deprecated Use byNumber(n) or getAllColorSchemesByNumberOfClasses(n) instead.
     * @memberOf ColorBrewer
     */
    static getAllColorSchemesByNumberOfClassesAsArray(numberOfClasses) {
        let colorSchemes = this.getColorBrewerVariable();
        let res = [];
        for (const cs of Object.keys(colorSchemes))
            for (const name of Object.keys(colorSchemes[cs]))
                if (colorSchemes[cs][name][numberOfClasses] !== undefined)
                    res.push(colorSchemes[cs][name][numberOfClasses]);
        if (res.length === 0)
            throw new Error("Number of classes provided:", numberOfClasses, "does not exist in ColorBrewer.");
        return res;
    }

    /**
     * Given the color scheme name and the number of classes returns an Array of colors associated with the given name and number of classes. 
     * @static
     * @param {string} name - color name
     * @param {number} numberOfClasses - number of classes
     * @returns {Array<Array<number>>} Colors of the color scheme. As many as number of classes given.  
     * @see http://stackoverflow.com/a/10971090/
     * @memberOf ColorBrewer
     */
    static getColors(name, numberOfClasses) {
        let res = new Array();
        let allColors = ColorBrewer.byNameAndNumber(name, numberOfClasses);
        for (const color of allColors)
            res.push(color.replace(/[^\d,]/g, '').split(','));
        return res;
    }

    /**
  * Given the color scheme name and the number of classes returns an Array of colors associated with the given name and number of classes. 
  * @static
  * @param {string} name - color name
  * @param {number} numberOfClasses - number of classes
  * @returns {Array<Array<string>>} Colors of the color scheme in hexacedimal format.  
  * @see http://stackoverflow.com/a/57805/5869289
  * @memberOf ColorBrewer
  */
    static getColorsHex(name, numberOfClasses) {
        let res = new Array();
        let allColors = ColorBrewer.byNameAndNumber(name, numberOfClasses);
        for (const color of allColors)
            res.push(color.replace(/[^\d,]/g, '').split(','));

        let hexColors = new Array();
        for (let color of res) {
            let [r, g, b] = color;
            let hexColor = '#' + (r << 16 | g << 8 | b).toString(16);
            hexColors.push(hexColor);
        }
        return hexColors;
    }

    /** ########################     DEFAULTS       ####################################### */
    static getDefautls(mapName, numClasses, dataNature) {
        let seq = ['Sequential', 'Seq', 'S'];
        const div = ['Divergent', 'Div', 'D'];
        const qua = ['Qualitative', 'Qua', 'Q'];
        if (numClasses > 12)
            throw new Error("Number of classes is higher than 12. It is not recommended to use more than 12 classes in any map visualization.");
        else if (numClasses >= 10 && seq.indexOf(dataNature) > -1)
            throw new Error(`Number of classes is ${numClasses}. Sequential data types only allow a maximum of 9 data classes.`);
        else if (numClasses === 12 && div.indexOf(dataNature) > -1)
            throw new Error("Number of classes is 12. Divergent data types only allow a maximum of 11 data classes.");

        switch (mapName) {
            case 'Choropleth':
                if (seq.indexOf(dataNature) > -1)
                    return this.getChoroplethDefaults(dataNature, numClasses);
                else //if (div.indexOf(dataNature) > -1 || qua.indexOf(dataNature) > -1)
                    throw new Error("Choropleth Map defaults for Divergent or Qualitative data are currently not set.");
            case 'Chorochromatic':
                if (qua.indexOf(dataNature) > -1)
                    return this.getChorochromaticDefaults(dataNature, numClasses);
                else //if (seq.indexOf(dataNature) > -1 || div.indexOf(dataNature) > -1)
                    throw new Error("Chorochromatic Map defaults for Sequential or Divergent data are currently not set.");
            case 'ChangeMap':
                if (div.indexOf(dataNature) > -1)
                    return this.getChangeMapDefaults(dataNature, numClasses);
                else //if (seq.indexOf(dataNature) > -1 || qua.indexOf(dataNature) > -1)
                    throw new Error("Change Map defaults for Sequential or Qualitative data are currently not set.");
            case 'DotMap':
                if (seq.indexOf(dataNature) > -1 || qua.indexOf(dataNature) > -1)
                    return this.getDotMapDefaults(dataNature, numClasses);
                else //if (div.indexOf(dataNature) > -1)
                    throw new Error("Dot Map defaults for Divergent data are currently not set.");
            case 'ProportionalSymbols':
                if (seq.indexOf(dataNature) > -1)
                    return this.getProportionalSymbolsDefaults(dataNature, numClasses);
                else //if (div.indexOf(dataNature) > -1 || qua.indexOf(dataNature) > -1)
                    throw new Error("ProportionalSymbols defaults for Divergent or Qualitative data are currently not set.");
        }
    }

    /**
     * Returns the default color for Choropleth Maps taking in consideration the given number of classes and nature of data currently being used.
     * @static
     * @param { string } dataNature - The type of data.
     * @param { number } numClasses - The number of classes.
     * @returns { Array<number>} the default color for the given number of classes and nature of data currently being used.
     * @memberOf ColorBrewer
     */
    static getChoroplethDefaults(dataNature, numClasses) {
        let res = [];
        switch (dataNature) {
            case 'Sequential':
                switch (numClasses) {
                    case 2: {
                        let colors = ColorBrewer.getColors('YlOrRd', 3);
                        res[0] = colors[0];
                        res[1] = colors[2];
                        break;
                    }
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                        res = ColorBrewer.getColors('YlOrRd', numClasses);
                        break;
                    case 7:
                    case 8:
                        res = ColorBrewer.getColors('YlGnBu', numClasses);
                        break;
                    case 9:
                        res = ColorBrewer.getColors('GnBu', numClasses);
                        break;
                }
                break;
        }
        return res;
    }

    /**
     * Returns the default color for Chorocromatic Maps taking in consideration the given number of classes and nature of data currently being used.
     * @static
     * @param { string } dataNature - The type of data.
     * @param { number } numClasses - The number of classes.
     * @returns { Array<number>} the default color for the given number of classes and nature of data currently being used.
     * @memberOf ColorBrewer
     */
    static getChorochromaticDefaults(dataNature, numClasses) {
        let res = [];
        switch (dataNature) {
            case 'Qualitative':
                switch (numClasses) {
                    case 2: {
                        let colors = ColorBrewer.getColors('Set1', 3);
                        res[0] = colors[0];
                        res[1] = colors[2];
                        break;
                    }
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                        res = ColorBrewer.getColors('Set1', numClasses);
                        break;
                    default:
                        res = ColorBrewer.getColors('Paired', numClasses);
                        break;
                }
                break;
        }
        return res;
    }

    /**
     * Returns the default color for Change Maps taking in consideration the given number of classes and nature of data currently being used.
     * @static
     * @param { string } dataNature - The type of data.
     * @param { number } numClasses - The number of classes.
     * @returns { Array<number>} the default color for the given number of classes and nature of data currently being used.
     * @memberOf ColorBrewer
     */
    static getChangeMapDefaults(dataNature, numClasses) {
        let res = [];
        switch (dataNature) {
            case 'Divergent':
                switch (numClasses) {
                    case 2: {
                        let colors = ColorBrewer.getColors('Spectral', 4);
                        res[0] = colors[2];
                        res[1] = colors[0];
                        break;
                    }
                    default:
                        res = ColorBrewer.getColors('RdYlGn', numClasses);
                        res = res.reverse(); //Start with lower color to higher color
                        break;
                }
                break;
        }
        return res;
    }

    /**
     * Returns the default color for Dot Maps taking in consideration the given number of classes and nature of data currently being used.
     * @static
     * @param { string } dataNature - The type of data.
     * @param { number } numClasses - The number of classes.
     * @returns { Array<number>} the default color for the given number of classes and nature of data currently being used.
     * @memberOf ColorBrewer
     */
    static getDotMapDefaults(dataNature, numClasses) {
        let res = [];

        switch (dataNature) {
            case 'Sequential':
                switch (numClasses) {
                    case 2: {
                        let colors = ColorBrewer.getColors('Reds', 3);
                        res[0] = colors[0];
                        res[1] = colors[2];
                        break;
                    }
                    default:
                        res = ColorBrewer.getColors('GnBu', numClasses);
                        break;
                }
                break;
            case 'Qualitative':
                switch (numClasses) {
                    case 2: {
                        let colors = ColorBrewer.getColors('Set1', 3);
                        res[0] = colors[0];
                        res[1] = colors[2];
                        break;
                    }
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                        res = ColorBrewer.getColors('Set1', numClasses);
                        break;
                    default:
                        res = ColorBrewer.getColors('Paired', numClasses);
                        break;
                }
                break;
        }
        return res;
    }

    /**
     * Returns the default color for Proportional Symbols Maps taking in consideration the given number of classes and nature of data currently being used.
     * @static
     * @param { string } dataNature - The type of data.
     * @param { number } numClasses - The number of classes.
     * @returns { Array<number>} the default color for the given number of classes and nature of data currently being used.
     * @memberOf ColorBrewer
     */
    static getProportionalSymbolsDefaults(dataNature, numClasses) {
        let res = [];
        switch (dataNature) {
            case 'Sequential':
                switch (numClasses) {
                    case 1:
                    case 2: {
                        let colors = ColorBrewer.getColors('YlOrRd', 3);
                        res[0] = colors[2];
                        res[1] = colors[2];
                        break;
                    }
                    default:
                        res = ColorBrewer.getColors('YlOrRd', numClasses);
                        break;
                }
                break;
        }
        return res;
    }

    /**
     * Returns the ColorBrewer object of type of color schemes. 
     * @static
     * @returns {Object} - the ColorBrewer object of type of color schemes. 
     * @see https://github.com/axismaps/colorbrewer/blob/master/colorbrewer_schemes.js
     * @memberOf ColorBrewer
     */
    static getColorBrewerVariable() {
        return {
            Diverging: { /*** Diverging ***/
                Spectral: {
                    3: ['rgb(252,141,89)', 'rgb(255,255,191)', 'rgb(153,213,148)'],
                    4: ['rgb(215,25,28)', 'rgb(253,174,97)', 'rgb(171,221,164)', 'rgb(43,131,186)'],
                    5: ['rgb(215,25,28)', 'rgb(253,174,97)', 'rgb(255,255,191)', 'rgb(171,221,164)', 'rgb(43,131,186)'],
                    6: ['rgb(213,62,79)', 'rgb(252,141,89)', 'rgb(254,224,139)', 'rgb(230,245,152)', 'rgb(153,213,148)', 'rgb(50,136,189)'],
                    7: ['rgb(213,62,79)', 'rgb(252,141,89)', 'rgb(254,224,139)', 'rgb(255,255,191)', 'rgb(230,245,152)', 'rgb(153,213,148)', 'rgb(50,136,189)'],
                    8: ['rgb(213,62,79)', 'rgb(244,109,67)', 'rgb(253,174,97)', 'rgb(254,224,139)', 'rgb(230,245,152)', 'rgb(171,221,164)', 'rgb(102,194,165)', 'rgb(50,136,189)'],
                    9: ['rgb(213,62,79)', 'rgb(244,109,67)', 'rgb(253,174,97)', 'rgb(254,224,139)', 'rgb(255,255,191)', 'rgb(230,245,152)', 'rgb(171,221,164)', 'rgb(102,194,165)', 'rgb(50,136,189)'],
                    10: ['rgb(158,1,66)', 'rgb(213,62,79)', 'rgb(244,109,67)', 'rgb(253,174,97)', 'rgb(254,224,139)', 'rgb(230,245,152)', 'rgb(171,221,164)', 'rgb(102,194,165)', 'rgb(50,136,189)', 'rgb(94,79,162)'],
                    11: ['rgb(158,1,66)', 'rgb(213,62,79)', 'rgb(244,109,67)', 'rgb(253,174,97)', 'rgb(254,224,139)', 'rgb(255,255,191)', 'rgb(230,245,152)', 'rgb(171,221,164)', 'rgb(102,194,165)', 'rgb(50,136,189)', 'rgb(94,79,162)'],
                    'properties': {
                        'type': 'div',
                        'blind': [2, 2, 2, 0, 0, 0, 0, 0, 0],
                        'print': [1, 1, 1, 0, 0, 0, 0, 0, 0],
                        'copy': [1, 1, 1, 0, 0, 0, 0, 0, 0],
                        'screen': [1, 1, 2, 0, 0, 0, 0, 0, 0]
                    }
                },
                RdYlGn: {
                    3: ['rgb(252,141,89)', 'rgb(255,255,191)', 'rgb(145,207,96)'],
                    4: ['rgb(215,25,28)', 'rgb(253,174,97)', 'rgb(166,217,106)', 'rgb(26,150,65)'],
                    5: ['rgb(215,25,28)', 'rgb(253,174,97)', 'rgb(255,255,191)', 'rgb(166,217,106)', 'rgb(26,150,65)'],
                    6: ['rgb(215,48,39)', 'rgb(252,141,89)', 'rgb(254,224,139)', 'rgb(217,239,139)', 'rgb(145,207,96)', 'rgb(26,152,80)'],
                    7: ['rgb(215,48,39)', 'rgb(252,141,89)', 'rgb(254,224,139)', 'rgb(255,255,191)', 'rgb(217,239,139)', 'rgb(145,207,96)', 'rgb(26,152,80)'],
                    8: ['rgb(215,48,39)', 'rgb(244,109,67)', 'rgb(253,174,97)', 'rgb(254,224,139)', 'rgb(217,239,139)', 'rgb(166,217,106)', 'rgb(102,189,99)', 'rgb(26,152,80)'],
                    9: ['rgb(215,48,39)', 'rgb(244,109,67)', 'rgb(253,174,97)', 'rgb(254,224,139)', 'rgb(255,255,191)', 'rgb(217,239,139)', 'rgb(166,217,106)', 'rgb(102,189,99)', 'rgb(26,152,80)'],
                    10: ['rgb(165,0,38)', 'rgb(215,48,39)', 'rgb(244,109,67)', 'rgb(253,174,97)', 'rgb(254,224,139)', 'rgb(217,239,139)', 'rgb(166,217,106)', 'rgb(102,189,99)', 'rgb(26,152,80)', 'rgb(0,104,55)'],
                    11: ['rgb(165,0,38)', 'rgb(215,48,39)', 'rgb(244,109,67)', 'rgb(253,174,97)', 'rgb(254,224,139)', 'rgb(255,255,191)', 'rgb(217,239,139)', 'rgb(166,217,106)', 'rgb(102,189,99)', 'rgb(26,152,80)', 'rgb(0,104,55)'],
                    'properties': {
                        'type': 'div',
                        'blind': [2, 2, 2, 0, 0, 0, 0, 0, 0],
                        'print': [1, 1, 1, 2, 0, 0, 0, 0, 0],
                        'copy': [0],
                        'screen': [1, 1, 1, 0, 0, 0, 0, 0, 0]
                    }
                },
                RdBu: {
                    3: ['rgb(239,138,98)', 'rgb(247,247,247)', 'rgb(103,169,207)'],
                    4: ['rgb(202,0,32)', 'rgb(244,165,130)', 'rgb(146,197,222)', 'rgb(5,113,176)'],
                    5: ['rgb(202,0,32)', 'rgb(244,165,130)', 'rgb(247,247,247)', 'rgb(146,197,222)', 'rgb(5,113,176)'],
                    6: ['rgb(178,24,43)', 'rgb(239,138,98)', 'rgb(253,219,199)', 'rgb(209,229,240)', 'rgb(103,169,207)', 'rgb(33,102,172)'],
                    7: ['rgb(178,24,43)', 'rgb(239,138,98)', 'rgb(253,219,199)', 'rgb(247,247,247)', 'rgb(209,229,240)', 'rgb(103,169,207)', 'rgb(33,102,172)'],
                    8: ['rgb(178,24,43)', 'rgb(214,96,77)', 'rgb(244,165,130)', 'rgb(253,219,199)', 'rgb(209,229,240)', 'rgb(146,197,222)', 'rgb(67,147,195)', 'rgb(33,102,172)'],
                    9: ['rgb(178,24,43)', 'rgb(214,96,77)', 'rgb(244,165,130)', 'rgb(253,219,199)', 'rgb(247,247,247)', 'rgb(209,229,240)', 'rgb(146,197,222)', 'rgb(67,147,195)', 'rgb(33,102,172)'],
                    10: ['rgb(103,0,31)', 'rgb(178,24,43)', 'rgb(214,96,77)', 'rgb(244,165,130)', 'rgb(253,219,199)', 'rgb(209,229,240)', 'rgb(146,197,222)', 'rgb(67,147,195)', 'rgb(33,102,172)', 'rgb(5,48,97)'],
                    11: ['rgb(103,0,31)', 'rgb(178,24,43)', 'rgb(214,96,77)', 'rgb(244,165,130)', 'rgb(253,219,199)', 'rgb(247,247,247)', 'rgb(209,229,240)', 'rgb(146,197,222)', 'rgb(67,147,195)', 'rgb(33,102,172)', 'rgb(5,48,97)'],
                    'properties': {
                        'type': 'div',
                        'blind': [1],
                        'print': [1, 1, 1, 1, 0, 0, 0, 0, 0],
                        'copy': [0],
                        'screen': [1, 1, 1, 0, 0, 0, 0, 0, 0]
                    }
                },
                PiYG: {
                    3: ['rgb(233,163,201)', 'rgb(247,247,247)', 'rgb(161,215,106)'],
                    4: ['rgb(208,28,139)', 'rgb(241,182,218)', 'rgb(184,225,134)', 'rgb(77,172,38)'],
                    5: ['rgb(208,28,139)', 'rgb(241,182,218)', 'rgb(247,247,247)', 'rgb(184,225,134)', 'rgb(77,172,38)'],
                    6: ['rgb(197,27,125)', 'rgb(233,163,201)', 'rgb(253,224,239)', 'rgb(230,245,208)', 'rgb(161,215,106)', 'rgb(77,146,33)'],
                    7: ['rgb(197,27,125)', 'rgb(233,163,201)', 'rgb(253,224,239)', 'rgb(247,247,247)', 'rgb(230,245,208)', 'rgb(161,215,106)', 'rgb(77,146,33)'],
                    8: ['rgb(197,27,125)', 'rgb(222,119,174)', 'rgb(241,182,218)', 'rgb(253,224,239)', 'rgb(230,245,208)', 'rgb(184,225,134)', 'rgb(127,188,65)', 'rgb(77,146,33)'],
                    9: ['rgb(197,27,125)', 'rgb(222,119,174)', 'rgb(241,182,218)', 'rgb(253,224,239)', 'rgb(247,247,247)', 'rgb(230,245,208)', 'rgb(184,225,134)', 'rgb(127,188,65)', 'rgb(77,146,33)'],
                    10: ['rgb(142,1,82)', 'rgb(197,27,125)', 'rgb(222,119,174)', 'rgb(241,182,218)', 'rgb(253,224,239)', 'rgb(230,245,208)', 'rgb(184,225,134)', 'rgb(127,188,65)', 'rgb(77,146,33)', 'rgb(39,100,25)'],
                    11: ['rgb(142,1,82)', 'rgb(197,27,125)', 'rgb(222,119,174)', 'rgb(241,182,218)', 'rgb(253,224,239)', 'rgb(247,247,247)', 'rgb(230,245,208)', 'rgb(184,225,134)', 'rgb(127,188,65)', 'rgb(77,146,33)', 'rgb(39,100,25)'],
                    'properties': {
                        'type': 'div',
                        'blind': [1],
                        'print': [1, 1, 2, 0, 0, 0, 0, 0, 0],
                        'copy': [0],
                        'screen': [1, 1, 2, 0, 0, 0, 0, 0, 0]
                    }
                },
                PRGn: {
                    3: ['rgb(175,141,195)', 'rgb(247,247,247)', 'rgb(127,191,123)'],
                    4: ['rgb(123,50,148)', 'rgb(194,165,207)', 'rgb(166,219,160)', 'rgb(0,136,55)'],
                    5: ['rgb(123,50,148)', 'rgb(194,165,207)', 'rgb(247,247,247)', 'rgb(166,219,160)', 'rgb(0,136,55)'],
                    6: ['rgb(118,42,131)', 'rgb(175,141,195)', 'rgb(231,212,232)', 'rgb(217,240,211)', 'rgb(127,191,123)', 'rgb(27,120,55)'],
                    7: ['rgb(118,42,131)', 'rgb(175,141,195)', 'rgb(231,212,232)', 'rgb(247,247,247)', 'rgb(217,240,211)', 'rgb(127,191,123)', 'rgb(27,120,55)'],
                    8: ['rgb(118,42,131)', 'rgb(153,112,171)', 'rgb(194,165,207)', 'rgb(231,212,232)', 'rgb(217,240,211)', 'rgb(166,219,160)', 'rgb(90,174,97)', 'rgb(27,120,55)'],
                    9: ['rgb(118,42,131)', 'rgb(153,112,171)', 'rgb(194,165,207)', 'rgb(231,212,232)', 'rgb(247,247,247)', 'rgb(217,240,211)', 'rgb(166,219,160)', 'rgb(90,174,97)', 'rgb(27,120,55)'],
                    10: ['rgb(64,0,75)', 'rgb(118,42,131)', 'rgb(153,112,171)', 'rgb(194,165,207)', 'rgb(231,212,232)', 'rgb(217,240,211)', 'rgb(166,219,160)', 'rgb(90,174,97)', 'rgb(27,120,55)', 'rgb(0,68,27)'],
                    11: ['rgb(64,0,75)', 'rgb(118,42,131)', 'rgb(153,112,171)', 'rgb(194,165,207)', 'rgb(231,212,232)', 'rgb(247,247,247)', 'rgb(217,240,211)', 'rgb(166,219,160)', 'rgb(90,174,97)', 'rgb(27,120,55)', 'rgb(0,68,27)'],
                    'properties': {
                        'type': 'div',
                        'blind': [1],
                        'print': [1, 1, 1, 1, 0, 0, 0, 0, 0],
                        'copy': [0],
                        'screen': [1, 1, 2, 2, 0, 0, 0, 0, 0]
                    }
                },
                RdYlBu: {
                    3: ['rgb(252,141,89)', 'rgb(255,255,191)', 'rgb(145,191,219)'],
                    4: ['rgb(215,25,28)', 'rgb(253,174,97)', 'rgb(171,217,233)', 'rgb(44,123,182)'],
                    5: ['rgb(215,25,28)', 'rgb(253,174,97)', 'rgb(255,255,191)', 'rgb(171,217,233)', 'rgb(44,123,182)'],
                    6: ['rgb(215,48,39)', 'rgb(252,141,89)', 'rgb(254,224,144)', 'rgb(224,243,248)', 'rgb(145,191,219)', 'rgb(69,117,180)'],
                    7: ['rgb(215,48,39)', 'rgb(252,141,89)', 'rgb(254,224,144)', 'rgb(255,255,191)', 'rgb(224,243,248)', 'rgb(145,191,219)', 'rgb(69,117,180)'],
                    8: ['rgb(215,48,39)', 'rgb(244,109,67)', 'rgb(253,174,97)', 'rgb(254,224,144)', 'rgb(224,243,248)', 'rgb(171,217,233)', 'rgb(116,173,209)', 'rgb(69,117,180)'],
                    9: ['rgb(215,48,39)', 'rgb(244,109,67)', 'rgb(253,174,97)', 'rgb(254,224,144)', 'rgb(255,255,191)', 'rgb(224,243,248)', 'rgb(171,217,233)', 'rgb(116,173,209)', 'rgb(69,117,180)'],
                    10: ['rgb(165,0,38)', 'rgb(215,48,39)', 'rgb(244,109,67)', 'rgb(253,174,97)', 'rgb(254,224,144)', 'rgb(224,243,248)', 'rgb(171,217,233)', 'rgb(116,173,209)', 'rgb(69,117,180)', 'rgb(49,54,149)'],
                    11: ['rgb(165,0,38)', 'rgb(215,48,39)', 'rgb(244,109,67)', 'rgb(253,174,97)', 'rgb(254,224,144)', 'rgb(255,255,191)', 'rgb(224,243,248)', 'rgb(171,217,233)', 'rgb(116,173,209)', 'rgb(69,117,180)', 'rgb(49,54,149)'],
                    'properties': {
                        'type': 'div',
                        'blind': [1],
                        'print': [1, 1, 1, 1, 2, 0, 0, 0, 0],
                        'copy': [0],
                        'screen': [1, 1, 1, 2, 0, 0, 0, 0, 0]
                    }
                },
                BrBG: {
                    3: ['rgb(216,179,101)', 'rgb(245,245,245)', 'rgb(90,180,172)'],
                    4: ['rgb(166,97,26)', 'rgb(223,194,125)', 'rgb(128,205,193)', 'rgb(1,133,113)'],
                    5: ['rgb(166,97,26)', 'rgb(223,194,125)', 'rgb(245,245,245)', 'rgb(128,205,193)', 'rgb(1,133,113)'],
                    6: ['rgb(140,81,10)', 'rgb(216,179,101)', 'rgb(246,232,195)', 'rgb(199,234,229)', 'rgb(90,180,172)', 'rgb(1,102,94)'],
                    7: ['rgb(140,81,10)', 'rgb(216,179,101)', 'rgb(246,232,195)', 'rgb(245,245,245)', 'rgb(199,234,229)', 'rgb(90,180,172)', 'rgb(1,102,94)'],
                    8: ['rgb(140,81,10)', 'rgb(191,129,45)', 'rgb(223,194,125)', 'rgb(246,232,195)', 'rgb(199,234,229)', 'rgb(128,205,193)', 'rgb(53,151,143)', 'rgb(1,102,94)'],
                    9: ['rgb(140,81,10)', 'rgb(191,129,45)', 'rgb(223,194,125)', 'rgb(246,232,195)', 'rgb(245,245,245)', 'rgb(199,234,229)', 'rgb(128,205,193)', 'rgb(53,151,143)', 'rgb(1,102,94)'],
                    10: ['rgb(84,48,5)', 'rgb(140,81,10)', 'rgb(191,129,45)', 'rgb(223,194,125)', 'rgb(246,232,195)', 'rgb(199,234,229)', 'rgb(128,205,193)', 'rgb(53,151,143)', 'rgb(1,102,94)', 'rgb(0,60,48)'],
                    11: ['rgb(84,48,5)', 'rgb(140,81,10)', 'rgb(191,129,45)', 'rgb(223,194,125)', 'rgb(246,232,195)', 'rgb(245,245,245)', 'rgb(199,234,229)', 'rgb(128,205,193)', 'rgb(53,151,143)', 'rgb(1,102,94)', 'rgb(0,60,48)'],
                    'properties': {
                        'type': 'div',
                        'blind': [1],
                        'print': [1, 1, 1, 1, 0, 0, 0, 0, 0],
                        'copy': [0],
                        'screen': [1, 1, 1, 1, 0, 0, 0, 0, 0]
                    }
                },
                RdGy: {
                    3: ['rgb(239,138,98)', 'rgb(255,255,255)', 'rgb(153,153,153)'],
                    4: ['rgb(202,0,32)', 'rgb(244,165,130)', 'rgb(186,186,186)', 'rgb(64,64,64)'],
                    5: ['rgb(202,0,32)', 'rgb(244,165,130)', 'rgb(255,255,255)', 'rgb(186,186,186)', 'rgb(64,64,64)'],
                    6: ['rgb(178,24,43)', 'rgb(239,138,98)', 'rgb(253,219,199)', 'rgb(224,224,224)', 'rgb(153,153,153)', 'rgb(77,77,77)'],
                    7: ['rgb(178,24,43)', 'rgb(239,138,98)', 'rgb(253,219,199)', 'rgb(255,255,255)', 'rgb(224,224,224)', 'rgb(153,153,153)', 'rgb(77,77,77)'],
                    8: ['rgb(178,24,43)', 'rgb(214,96,77)', 'rgb(244,165,130)', 'rgb(253,219,199)', 'rgb(224,224,224)', 'rgb(186,186,186)', 'rgb(135,135,135)', 'rgb(77,77,77)'],
                    9: ['rgb(178,24,43)', 'rgb(214,96,77)', 'rgb(244,165,130)', 'rgb(253,219,199)', 'rgb(255,255,255)', 'rgb(224,224,224)', 'rgb(186,186,186)', 'rgb(135,135,135)', 'rgb(77,77,77)'],
                    10: ['rgb(103,0,31)', 'rgb(178,24,43)', 'rgb(214,96,77)', 'rgb(244,165,130)', 'rgb(253,219,199)', 'rgb(224,224,224)', 'rgb(186,186,186)', 'rgb(135,135,135)', 'rgb(77,77,77)', 'rgb(26,26,26)'],
                    11: ['rgb(103,0,31)', 'rgb(178,24,43)', 'rgb(214,96,77)', 'rgb(244,165,130)', 'rgb(253,219,199)', 'rgb(255,255,255)', 'rgb(224,224,224)', 'rgb(186,186,186)', 'rgb(135,135,135)', 'rgb(77,77,77)', 'rgb(26,26,26)'],
                    'properties': {
                        'type': 'div',
                        'blind': [2],
                        'print': [1, 1, 1, 2, 0, 0, 0, 0, 0],
                        'copy': [0],
                        'screen': [1, 1, 2, 0, 0, 0, 0, 0, 0]
                    }
                },
                PuOr: {
                    3: ['rgb(241,163,64)', 'rgb(247,247,247)', 'rgb(153,142,195)'],
                    4: ['rgb(230,97,1)', 'rgb(253,184,99)', 'rgb(178,171,210)', 'rgb(94,60,153)'],
                    5: ['rgb(230,97,1)', 'rgb(253,184,99)', 'rgb(247,247,247)', 'rgb(178,171,210)', 'rgb(94,60,153)'],
                    6: ['rgb(179,88,6)', 'rgb(241,163,64)', 'rgb(254,224,182)', 'rgb(216,218,235)', 'rgb(153,142,195)', 'rgb(84,39,136)'],
                    7: ['rgb(179,88,6)', 'rgb(241,163,64)', 'rgb(254,224,182)', 'rgb(247,247,247)', 'rgb(216,218,235)', 'rgb(153,142,195)', 'rgb(84,39,136)'],
                    8: ['rgb(179,88,6)', 'rgb(224,130,20)', 'rgb(253,184,99)', 'rgb(254,224,182)', 'rgb(216,218,235)', 'rgb(178,171,210)', 'rgb(128,115,172)', 'rgb(84,39,136)'],
                    9: ['rgb(179,88,6)', 'rgb(224,130,20)', 'rgb(253,184,99)', 'rgb(254,224,182)', 'rgb(247,247,247)', 'rgb(216,218,235)', 'rgb(178,171,210)', 'rgb(128,115,172)', 'rgb(84,39,136)'],
                    10: ['rgb(127,59,8)', 'rgb(179,88,6)', 'rgb(224,130,20)', 'rgb(253,184,99)', 'rgb(254,224,182)', 'rgb(216,218,235)', 'rgb(178,171,210)', 'rgb(128,115,172)', 'rgb(84,39,136)', 'rgb(45,0,75)'],
                    11: ['rgb(127,59,8)', 'rgb(179,88,6)', 'rgb(224,130,20)', 'rgb(253,184,99)', 'rgb(254,224,182)', 'rgb(247,247,247)', 'rgb(216,218,235)', 'rgb(178,171,210)', 'rgb(128,115,172)', 'rgb(84,39,136)', 'rgb(45,0,75)'],
                    'properties': {
                        'type': 'div',
                        'blind': [1],
                        'print': [1, 1, 2, 2, 0, 0, 0, 0, 0],
                        'copy': [1, 1, 0, 0, 0, 0, 0, 0, 0],
                        'screen': [1, 1, 1, 1, 0, 0, 0, 0, 0]
                    }
                }
            },

            Qualitative: { /*** Qualitative ***/
                Set2: {
                    3: ['rgb(102,194,165)', 'rgb(252,141,98)', 'rgb(141,160,203)'],
                    4: ['rgb(102,194,165)', 'rgb(252,141,98)', 'rgb(141,160,203)', 'rgb(231,138,195)'],
                    5: ['rgb(102,194,165)', 'rgb(252,141,98)', 'rgb(141,160,203)', 'rgb(231,138,195)', 'rgb(166,216,84)'],
                    6: ['rgb(102,194,165)', 'rgb(252,141,98)', 'rgb(141,160,203)', 'rgb(231,138,195)', 'rgb(166,216,84)', 'rgb(255,217,47)'],
                    7: ['rgb(102,194,165)', 'rgb(252,141,98)', 'rgb(141,160,203)', 'rgb(231,138,195)', 'rgb(166,216,84)', 'rgb(255,217,47)', 'rgb(229,196,148)'],
                    8: ['rgb(102,194,165)', 'rgb(252,141,98)', 'rgb(141,160,203)', 'rgb(231,138,195)', 'rgb(166,216,84)', 'rgb(255,217,47)', 'rgb(229,196,148)', 'rgb(179,179,179)'],
                    'properties': {
                        'type': 'qual',
                        'blind': [1, 2, 2, 2, 0, 0, 0],
                        'print': [1, 1, 1, 2, 2, 2],
                        'copy': [0],
                        'screen': [1, 1, 2, 2, 2, 2]
                    }
                },
                Accent: {
                    3: ['rgb(127,201,127)', 'rgb(190,174,212)', 'rgb(253,192,134)'],
                    4: ['rgb(127,201,127)', 'rgb(190,174,212)', 'rgb(253,192,134)', 'rgb(255,255,153)'],
                    5: ['rgb(127,201,127)', 'rgb(190,174,212)', 'rgb(253,192,134)', 'rgb(255,255,153)', 'rgb(56,108,176)'],
                    6: ['rgb(127,201,127)', 'rgb(190,174,212)', 'rgb(253,192,134)', 'rgb(255,255,153)', 'rgb(56,108,176)', 'rgb(240,2,127)'],
                    7: ['rgb(127,201,127)', 'rgb(190,174,212)', 'rgb(253,192,134)', 'rgb(255,255,153)', 'rgb(56,108,176)', 'rgb(240,2,127)', 'rgb(191,91,23)'],
                    8: ['rgb(127,201,127)', 'rgb(190,174,212)', 'rgb(253,192,134)', 'rgb(255,255,153)', 'rgb(56,108,176)', 'rgb(240,2,127)', 'rgb(191,91,23)', 'rgb(102,102,102)'],
                    'properties': {
                        'type': 'qual',
                        'blind': [2, 0, 0, 0, 0, 0, 0],
                        'print': [1, 1, 2, 2, 2, 2],
                        'copy': [0],
                        'screen': [1, 1, 1, 2, 2, 2]
                    }
                },
                Set1: {
                    3: ['rgb(228,26,28)', 'rgb(55,126,184)', 'rgb(77,175,74)'],
                    4: ['rgb(228,26,28)', 'rgb(55,126,184)', 'rgb(77,175,74)', 'rgb(152,78,163)'],
                    5: ['rgb(228,26,28)', 'rgb(55,126,184)', 'rgb(77,175,74)', 'rgb(152,78,163)', 'rgb(255,127,0)'],
                    6: ['rgb(228,26,28)', 'rgb(55,126,184)', 'rgb(77,175,74)', 'rgb(152,78,163)', 'rgb(255,127,0)', 'rgb(255,255,51)'],
                    7: ['rgb(228,26,28)', 'rgb(55,126,184)', 'rgb(77,175,74)', 'rgb(152,78,163)', 'rgb(255,127,0)', 'rgb(255,255,51)', 'rgb(166,86,40)'],
                    8: ['rgb(228,26,28)', 'rgb(55,126,184)', 'rgb(77,175,74)', 'rgb(152,78,163)', 'rgb(255,127,0)', 'rgb(255,255,51)', 'rgb(166,86,40)', 'rgb(247,129,191)'],
                    9: ['rgb(228,26,28)', 'rgb(55,126,184)', 'rgb(77,175,74)', 'rgb(152,78,163)', 'rgb(255,127,0)', 'rgb(255,255,51)', 'rgb(166,86,40)', 'rgb(247,129,191)', 'rgb(153,153,153)'],
                    'properties': {
                        'type': 'qual',
                        'blind': [2],
                        'print': [1],
                        'copy': [0],
                        'screen': [1]
                    }
                },
                Set3: {
                    3: ['rgb(141,211,199)', 'rgb(255,255,179)', 'rgb(190,186,218)'],
                    4: ['rgb(141,211,199)', 'rgb(255,255,179)', 'rgb(190,186,218)', 'rgb(251,128,114)'],
                    5: ['rgb(141,211,199)', 'rgb(255,255,179)', 'rgb(190,186,218)', 'rgb(251,128,114)', 'rgb(128,177,211)'],
                    6: ['rgb(141,211,199)', 'rgb(255,255,179)', 'rgb(190,186,218)', 'rgb(251,128,114)', 'rgb(128,177,211)', 'rgb(253,180,98)'],
                    7: ['rgb(141,211,199)', 'rgb(255,255,179)', 'rgb(190,186,218)', 'rgb(251,128,114)', 'rgb(128,177,211)', 'rgb(253,180,98)', 'rgb(179,222,105)'],
                    8: ['rgb(141,211,199)', 'rgb(255,255,179)', 'rgb(190,186,218)', 'rgb(251,128,114)', 'rgb(128,177,211)', 'rgb(253,180,98)', 'rgb(179,222,105)', 'rgb(252,205,229)'],
                    9: ['rgb(141,211,199)', 'rgb(255,255,179)', 'rgb(190,186,218)', 'rgb(251,128,114)', 'rgb(128,177,211)', 'rgb(253,180,98)', 'rgb(179,222,105)', 'rgb(252,205,229)', 'rgb(217,217,217)'],
                    10: ['rgb(141,211,199)', 'rgb(255,255,179)', 'rgb(190,186,218)', 'rgb(251,128,114)', 'rgb(128,177,211)', 'rgb(253,180,98)', 'rgb(179,222,105)', 'rgb(252,205,229)', 'rgb(217,217,217)', 'rgb(188,128,189)'],
                    11: ['rgb(141,211,199)', 'rgb(255,255,179)', 'rgb(190,186,218)', 'rgb(251,128,114)', 'rgb(128,177,211)', 'rgb(253,180,98)', 'rgb(179,222,105)', 'rgb(252,205,229)', 'rgb(217,217,217)', 'rgb(188,128,189)', 'rgb(204,235,197)'],
                    12: ['rgb(141,211,199)', 'rgb(255,255,179)', 'rgb(190,186,218)', 'rgb(251,128,114)', 'rgb(128,177,211)', 'rgb(253,180,98)', 'rgb(179,222,105)', 'rgb(252,205,229)', 'rgb(217,217,217)', 'rgb(188,128,189)', 'rgb(204,235,197)', 'rgb(255,237,111)'],
                    'properties': {
                        'type': 'qual',
                        'blind': [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
                        'print': [1, 1, 1, 1, 1, 1, 2, 0, 0, 0],
                        'copy': [1, 2, 2, 2, 2, 2, 2, 0, 0, 0],
                        'screen': [1, 1, 1, 2, 2, 2, 0, 0, 0, 0]
                    }
                },
                Dark2: {
                    3: ['rgb(27,158,119)', 'rgb(217,95,2)', 'rgb(117,112,179)'],
                    4: ['rgb(27,158,119)', 'rgb(217,95,2)', 'rgb(117,112,179)', 'rgb(231,41,138)'],
                    5: ['rgb(27,158,119)', 'rgb(217,95,2)', 'rgb(117,112,179)', 'rgb(231,41,138)', 'rgb(102,166,30)'],
                    6: ['rgb(27,158,119)', 'rgb(217,95,2)', 'rgb(117,112,179)', 'rgb(231,41,138)', 'rgb(102,166,30)', 'rgb(230,171,2)'],
                    7: ['rgb(27,158,119)', 'rgb(217,95,2)', 'rgb(117,112,179)', 'rgb(231,41,138)', 'rgb(102,166,30)', 'rgb(230,171,2)', 'rgb(166,118,29)'],
                    8: ['rgb(27,158,119)', 'rgb(217,95,2)', 'rgb(117,112,179)', 'rgb(231,41,138)', 'rgb(102,166,30)', 'rgb(230,171,2)', 'rgb(166,118,29)', 'rgb(102,102,102)'],
                    'properties': {
                        'type': 'qual',
                        'blind': [1, 2, 2, 2, 0, 0],
                        'print': [1],
                        'copy': [0],
                        'screen': [1]
                    }
                },
                Paired: {
                    3: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)'],
                    4: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)'],
                    5: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)'],
                    6: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)'],
                    7: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)', 'rgb(253,191,111)'],
                    8: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)', 'rgb(253,191,111)', 'rgb(255,127,0)'],
                    9: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)', 'rgb(253,191,111)', 'rgb(255,127,0)', 'rgb(202,178,214)'],
                    10: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)', 'rgb(253,191,111)', 'rgb(255,127,0)', 'rgb(202,178,214)', 'rgb(106,61,154)'],
                    11: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)', 'rgb(253,191,111)', 'rgb(255,127,0)', 'rgb(202,178,214)', 'rgb(106,61,154)', 'rgb(255,255,153)'],
                    12: ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)', 'rgb(253,191,111)', 'rgb(255,127,0)', 'rgb(202,178,214)', 'rgb(106,61,154)', 'rgb(255,255,153)', 'rgb(177,89,40)'],
                    'properties': {
                        'type': 'qual',
                        'blind': [1, 1, 2, 2, 2, 2, 0, 0, 0],
                        'print': [1, 1, 1, 1, 1, 2, 2, 2, 2],
                        'copy': [0],
                        'screen': [1, 1, 1, 1, 1, 1, 1, 1, 2]
                    }
                },
                Pastel2: {
                    3: ['rgb(179,226,205)', 'rgb(253,205,172)', 'rgb(203,213,232)'],
                    4: ['rgb(179,226,205)', 'rgb(253,205,172)', 'rgb(203,213,232)', 'rgb(244,202,228)'],
                    5: ['rgb(179,226,205)', 'rgb(253,205,172)', 'rgb(203,213,232)', 'rgb(244,202,228)', 'rgb(230,245,201)'],
                    6: ['rgb(179,226,205)', 'rgb(253,205,172)', 'rgb(203,213,232)', 'rgb(244,202,228)', 'rgb(230,245,201)', 'rgb(255,242,174)'],
                    7: ['rgb(179,226,205)', 'rgb(253,205,172)', 'rgb(203,213,232)', 'rgb(244,202,228)', 'rgb(230,245,201)', 'rgb(255,242,174)', 'rgb(241,226,204)'],
                    8: ['rgb(179,226,205)', 'rgb(253,205,172)', 'rgb(203,213,232)', 'rgb(244,202,228)', 'rgb(230,245,201)', 'rgb(255,242,174)', 'rgb(241,226,204)', 'rgb(204,204,204)'],
                    'properties': {
                        'type': 'qual',
                        'blind': [2, 0, 0, 0, 0, 0],
                        'print': [2, 0, 0, 0, 0, 0],
                        'copy': [0],
                        'screen': [2, 2, 0, 0, 0, 0]
                    }
                },
                Pastel1: {
                    3: ['rgb(251,180,174)', 'rgb(179,205,227)', 'rgb(204,235,197)'],
                    4: ['rgb(251,180,174)', 'rgb(179,205,227)', 'rgb(204,235,197)', 'rgb(222,203,228)'],
                    5: ['rgb(251,180,174)', 'rgb(179,205,227)', 'rgb(204,235,197)', 'rgb(222,203,228)', 'rgb(254,217,166)'],
                    6: ['rgb(251,180,174)', 'rgb(179,205,227)', 'rgb(204,235,197)', 'rgb(222,203,228)', 'rgb(254,217,166)', 'rgb(255,255,204)'],
                    7: ['rgb(251,180,174)', 'rgb(179,205,227)', 'rgb(204,235,197)', 'rgb(222,203,228)', 'rgb(254,217,166)', 'rgb(255,255,204)', 'rgb(229,216,189)'],
                    8: ['rgb(251,180,174)', 'rgb(179,205,227)', 'rgb(204,235,197)', 'rgb(222,203,228)', 'rgb(254,217,166)', 'rgb(255,255,204)', 'rgb(229,216,189)', 'rgb(253,218,236)'],
                    9: ['rgb(251,180,174)', 'rgb(179,205,227)', 'rgb(204,235,197)', 'rgb(222,203,228)', 'rgb(254,217,166)', 'rgb(255,255,204)', 'rgb(229,216,189)', 'rgb(253,218,236)', 'rgb(242,242,242)'],
                    'properties': {
                        'type': 'qual',
                        'blind': [2, 0, 0, 0, 0, 0, 0],
                        'print': [2, 2, 2, 0, 0, 0, 0],
                        'copy': [0],
                        'screen': [2, 2, 2, 2, 0, 0, 0]
                    }
                }
            },

            Sequential: {/*** Sequential ***/
                OrRd: {
                    3: ['rgb(254,232,200)', 'rgb(253,187,132)', 'rgb(227,74,51)'],
                    4: ['rgb(254,240,217)', 'rgb(253,204,138)', 'rgb(252,141,89)', 'rgb(215,48,31)'],
                    5: ['rgb(254,240,217)', 'rgb(253,204,138)', 'rgb(252,141,89)', 'rgb(227,74,51)', 'rgb(179,0,0)'],
                    6: ['rgb(254,240,217)', 'rgb(253,212,158)', 'rgb(253,187,132)', 'rgb(252,141,89)', 'rgb(227,74,51)', 'rgb(179,0,0)'],
                    7: ['rgb(254,240,217)', 'rgb(253,212,158)', 'rgb(253,187,132)', 'rgb(252,141,89)', 'rgb(239,101,72)', 'rgb(215,48,31)', 'rgb(153,0,0)'],
                    8: ['rgb(255,247,236)', 'rgb(254,232,200)', 'rgb(253,212,158)', 'rgb(253,187,132)', 'rgb(252,141,89)', 'rgb(239,101,72)', 'rgb(215,48,31)', 'rgb(153,0,0)'],
                    9: ['rgb(255,247,236)', 'rgb(254,232,200)', 'rgb(253,212,158)', 'rgb(253,187,132)', 'rgb(252,141,89)', 'rgb(239,101,72)', 'rgb(215,48,31)', 'rgb(179,0,0)', 'rgb(127,0,0)'],
                    'properties': {
                        'type': 'seq',
                        'blind': [1],
                        'print': [1, 1, 0, 0, 0, 0, 0],
                        'copy': [1, 1, 2, 0, 0, 0, 0],
                        'screen': [1, 1, 1, 0, 0, 0, 0]
                    }
                },
                PuBu: {
                    3: ['rgb(236,231,242)', 'rgb(166,189,219)', 'rgb(43,140,190)'],
                    4: ['rgb(241,238,246)', 'rgb(189,201,225)', 'rgb(116,169,207)', 'rgb(5,112,176)'],
                    5: ['rgb(241,238,246)', 'rgb(189,201,225)', 'rgb(116,169,207)', 'rgb(43,140,190)', 'rgb(4,90,141)'],
                    6: ['rgb(241,238,246)', 'rgb(208,209,230)', 'rgb(166,189,219)', 'rgb(116,169,207)', 'rgb(43,140,190)', 'rgb(4,90,141)'],
                    7: ['rgb(241,238,246)', 'rgb(208,209,230)', 'rgb(166,189,219)', 'rgb(116,169,207)', 'rgb(54,144,192)', 'rgb(5,112,176)', 'rgb(3,78,123)'],
                    8: ['rgb(255,247,251)', 'rgb(236,231,242)', 'rgb(208,209,230)', 'rgb(166,189,219)', 'rgb(116,169,207)', 'rgb(54,144,192)', 'rgb(5,112,176)', 'rgb(3,78,123)'],
                    9: ['rgb(255,247,251)', 'rgb(236,231,242)', 'rgb(208,209,230)', 'rgb(166,189,219)', 'rgb(116,169,207)', 'rgb(54,144,192)', 'rgb(5,112,176)', 'rgb(4,90,141)', 'rgb(2,56,88)'],
                    'properties': {
                        'type': 'seq',
                        'blind': [1],
                        'print': [1, 2, 2, 0, 0, 0, 0],
                        'copy': [1, 2, 0, 0, 0, 0, 0],
                        'screen': [1, 1, 2, 0, 0, 0, 0]
                    }
                },
                BuPu: {
                    3: ['rgb(224,236,244)', 'rgb(158,188,218)', 'rgb(136,86,167)'],
                    4: ['rgb(237,248,251)', 'rgb(179,205,227)', 'rgb(140,150,198)', 'rgb(136,65,157)'],
                    5: ['rgb(237,248,251)', 'rgb(179,205,227)', 'rgb(140,150,198)', 'rgb(136,86,167)', 'rgb(129,15,124)'],
                    6: ['rgb(237,248,251)', 'rgb(191,211,230)', 'rgb(158,188,218)', 'rgb(140,150,198)', 'rgb(136,86,167)', 'rgb(129,15,124)'],
                    7: ['rgb(237,248,251)', 'rgb(191,211,230)', 'rgb(158,188,218)', 'rgb(140,150,198)', 'rgb(140,107,177)', 'rgb(136,65,157)', 'rgb(110,1,107)'],
                    8: ['rgb(247,252,253)', 'rgb(224,236,244)', 'rgb(191,211,230)', 'rgb(158,188,218)', 'rgb(140,150,198)', 'rgb(140,107,177)', 'rgb(136,65,157)', 'rgb(110,1,107)'],
                    9: ['rgb(247,252,253)', 'rgb(224,236,244)', 'rgb(191,211,230)', 'rgb(158,188,218)', 'rgb(140,150,198)', 'rgb(140,107,177)', 'rgb(136,65,157)', 'rgb(129,15,124)', 'rgb(77,0,75)'],
                    'properties': {
                        'type': 'seq',
                        'blind': [1],
                        'print': [1, 1, 2, 2, 0, 0, 0],
                        'copy': [1, 2, 0, 0, 0, 0, 0],
                        'screen': [1, 1, 1, 0, 0, 0, 0]
                    }
                },
                Oranges: {
                    3: ['rgb(254,230,206)', 'rgb(253,174,107)', 'rgb(230,85,13)'],
                    4: ['rgb(254,237,222)', 'rgb(253,190,133)', 'rgb(253,141,60)', 'rgb(217,71,1)'],
                    5: ['rgb(254,237,222)', 'rgb(253,190,133)', 'rgb(253,141,60)', 'rgb(230,85,13)', 'rgb(166,54,3)'],
                    6: ['rgb(254,237,222)', 'rgb(253,208,162)', 'rgb(253,174,107)', 'rgb(253,141,60)', 'rgb(230,85,13)', 'rgb(166,54,3)'],
                    7: ['rgb(254,237,222)', 'rgb(253,208,162)', 'rgb(253,174,107)', 'rgb(253,141,60)', 'rgb(241,105,19)', 'rgb(217,72,1)', 'rgb(140,45,4)'],
                    8: ['rgb(255,245,235)', 'rgb(254,230,206)', 'rgb(253,208,162)', 'rgb(253,174,107)', 'rgb(253,141,60)', 'rgb(241,105,19)', 'rgb(217,72,1)', 'rgb(140,45,4)'],
                    9: ['rgb(255,245,235)', 'rgb(254,230,206)', 'rgb(253,208,162)', 'rgb(253,174,107)', 'rgb(253,141,60)', 'rgb(241,105,19)', 'rgb(217,72,1)', 'rgb(166,54,3)', 'rgb(127,39,4)'],
                    'properties': {
                        'type': 'seq',
                        'blind': [1],
                        'print': [1, 2, 0, 0, 0, 0, 0],
                        'copy': [1, 2, 2, 0, 0, 0, 0],
                        'screen': [1, 1, 1, 0, 0, 0, 0]
                    }
                },
                BuGn: {
                    3: ['rgb(229,245,249)', 'rgb(153,216,201)', 'rgb(44,162,95)'],
                    4: ['rgb(237,248,251)', 'rgb(178,226,226)', 'rgb(102,194,164)', 'rgb(35,139,69)'],
                    5: ['rgb(237,248,251)', 'rgb(178,226,226)', 'rgb(102,194,164)', 'rgb(44,162,95)', 'rgb(0,109,44)'],
                    6: ['rgb(237,248,251)', 'rgb(204,236,230)', 'rgb(153,216,201)', 'rgb(102,194,164)', 'rgb(44,162,95)', 'rgb(0,109,44)'],
                    7: ['rgb(237,248,251)', 'rgb(204,236,230)', 'rgb(153,216,201)', 'rgb(102,194,164)', 'rgb(65,174,118)', 'rgb(35,139,69)', 'rgb(0,88,36)'],
                    8: ['rgb(247,252,253)', 'rgb(229,245,249)', 'rgb(204,236,230)', 'rgb(153,216,201)', 'rgb(102,194,164)', 'rgb(65,174,118)', 'rgb(35,139,69)', 'rgb(0,88,36)'],
                    9: ['rgb(247,252,253)', 'rgb(229,245,249)', 'rgb(204,236,230)', 'rgb(153,216,201)', 'rgb(102,194,164)', 'rgb(65,174,118)', 'rgb(35,139,69)', 'rgb(0,109,44)', 'rgb(0,68,27)'],
                    'properties': {
                        'type': 'seq',
                        'blind': [1],
                        'print': [1, 1, 2, 0, 0, 0, 0],
                        'copy': [1, 2, 0, 0, 0, 0, 0],
                        'screen': [1, 2, 0, 0, 0, 0, 0]
                    }
                },
                YlOrBr: {
                    3: ['rgb(255,247,188)', 'rgb(254,196,79)', 'rgb(217,95,14)'],
                    4: ['rgb(255,255,212)', 'rgb(254,217,142)', 'rgb(254,153,41)', 'rgb(204,76,2)'],
                    5: ['rgb(255,255,212)', 'rgb(254,217,142)', 'rgb(254,153,41)', 'rgb(217,95,14)', 'rgb(153,52,4)'],
                    6: ['rgb(255,255,212)', 'rgb(254,227,145)', 'rgb(254,196,79)', 'rgb(254,153,41)', 'rgb(217,95,14)', 'rgb(153,52,4)'],
                    7: ['rgb(255,255,212)', 'rgb(254,227,145)', 'rgb(254,196,79)', 'rgb(254,153,41)', 'rgb(236,112,20)', 'rgb(204,76,2)', 'rgb(140,45,4)'],
                    8: ['rgb(255,255,229)', 'rgb(255,247,188)', 'rgb(254,227,145)', 'rgb(254,196,79)', 'rgb(254,153,41)', 'rgb(236,112,20)', 'rgb(204,76,2)', 'rgb(140,45,4)'],
                    9: ['rgb(255,255,229)', 'rgb(255,247,188)', 'rgb(254,227,145)', 'rgb(254,196,79)', 'rgb(254,153,41)', 'rgb(236,112,20)', 'rgb(204,76,2)', 'rgb(153,52,4)', 'rgb(102,37,6)'],
                    'properties': {
                        'type': 'seq',
                        'blind': [1],
                        'print': [1, 1, 2, 0, 0, 0, 0],
                        'copy': [1, 2, 2, 0, 0, 0, 0],
                        'screen': [1, 2, 0, 0, 0, 0, 0]
                    }
                },
                YlGn: {
                    3: ['rgb(247,252,185)', 'rgb(173,221,142)', 'rgb(49,163,84)'],
                    4: ['rgb(255,255,204)', 'rgb(194,230,153)', 'rgb(120,198,121)', 'rgb(35,132,67)'],
                    5: ['rgb(255,255,204)', 'rgb(194,230,153)', 'rgb(120,198,121)', 'rgb(49,163,84)', 'rgb(0,104,55)'],
                    6: ['rgb(255,255,204)', 'rgb(217,240,163)', 'rgb(173,221,142)', 'rgb(120,198,121)', 'rgb(49,163,84)', 'rgb(0,104,55)'],
                    7: ['rgb(255,255,204)', 'rgb(217,240,163)', 'rgb(173,221,142)', 'rgb(120,198,121)', 'rgb(65,171,93)', 'rgb(35,132,67)', 'rgb(0,90,50)'],
                    8: ['rgb(255,255,229)', 'rgb(247,252,185)', 'rgb(217,240,163)', 'rgb(173,221,142)', 'rgb(120,198,121)', 'rgb(65,171,93)', 'rgb(35,132,67)', 'rgb(0,90,50)'],
                    9: ['rgb(255,255,229)', 'rgb(247,252,185)', 'rgb(217,240,163)', 'rgb(173,221,142)', 'rgb(120,198,121)', 'rgb(65,171,93)', 'rgb(35,132,67)', 'rgb(0,104,55)', 'rgb(0,69,41)'],
                    'properties': {
                        'type': 'seq',
                        'blind': [1],
                        'print': [1, 1, 1, 0, 0, 0, 0],
                        'copy': [1, 2, 0, 0, 0, 0, 0],
                        'screen': [1, 1, 1, 0, 0, 0, 0]
                    }
                },
                Reds: {
                    3: ['rgb(254,224,210)', 'rgb(252,146,114)', 'rgb(222,45,38)'],
                    4: ['rgb(254,229,217)', 'rgb(252,174,145)', 'rgb(251,106,74)', 'rgb(203,24,29)'],
                    5: ['rgb(254,229,217)', 'rgb(252,174,145)', 'rgb(251,106,74)', 'rgb(222,45,38)', 'rgb(165,15,21)'],
                    6: ['rgb(254,229,217)', 'rgb(252,187,161)', 'rgb(252,146,114)', 'rgb(251,106,74)', 'rgb(222,45,38)', 'rgb(165,15,21)'],
                    7: ['rgb(254,229,217)', 'rgb(252,187,161)', 'rgb(252,146,114)', 'rgb(251,106,74)', 'rgb(239,59,44)', 'rgb(203,24,29)', 'rgb(153,0,13)'],
                    8: ['rgb(255,245,240)', 'rgb(254,224,210)', 'rgb(252,187,161)', 'rgb(252,146,114)', 'rgb(251,106,74)', 'rgb(239,59,44)', 'rgb(203,24,29)', 'rgb(153,0,13)'],
                    9: ['rgb(255,245,240)', 'rgb(254,224,210)', 'rgb(252,187,161)', 'rgb(252,146,114)', 'rgb(251,106,74)', 'rgb(239,59,44)', 'rgb(203,24,29)', 'rgb(165,15,21)', 'rgb(103,0,13)'],
                    'properties': {
                        'type': 'seq',
                        'blind': [1],
                        'print': [1, 2, 2, 0, 0, 0, 0],
                        'copy': [1, 2, 0, 0, 0, 0, 0],
                        'screen': [1, 2, 0, 0, 0, 0, 0]
                    }
                },
                RdPu: {
                    3: ['rgb(253,224,221)', 'rgb(250,159,181)', 'rgb(197,27,138)'],
                    4: ['rgb(254,235,226)', 'rgb(251,180,185)', 'rgb(247,104,161)', 'rgb(174,1,126)'],
                    5: ['rgb(254,235,226)', 'rgb(251,180,185)', 'rgb(247,104,161)', 'rgb(197,27,138)', 'rgb(122,1,119)'],
                    6: ['rgb(254,235,226)', 'rgb(252,197,192)', 'rgb(250,159,181)', 'rgb(247,104,161)', 'rgb(197,27,138)', 'rgb(122,1,119)'],
                    7: ['rgb(254,235,226)', 'rgb(252,197,192)', 'rgb(250,159,181)', 'rgb(247,104,161)', 'rgb(221,52,151)', 'rgb(174,1,126)', 'rgb(122,1,119)'],
                    8: ['rgb(255,247,243)', 'rgb(253,224,221)', 'rgb(252,197,192)', 'rgb(250,159,181)', 'rgb(247,104,161)', 'rgb(221,52,151)', 'rgb(174,1,126)', 'rgb(122,1,119)'],
                    9: ['rgb(255,247,243)', 'rgb(253,224,221)', 'rgb(252,197,192)', 'rgb(250,159,181)', 'rgb(247,104,161)', 'rgb(221,52,151)', 'rgb(174,1,126)', 'rgb(122,1,119)', 'rgb(73,0,106)'],
                    'properties': {
                        'type': 'seq',
                        'blind': [1],
                        'print': [1, 1, 1, 2, 0, 0, 0],
                        'copy': [1, 2, 0, 0, 0, 0, 0],
                        'screen': [1, 1, 1, 0, 0, 0, 0]
                    }
                },
                Greens: {
                    3: ['rgb(229,245,224)', 'rgb(161,217,155)', 'rgb(49,163,84)'],
                    4: ['rgb(237,248,233)', 'rgb(186,228,179)', 'rgb(116,196,118)', 'rgb(35,139,69)'],
                    5: ['rgb(237,248,233)', 'rgb(186,228,179)', 'rgb(116,196,118)', 'rgb(49,163,84)', 'rgb(0,109,44)'],
                    6: ['rgb(237,248,233)', 'rgb(199,233,192)', 'rgb(161,217,155)', 'rgb(116,196,118)', 'rgb(49,163,84)', 'rgb(0,109,44)'],
                    7: ['rgb(237,248,233)', 'rgb(199,233,192)', 'rgb(161,217,155)', 'rgb(116,196,118)', 'rgb(65,171,93)', 'rgb(35,139,69)', 'rgb(0,90,50)'],
                    8: ['rgb(247,252,245)', 'rgb(229,245,224)', 'rgb(199,233,192)', 'rgb(161,217,155)', 'rgb(116,196,118)', 'rgb(65,171,93)', 'rgb(35,139,69)', 'rgb(0,90,50)'],
                    9: ['rgb(247,252,245)', 'rgb(229,245,224)', 'rgb(199,233,192)', 'rgb(161,217,155)', 'rgb(116,196,118)', 'rgb(65,171,93)', 'rgb(35,139,69)', 'rgb(0,109,44)', 'rgb(0,68,27)'],
                    'properties': {
                        'type': 'seq',
                        'blind': [1],
                        'print': [1, 0, 0, 0, 0, 0, 0],
                        'copy': [1, 2, 0, 0, 0, 0, 0],
                        'screen': [1, 2, 0, 0, 0, 0, 0]
                    }
                },
                YlGnBu: {
                    3: ['rgb(237,248,177)', 'rgb(127,205,187)', 'rgb(44,127,184)'],
                    4: ['rgb(255,255,204)', 'rgb(161,218,180)', 'rgb(65,182,196)', 'rgb(34,94,168)'],
                    5: ['rgb(255,255,204)', 'rgb(161,218,180)', 'rgb(65,182,196)', 'rgb(44,127,184)', 'rgb(37,52,148)'],
                    6: ['rgb(255,255,204)', 'rgb(199,233,180)', 'rgb(127,205,187)', 'rgb(65,182,196)', 'rgb(44,127,184)', 'rgb(37,52,148)'],
                    7: ['rgb(255,255,204)', 'rgb(199,233,180)', 'rgb(127,205,187)', 'rgb(65,182,196)', 'rgb(29,145,192)', 'rgb(34,94,168)', 'rgb(12,44,132)'],
                    8: ['rgb(255,255,217)', 'rgb(237,248,177)', 'rgb(199,233,180)', 'rgb(127,205,187)', 'rgb(65,182,196)', 'rgb(29,145,192)', 'rgb(34,94,168)', 'rgb(12,44,132)'],
                    9: ['rgb(255,255,217)', 'rgb(237,248,177)', 'rgb(199,233,180)', 'rgb(127,205,187)', 'rgb(65,182,196)', 'rgb(29,145,192)', 'rgb(34,94,168)', 'rgb(37,52,148)', 'rgb(8,29,88)'],
                    'properties': {
                        'type': 'seq',
                        'blind': [1],
                        'print': [1, 1, 1, 2, 2, 2, 0],
                        'copy': [1, 2, 0, 0, 0, 0, 0],
                        'screen': [1, 1, 2, 0, 0, 0, 0]
                    }
                },
                Purples: {
                    3: ['rgb(239,237,245)', 'rgb(188,189,220)', 'rgb(117,107,177)'],
                    4: ['rgb(242,240,247)', 'rgb(203,201,226)', 'rgb(158,154,200)', 'rgb(106,81,163)'],
                    5: ['rgb(242,240,247)', 'rgb(203,201,226)', 'rgb(158,154,200)', 'rgb(117,107,177)', 'rgb(84,39,143)'],
                    6: ['rgb(242,240,247)', 'rgb(218,218,235)', 'rgb(188,189,220)', 'rgb(158,154,200)', 'rgb(117,107,177)', 'rgb(84,39,143)'],
                    7: ['rgb(242,240,247)', 'rgb(218,218,235)', 'rgb(188,189,220)', 'rgb(158,154,200)', 'rgb(128,125,186)', 'rgb(106,81,163)', 'rgb(74,20,134)'],
                    8: ['rgb(252,251,253)', 'rgb(239,237,245)', 'rgb(218,218,235)', 'rgb(188,189,220)', 'rgb(158,154,200)', 'rgb(128,125,186)', 'rgb(106,81,163)', 'rgb(74,20,134)'],
                    9: ['rgb(252,251,253)', 'rgb(239,237,245)', 'rgb(218,218,235)', 'rgb(188,189,220)', 'rgb(158,154,200)', 'rgb(128,125,186)', 'rgb(106,81,163)', 'rgb(84,39,143)', 'rgb(63,0,125)'],
                    'properties': {
                        'type': 'seq',
                        'blind': [1],
                        'print': [1, 0, 0, 0, 0, 0, 0],
                        'copy': [1, 2, 0, 0, 0, 0, 0],
                        'screen': [1, 0, 0, 0, 0, 0, 0]
                    }
                },
                GnBu: {
                    3: ['rgb(224,243,219)', 'rgb(168,221,181)', 'rgb(67,162,202)'],
                    4: ['rgb(240,249,232)', 'rgb(186,228,188)', 'rgb(123,204,196)', 'rgb(43,140,190)'],
                    5: ['rgb(240,249,232)', 'rgb(186,228,188)', 'rgb(123,204,196)', 'rgb(67,162,202)', 'rgb(8,104,172)'],
                    6: ['rgb(240,249,232)', 'rgb(204,235,197)', 'rgb(168,221,181)', 'rgb(123,204,196)', 'rgb(67,162,202)', 'rgb(8,104,172)'],
                    7: ['rgb(240,249,232)', 'rgb(204,235,197)', 'rgb(168,221,181)', 'rgb(123,204,196)', 'rgb(78,179,211)', 'rgb(43,140,190)', 'rgb(8,88,158)'],
                    8: ['rgb(247,252,240)', 'rgb(224,243,219)', 'rgb(204,235,197)', 'rgb(168,221,181)', 'rgb(123,204,196)', 'rgb(78,179,211)', 'rgb(43,140,190)', 'rgb(8,88,158)'],
                    9: ['rgb(247,252,240)', 'rgb(224,243,219)', 'rgb(204,235,197)', 'rgb(168,221,181)', 'rgb(123,204,196)', 'rgb(78,179,211)', 'rgb(43,140,190)', 'rgb(8,104,172)', 'rgb(8,64,129)'],
                    'properties': {
                        'type': 'seq',
                        'blind': [1],
                        'print': [1, 1, 1, 2, 2, 2, 0],
                        'copy': [1, 2, 0, 0, 0, 0, 0],
                        'screen': [1, 1, 2, 0, 0, 0, 0]
                    }
                },
                Greys: {
                    3: ['rgb(240,240,240)', 'rgb(189,189,189)', 'rgb(99,99,99)'],
                    4: ['rgb(247,247,247)', 'rgb(204,204,204)', 'rgb(150,150,150)', 'rgb(82,82,82)'],
                    5: ['rgb(247,247,247)', 'rgb(204,204,204)', 'rgb(150,150,150)', 'rgb(99,99,99)', 'rgb(37,37,37)'],
                    6: ['rgb(247,247,247)', 'rgb(217,217,217)', 'rgb(189,189,189)', 'rgb(150,150,150)', 'rgb(99,99,99)', 'rgb(37,37,37)'],
                    7: ['rgb(247,247,247)', 'rgb(217,217,217)', 'rgb(189,189,189)', 'rgb(150,150,150)', 'rgb(115,115,115)', 'rgb(82,82,82)', 'rgb(37,37,37)'],
                    8: ['rgb(255,255,255)', 'rgb(240,240,240)', 'rgb(217,217,217)', 'rgb(189,189,189)', 'rgb(150,150,150)', 'rgb(115,115,115)', 'rgb(82,82,82)', 'rgb(37,37,37)'],
                    9: ['rgb(255,255,255)', 'rgb(240,240,240)', 'rgb(217,217,217)', 'rgb(189,189,189)', 'rgb(150,150,150)', 'rgb(115,115,115)', 'rgb(82,82,82)', 'rgb(37,37,37)', 'rgb(0,0,0)'],
                    'properties': {
                        'type': 'seq',
                        'blind': [1],
                        'print': [1, 1, 2, 0, 0, 0, 0],
                        'copy': [1, 0, 0, 0, 0, 0, 0],
                        'screen': [1, 2, 0, 0, 0, 0, 0]
                    }
                },
                YlOrRd: {
                    3: ['rgb(255,237,160)', 'rgb(254,178,76)', 'rgb(240,59,32)'],
                    4: ['rgb(255,255,178)', 'rgb(254,204,92)', 'rgb(253,141,60)', 'rgb(227,26,28)'],
                    5: ['rgb(255,255,178)', 'rgb(254,204,92)', 'rgb(253,141,60)', 'rgb(240,59,32)', 'rgb(189,0,38)'],
                    6: ['rgb(255,255,178)', 'rgb(254,217,118)', 'rgb(254,178,76)', 'rgb(253,141,60)', 'rgb(240,59,32)', 'rgb(189,0,38)'],
                    7: ['rgb(255,255,178)', 'rgb(254,217,118)', 'rgb(254,178,76)', 'rgb(253,141,60)', 'rgb(252,78,42)', 'rgb(227,26,28)', 'rgb(177,0,38)'],
                    8: ['rgb(255,255,204)', 'rgb(255,237,160)', 'rgb(254,217,118)', 'rgb(254,178,76)', 'rgb(253,141,60)', 'rgb(252,78,42)', 'rgb(227,26,28)', 'rgb(177,0,38)'],
                    9: ['rgb(255,255,204)', 'rgb(255,237,160)', 'rgb(254,217,118)', 'rgb(254,178,76)', 'rgb(253,141,60)', 'rgb(252,78,42)', 'rgb(227,26,28)', 'rgb(189,0,38)', 'rgb(128,0,38)'],
                    'properties': {
                        'type': 'seq',
                        'blind': [1],
                        'print': [1, 1, 2, 2, 0, 0, 0],
                        'copy': [1, 2, 2, 0, 0, 0, 0],
                        'screen': [1, 2, 2, 0, 0, 0, 0]
                    }
                },
                PuRd: {
                    3: ['rgb(231,225,239)', 'rgb(201,148,199)', 'rgb(221,28,119)'],
                    4: ['rgb(241,238,246)', 'rgb(215,181,216)', 'rgb(223,101,176)', 'rgb(206,18,86)'],
                    5: ['rgb(241,238,246)', 'rgb(215,181,216)', 'rgb(223,101,176)', 'rgb(221,28,119)', 'rgb(152,0,67)'],
                    6: ['rgb(241,238,246)', 'rgb(212,185,218)', 'rgb(201,148,199)', 'rgb(223,101,176)', 'rgb(221,28,119)', 'rgb(152,0,67)'],
                    7: ['rgb(241,238,246)', 'rgb(212,185,218)', 'rgb(201,148,199)', 'rgb(223,101,176)', 'rgb(231,41,138)', 'rgb(206,18,86)', 'rgb(145,0,63)'],
                    8: ['rgb(247,244,249)', 'rgb(231,225,239)', 'rgb(212,185,218)', 'rgb(201,148,199)', 'rgb(223,101,176)', 'rgb(231,41,138)', 'rgb(206,18,86)', 'rgb(145,0,63)'],
                    9: ['rgb(247,244,249)', 'rgb(231,225,239)', 'rgb(212,185,218)', 'rgb(201,148,199)', 'rgb(223,101,176)', 'rgb(231,41,138)', 'rgb(206,18,86)', 'rgb(152,0,67)', 'rgb(103,0,31)'],
                    'properties': {
                        'type': 'seq',
                        'blind': [1],
                        'print': [1, 1, 1, 0, 0, 0, 0],
                        'copy': [1, 2, 0, 0, 0, 0, 0],
                        'screen': [1, 1, 1, 0, 0, 0, 0]
                    }
                },
                Blues: {
                    3: ['rgb(222,235,247)', 'rgb(158,202,225)', 'rgb(49,130,189)'],
                    4: ['rgb(239,243,255)', 'rgb(189,215,231)', 'rgb(107,174,214)', 'rgb(33,113,181)'],
                    5: ['rgb(239,243,255)', 'rgb(189,215,231)', 'rgb(107,174,214)', 'rgb(49,130,189)', 'rgb(8,81,156)'],
                    6: ['rgb(239,243,255)', 'rgb(198,219,239)', 'rgb(158,202,225)', 'rgb(107,174,214)', 'rgb(49,130,189)', 'rgb(8,81,156)'],
                    7: ['rgb(239,243,255)', 'rgb(198,219,239)', 'rgb(158,202,225)', 'rgb(107,174,214)', 'rgb(66,146,198)', 'rgb(33,113,181)', 'rgb(8,69,148)'],
                    8: ['rgb(247,251,255)', 'rgb(222,235,247)', 'rgb(198,219,239)', 'rgb(158,202,225)', 'rgb(107,174,214)', 'rgb(66,146,198)', 'rgb(33,113,181)', 'rgb(8,69,148)'],
                    9: ['rgb(247,251,255)', 'rgb(222,235,247)', 'rgb(198,219,239)', 'rgb(158,202,225)', 'rgb(107,174,214)', 'rgb(66,146,198)', 'rgb(33,113,181)', 'rgb(8,81,156)', 'rgb(8,48,107)'],
                    'properties': {
                        'type': 'seq',
                        'blind': [1],
                        'print': [1, 2, 0, 0, 0, 0, 0],
                        'copy': [1, 0, 0, 0, 0, 0, 0],
                        'screen': [1, 2, 0, 0, 0, 0, 0]
                    }
                },
                PuBuGn: {
                    3: ['rgb(236,226,240)', 'rgb(166,189,219)', 'rgb(28,144,153)'],
                    4: ['rgb(246,239,247)', 'rgb(189,201,225)', 'rgb(103,169,207)', 'rgb(2,129,138)'],
                    5: ['rgb(246,239,247)', 'rgb(189,201,225)', 'rgb(103,169,207)', 'rgb(28,144,153)', 'rgb(1,108,89)'],
                    6: ['rgb(246,239,247)', 'rgb(208,209,230)', 'rgb(166,189,219)', 'rgb(103,169,207)', 'rgb(28,144,153)', 'rgb(1,108,89)'],
                    7: ['rgb(246,239,247)', 'rgb(208,209,230)', 'rgb(166,189,219)', 'rgb(103,169,207)', 'rgb(54,144,192)', 'rgb(2,129,138)', 'rgb(1,100,80)'],
                    8: ['rgb(255,247,251)', 'rgb(236,226,240)', 'rgb(208,209,230)', 'rgb(166,189,219)', 'rgb(103,169,207)', 'rgb(54,144,192)', 'rgb(2,129,138)', 'rgb(1,100,80)'],
                    9: ['rgb(255,247,251)', 'rgb(236,226,240)', 'rgb(208,209,230)', 'rgb(166,189,219)', 'rgb(103,169,207)', 'rgb(54,144,192)', 'rgb(2,129,138)', 'rgb(1,108,89)', 'rgb(1,70,54)'],
                    'properties': {
                        'type': 'seq',
                        'blind': [1],
                        'print': [1, 2, 2, 0, 0, 0, 0],
                        'copy': [1, 2, 0, 0, 0, 0, 0],
                        'screen': [1, 1, 2, 0, 0, 0, 0]
                    }
                }
            }
        };
    }
}

class WebGLUtils {

    /**
     * Calculates the scale and offset(X and Y) for the Web Mercator projection.
     * @static
     * @param {number} longitudeCenter - Longitude of the given position.
     * @param {number} latitudeCenter - Latitude of the given position.
     * @param {number} zoom - Current zoom level of the background map.
     * @param {number} tileSize - The size of each tile in the background map. Usually is 256. If different should be given in the API options.
     * @param {number} width - Width of the current canvas.
     * @param {number} height - Height of the current canvas.
     * @returns {{scale: number, offsetX: number, offsetY: number}} - Returns the scale, offsetX and offsetY of the point given using the Web Mercator projection.
     * @see https://bl.ocks.org/enjalot/fb7f3d696167e9b83a72#viewport.js
     * @see https://en.wikipedia.org/wiki/Web_Mercator
     * @memberOf WebGLUtils
     */
    static webMercatorProjection(longitudeCenter, latitudeCenter, zoom, tileSize, width, height) {
        // console.log(longitudeCenter, latitudeCenter, zoom, tileSize,  width, height);
        let PI = Math.PI;
        let scale = ((tileSize / 2) / PI) * Math.pow(2, zoom);
        let lambda = longitudeCenter * (PI / 180); // Convert longitude to radians
        let phi = latitudeCenter * (PI / 180); // Convert latitude to radians

        let xCenter = scale * (lambda + PI);
        let yCenter = scale * (PI - Math.log(Math.tan((PI / 4) + (phi / 2))));
        let offsetX = (width / 2) - xCenter;
        let offsetY = (height / 2) - yCenter;


        return { scale: scale, offsetX: offsetX, offsetY: offsetY };
    }

    /**
     * This is the result matrix from the multiplication of M1*M2*M3
     * @static
     * @param {number} scale - The scale calculated with WebMercator projection.
     * @param {number} width - The width of the canvas.
     * @param {number} height - The height of the canvas.
     * @param {number} offsetX - The offsetX calculated with WebMercator projection.
     * @param {number} offsetY - The offsetY calculated with WebMercator projection.
     * @returns {Float32Array} The resulting matrix (M1*M2*M3) in a single matrix to send to WebGL in order to calculate the resulting position.
     * @see Rui's thesis
     * @memberOf WebGLUtils
     */
    static finalMatrix(scale, width, height, offsetX, offsetY) {
        let p0 = (2 * Math.PI * scale) / (width * 180);
        let p2 = ((2 * Math.PI * scale) / width) + ((2 * offsetX) / width) - 1;
        let p4 = (2 * scale) / height;
        let p5 = ((2 * offsetY / height) - 1);
        return new Float32Array([
            p0, 0, 0,
            0, p4, 0,
            p2, p5, 1
        ]);
    }

    /**
     * Creates shaders(Vertex + Fragment) source code.
     * @static
     * @returns {{vertexCode: string, fragmentCode: string}} - The code for the vertex and fragment shaders.
     * @memberOf WebGLUtils
     */
    static generateShadersSourceCode() {
        let vertexSourceCode =
            `
            #define PI radians(180.0)

            attribute vec2 coords;
            uniform mat3 M;
            
         	attribute float aPointSize; 
         	attribute float a_opacity; 
         	varying float v_opacity; 

         	void main() {
                float phi = coords[1] * (PI / 180.0);
                float YValue = PI -log( tan((PI/4.0) + phi/2.0) );
                vec3 f = vec3(coords[0], YValue, 1.0);
                vec3 pixeis = M * f;
                float X = pixeis[0];
                float Y = -(pixeis[1]);
                gl_Position = vec4(X, Y , 0.0, 1.0);
         		
         		gl_PointSize = aPointSize; 
                v_opacity = a_opacity; 
            }
        `;

        let fragmentSourceCode =
            ` 
            precision mediump float;
         	uniform vec4 u_color;
         	varying float v_opacity; 
           	uniform float isPoint;
            void main() {
         		float border = 0.5;
         		float radius = 0.5;
         		float centerDist = length(gl_PointCoord - 0.5);
         		float alpha;
         		if (u_color[3] == -1.0)    
         			alpha =  v_opacity * step(centerDist, radius);
         		else 
         			alpha =  u_color[3] * step(centerDist, radius);

         		if(isPoint == 1.0 ) {
         		    if (alpha < 0.1) discard;
         			    gl_FragColor = vec4(u_color[0], u_color[1], u_color[2], alpha);
                }
           		else
         			gl_FragColor = vec4(u_color[0], u_color[1], u_color[2], u_color[3]);
         	}
        `;
        return { vertexCode: vertexSourceCode, fragmentCode: fragmentSourceCode };
    }

    /**
     * Creates and compiles a shader.
     * @static
     * @param {string} type - Type of shader. Options are: VERTEX_SHADER or FRAGMENT_SHADER;
     * @param {string} source_code - The shader source code.
     * @param {Map#_webgl} webgl - Webgl object used by the Map class.
     * @returns {WebGLShader} - The shader(vertex of fragment).
     * @memberOf WebGLUtils
     */
    static createAndCompileShader(type, source_code, webgl) {
        let shader = webgl.gl.createShader(type);
        webgl.gl.shaderSource(shader, source_code);
        webgl.gl.compileShader(shader);
        return shader;
    }

    /**
     * Initializes:
     * 1)WebGLProgram, 2) Generates shadders, 3) Attaches shaders to the program, 4) links program, 5) uses program.
     * @static
     * @param {{gl: WebGLRenderingContext, program: WebGLProgram}} webgl 
     * @returns {void}
     * @memberOf WebGLUtils
     */
    static createWebGLProgram(webgl) {
        webgl.program = webgl.gl.createProgram();

        const source_code = this.generateShadersSourceCode();
        const vertex_shader = this.createAndCompileShader(webgl.gl.VERTEX_SHADER, source_code.vertexCode, webgl);
        const fragment_shader = this.createAndCompileShader(webgl.gl.FRAGMENT_SHADER, source_code.fragmentCode, webgl);

        webgl.gl.attachShader(webgl.program, vertex_shader);
        webgl.gl.attachShader(webgl.program, fragment_shader);

        webgl.gl.linkProgram(webgl.program);
        webgl.gl.useProgram(webgl.program);
    }


    /** ########################    DEPRECATED ZONE ######################## */
    /**
     * Creates the M1 Matrix. 
     * This matrix is used to convert the result pixel to a position between 0 and 1(2/width and 2/height scaling) 
     * and after that convert to a position between -1 and 1(-1 translation).
     * @static
     * @param {number} width - Width of the canvas.
     * @param {number} height - Height of the canvas.
     * @returns {Float32Array} The matrix M1 to be used to calculate each point/vertex position.
     * @see Documentation of Rui's thesis. 
     * @deprecated finalMatrix(..) method is used instead.
     * @memberOf WebGLUtils
     */
    static createM1(width, height) {
        let w = 2 / width;
        let h = 2 / height;
        return new Float32Array(
            [
                w, 0, -1,
                0, h, -1,
                0, 0, 1
            ]
        );
    }

    /**
     * Creates the M2 Matrix.
     * This matrix is used to calculate the positions of the pixel using the Web Mercator projection.
     * @static 
     * @param {number} scale 
     * @param {number} offsetX 
     * @param {number} offsetY 
     * @returns {Float32Array} The matrix M2 to be used to calculate each point/vertex position.
     * @see https://bl.ocks.org/enjalot/fb7f3d696167e9b83a72#viewport.js
     * @see Documentation of Rui's thesis. 
     * @deprecated finalMatrix(..) method is used instead.
     * @memberOf WebGLUtils
     */
    static createM2(scale, offsetX, offsetY) {
        let s = scale;
        let x = offsetX;
        let y = offsetY;
        return new Float32Array(
            [
                s, 0, x,
                0, s, y,
                0, 0, 1
            ]
        );
    }

    /**
     * Creates the M3 Matrix.
     * This matrix is used to calculate the positions of the pixel using the Web Mercator projection.
     * @static
     * @returns {Float32Array}  The matrix M3 to be used to calculate each point/vertex position.
     * @see Documentation of Rui's thesis.
     * @deprecated finalMatrix(..) method is used instead.
     * @memberOf WebGLUtils
     */
    static createM3() {
        let p = Math.PI;
        let q = p / 180;
        return new Float32Array(
            [
                q, 0, p,
                0, 1, 0,
                0, 0, 1
            ]
        );
    }

    /**
     * Performs Matrix multiplication between two matrices.
     * @static
     * @param {Float32Array} M1 - The M1 matrix. 
     * @param {Float32Array} M2 - The M2 matrix.
     * @returns {Float32Array} a matrix which is the result of multiplying M1 by M2.
     * @deprecated finalMatrix(..) method is used instead.
     * @memberOf WebGLUtils
     */
    static matrixMultiplication(M1, M2) {
        let res = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]);
        res[0] = M1[0] * M2[0] + M1[1] * M2[3] + M1[2] * M2[6];
        res[1] = M1[0] * M2[1] + M1[1] * M2[4] + M1[2] * M2[7];
        res[2] = M1[0] * M2[2] + M1[1] * M2[5] + M1[2] * M2[8];

        res[3] = M1[3] * M2[0] + M1[4] * M2[3] + M1[5] * M2[6];
        res[4] = M1[3] * M2[1] + M1[4] * M2[4] + M1[5] * M2[7];
        res[5] = M1[3] * M2[2] + M1[4] * M2[5] + M1[5] * M2[8];

        res[6] = M1[6] * M2[0] + M1[7] * M2[3] + M1[8] * M2[6];
        res[7] = M1[6] * M2[1] + M1[7] * M2[4] + M1[8] * M2[7];
        res[8] = M1[6] * M2[2] + M1[7] * M2[5] + M1[8] * M2[8];
        return res;
    }

    /**
     * M28) Scale matrix with the given x(scaleX) and y(scaleY) values.
     * Scaling x and y, which is just scaling first two rows of matrix
     * @param {Float32Array} matrix 
     * @param {number} scaleX - Scale in X axis.
     * @param {number} scaleY - Scale in Y axis.
     * @see http://www.c-jump.com/bcc/common/Talk3/Math/Matrices/const_images/applying_scaling.png
     * @see http://ptgmedia.pearsoncmg.com/images/chap3_9780321902924/elementLinks/03fig27.jpg Remember WebGL is Column major
     * @see http://prntscr.com/eononb
     * @memberOf WebGLUtils
     */
    scaleProjection(matrix, scaleX, scaleY) {
        for (let i = 0; i < 8; i++)
            i < 4 ? (matrix[i] *= scaleX) : (matrix[i] *= scaleY);
    }

    /**
     * M29) The translation is performed in the last row of the matrix. 
     * @param {Float32Array} matrix - The matrix to hold the result.
     * @param {number} tx - Translation in X axis.  
     * @param {number} ty - Translation in Y axis.
     * @see http://polymathprogrammer.com/images/blog/200809/translationmatrix.png
     * @see http://prntscr.com/eononb
     * @memberOf WebGLUtils
     */
    translateProjection(matrix, tx, ty) {
        for (let i = 0; i < 4; i++)
            matrix[i + 12] += (matrix[i] * tx) + (matrix[i + 4] * ty);
    }
}

class Map {

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

class Legend {
    /**
     * Creates an instance of Legend class.
     * @param {number} id -  The id of the legend.
     * @param {string} title - The title for the legend.
     * 
     * @memberOf Legend
     */
    constructor(id, title) {
        /**
         * Title of the Gisplay map Legend.
         * @type {string}
         */
        this.title = title;
        /**
         * The div that contains the Legend.
         * @type {HTMLDivElement}
         */
        this.legendDiv = null;
        /**
         * The table element where the legend elements will be apppended.
         * @type {HTMLTableElement}
         */
        this.table = null;
        /**
         * Class name for the Legend? Not used?
         * @type {string}
         */
        this.className = null;
        /**
         * The last div to insert in the legend. Only for PSymbol Maps.
         * @type {HTMLDivElement}
         */
        this.lastdiv = undefined;
        /**
         * If it is the first insertion or not. Only for PSymbol Maps.
         * @type {boolean}
         */
        this.firstInsertion = false;
        /**
         * Constant to use when it's a Polygon.
         * @constant {number} POLYGON
         */
        this.POLYGON = 1;
        /**
        * Constant to use when it's a Point.
        * @constant {number} POLYGON
        */
        this.POINT = 2;

        this.init(id, null);
    }

    /**
     * Initialise Legend. Creates a table element and appends title, color element and value element.
     * @param {number} id - The id of this Legend.
     * @param {string} classname - The class name to be usde by the Legend.
     * @memberOf Legend
     */
    init(id, classname) {
        //const mapCanvas = document.getElementById(`mapCanvas${id}`); //@TODO: Remove
        this.legendDiv = document.createElement('div');
        if (classname != undefined && classname != null)
            this.legendDiv.className = classname;
        else
            this.legendDiv.className = '_gisplaylegendBR';

        this.legendDiv.id = `legendDiv${id}`;

        this.table = document.createElement('table');
        this.table.style.zIndex = "2000";
        const thvalue = document.createElement('th');
        const thcolor = document.createElement('th');
        thcolor.style.align = "center";

        this.table.appendChild(thcolor);
        this.table.appendChild(thvalue);

        const titlerow = document.createElement('tr');
        const titletd = document.createElement('td');
        titletd.colSpan = 2;
        titletd.style.textAlign = 'center';
        titletd.style.width = 100;
        const titletext = document.createTextNode(this.title);
        titletd.appendChild(titletext);
        titlerow.appendChild(titletd);
        this.table.appendChild(titlerow);
    }

    /**
     * Inserts one row for the Aesthetic object.
     * Used in Dot Maps.
     * @param {Aesthetic} currentaes - The Aesthetic object 
     * @param {Map} mapobj - The Map object where the point row will be added. 
     * @see Diogo's thesis Page 69 5.1c
     * @memberOf Legend
     */
    insertPointRow(currentaes, mapobj) {
        this.insertRow(currentaes, mapobj, this.POINT);
    }

    /**
     * Inserts one polygon row into the Legend. Used for area based Maps (Choropleth and Chorocromatic).
     * @param {Aesthetic} currentaes  - The Aesthetic object 
     * @param {Map} mapobj - The map where to insert a polygon row.
     * @see Diogo's thesis Page 69 5.1b
     * @memberOf Legend
     */
    insertPolygonRow(currentaes, mapobj) {
        this.insertRow(currentaes, mapobj, this.POLYGON);
    }

    /**
     * Adds one row to the Legend and attaches an on click event to said row.
     * @param {Aesthetic} currentaes  - The Aesthetic object.
     * @param {Map} mapobj - The map where to insert a polygon row.
     * @param {number} type - The type of row to insert. 1=Polygon, 2=Point. @TODO: Should be constant
     * @memberOf Legend
     */
    insertRow(currentaes, mapobj, type) {
        const row = document.createElement('tr');
        const value = document.createElement('td');
        const color = document.createElement('td');
        let text;
        if (typeof currentaes.range[0] === 'number') {
            const mininput = currentaes.range[0] != null ? currentaes.range[0] : mapobj.min;
            const maxinput = currentaes.range[1] != null ? currentaes.range[1] : mapobj.max;
            if (!currentaes.isOuter())
                text = document.createTextNode(`[${mininput}, ${maxinput}[`);
            else
                text = document.createTextNode(`[${mininput}, ${maxinput}]`);
        }
        else
            text = document.createTextNode(currentaes.range[0]);

        value.appendChild(text);
        const colorDiv = document.createElement('div');
        colorDiv.style.position = 'relative';

        const [r, g, b, a] = currentaes.getFillColor();
        const rgba = `rgba(${r},${g},${b},${a})`;
        colorDiv.style['backgroundColor'] = rgba;
        if (type === this.POLYGON) {//polygon
            colorDiv.style.height = 25;
            colorDiv.style.width = 80;
            if (currentaes.getStrokeColor() != null) {//&& currentaes != undefined
                const [r, g, b, a] = currentaes.getStrokeColor();
                colorDiv.style['borderColor'] = `rgba(${r},${g},${b},${a})`;
            }
            colorDiv.className = '_gisplayrectangle';
        }
        else if (type === this.POINT) {//point
            let size;
            if (currentaes.getPointSize() != null)
                size = Math.max(currentaes.getPointSize(), 5);
            else
                size = 25;
            colorDiv.style.height = size;
            colorDiv.style.width = size;
            colorDiv.className = '_gisplaycircle';
        }

        color.appendChild(colorDiv);
        row.appendChild(color);
        row.appendChild(value);

        row.onclick = () =>  {
            if (mapobj.gisplayOptions.legendToggle) {
                const toFade = !currentaes.enableDisable();
                if (toFade)
                    this.className += " _gisplayfade";
                else
                    this.className = this.className.replace(/(?:^|\s)_gisplayfade(?!\S)/g, '');
            }
            if (mapobj.gisplayOptions.legendOnClickFunction != null && mapobj.gisplayOptions.legendOnClickFunction != undefined)
                mapobj.gisplayOptions.legendOnClickFunction(currentaes);
            mapobj.draw();
        };
        this.table.appendChild(row);
    }

    /**
     * Inserts one Proportional symbols legend element.
     * Used by PSymbols Maps.
     * @param {Aesthetic} currentaes  - The Aesthetic object.
     * @param {Map} mapobj - The map where to insert the proportion symbols element.
     * @param {number} numLegendItems - Number of items to be created.
     * @see Diogo's thesis Page 69 5.1a
     * @memberOf Legend
     */
    insertProportionalSymbols(currentaes, mapobj, numLegendItems) {
        if (this.lastdiv === undefined) {//First insertion
            var row = document.createElement('tr');
            var value = document.createElement('td');
            value.colSpan = 2;
            value.style.textAlign = 'center';
            this.firstInsertion = true;
        }
        else
            this.firstInsertion = false;

        let strokecolor;
        let [sr, sg, sb, sa] = currentaes.getStrokeColor();//console.log("PropSymbols Insert >>>", sr, sg, sb, sa);
        let [r, g, b, a] = currentaes.getFillColor(); //console.log("PropSymbols Insert >>>", r, g, b, a);
        const rgba = `rgba(${r},${g},${b},${a})`;// const rgbc = `rgba(${currentaes.fillColor[0]},${currentaes.fillColor[1]},${currentaes.fillColor[2]},${1})`;

        if (currentaes.getStrokeColor() != null && currentaes != undefined) //TODO: Remove && curr..
            strokecolor = `rgba(${sr},${sg},${sb},${sa})`;
        else
            strokecolor = `rgba(${0},${0},${0},${1})`;

        for (let i = numLegendItems - 1; i >= 0; i--) {
            const current = document.createElement('div');
            let propvalue;
            if (!this.firstInsertion && i === (numLegendItems - 1) || numLegendItems === 1)
                propvalue = currentaes.range[1];
            else
                propvalue = mapobj.min + i / (numLegendItems - 1) * (mapobj.max - mapobj.min);

            const text = document.createTextNode(Math.round(propvalue)); //TODO: this.round(propValue) ?
            current.appendChild(text);
            const colorDiv = document.createElement('div');
            colorDiv.style.position = 'relative';
            colorDiv.style.backgroundColor = rgba;
            colorDiv.className = '_gisplayproportionalcircle';
            colorDiv.style.borderColor = strokecolor;
            const temppointsize = ((mapobj.gisplayOptions.maxPointSize - mapobj.gisplayOptions.minPointSize) / (mapobj.max - mapobj.min)) * (propvalue - mapobj.min);
            const size = Math.max(temppointsize, 7.5);
            colorDiv.style.height = size;
            colorDiv.style.width = size;
            colorDiv.style.inherit = false;

            colorDiv.onclick = function (e) {
                if (mapobj.gisplayOptions.legendToggle) {
                    const toFade = !currentaes.enableDisable();
                    if (toFade)
                        this.className += " _gisplayfade";
                    else
                        this.className = this.className.replace(/(?:^|\s)_gisplayfade(?!\S)/g, '');
                }
                if (mapobj.gisplayOptions.legendOnClickFunction != null && mapobj.gisplayOptions.legendOnClickFunction != undefined)
                    mapobj.gisplayOptions.legendOnClickFunction(currentaes);
                mapobj.draw();

                /*if (!e)
                    var e = window.event; //TODO: Remove??*/
                e.cancelBubble = true;
                if (e.stopPropagation)
                    e.stopPropagation();
            };

            current.appendChild(colorDiv);
            if (this.lastdiv != undefined) {
                this.lastdiv.appendChild(current);
                this.lastdiv = colorDiv;
            }
            else {//1st insertion
                value.appendChild(current);
                this.lastdiv = colorDiv;
            }
        }

        if (this.firstInsertion) {//1st insertion
            row.appendChild(value);
            this.table.appendChild(row);
        }
    }

    /**
     * Appends the legend div element to the map container. Used by all Maps.
     * @param {BGMapWrapper} bgMap - The background map where the legend will be appended to. 
     */
    insertLegend(bgMap) {
        this.legendDiv.appendChild(this.table);
        bgMap.getContainer().appendChild(this.legendDiv);
    }

    /**
     * Inserts in the Legend one gradient according to the Aesthetic object.
     * Use in Change Maps. 
     * @param {Map} mapobj - The map where to insert the gradient row.
     * @param {number} left - Left value of the Legend (minimum change).
     * @param {number} middle - Value at the center of the change(aka break point).
     * @param {number} right - Right value of the legend (maximum value).
     * @see Diogo's thesis page 69 Figure 5.1d
     * @deprecated Not used, since now Change Maps use classes instead of gradient.
     * @memberOf Legend
     */
    insertGradient(mapobj, left, middle, right) {
        const row = document.createElement('tr');
        const value = document.createElement('td');
        const valueDiv = document.createElement('div');
        value.colSpan = 2;
        value.style.textAlign = 'center';
        let numberofAesthetics = 5;
        if (mapobj.aesthetics.length > 5)
            numberofAesthetics = mapobj.aesthetics.length;

        let strcolor = '';
        for (let i = 0; i < numberofAesthetics; i++) {
            let [r, g, b] = mapobj.fcolor(i / numberofAesthetics).rgb();
            let [roundR, roundG, roundB] = [Math.round(r), Math.round(g), Math.round(b)];
            strcolor += `,rgba(${roundR},${roundG},${roundB},${mapobj.gisplayOptions.alpha})`;
        }
        valueDiv.style.background = `-webkit-linear-gradient(left${strcolor})`;

        valueDiv.style.height = 25;
        valueDiv.style.width = 130;

        const row2 = document.createElement('tr');
        const value2 = document.createElement('td');
        const divleft = document.createElement('div');

        value2.colSpan = 2;
        divleft.style.textAlign = 'left';
        divleft.style.width = '33%';
        divleft.style.display = "inline-block";
        const lefttext = document.createTextNode(left);
        const divmid = document.createElement('div');
        divmid.style.textAlign = 'center';
        divmid.style.width = '33%';
        divmid.style.display = "inline-block";
        const text = document.createTextNode(middle);
        const divright = document.createElement('div');
        divright.style.textAlign = 'right';
        divright.style.width = '33%';
        divright.style.display = "inline-block";
        const righttext = document.createTextNode(right);

        divleft.appendChild(lefttext);
        divmid.appendChild(text);
        divright.appendChild(righttext);
        value2.appendChild(divleft);
        value2.appendChild(divmid);
        value2.appendChild(divright);
        value.appendChild(valueDiv);
        row2.appendChild(value2);
        row.appendChild(value);
        this.table.appendChild(row);
        this.table.appendChild(row2);
    }

}

class Feature {
    /**
     * Creates an instance of Feature.
     * @example 1-> {"id":0,"properties":{"f1":"Alabama","f2":"Autauga","f3":150,"_gisplayid":0},
                     "triangles":[{"itemSize":2,"numItems":417}],"borders":[{"itemSize":2,"numItems":141}],"points":[]}
     * @param {number} id - This Feature id.
     * @param {{fx: string, _gisplayid:number}} properties - Properties associated with this Feature.  
     * @param {{itemSize: number, numItems: number}} triangles - Number of triangles associated with this Feature. 
     * @param {{itemSize: number, numItems: number}} borders - Number of borders associated with this Feature.
     * @param {number[]} points - The points that belong to this Feature.
     * 
     * @memberOf Feature
     */
    constructor(id, properties, triangles, borders, points) {
        /**
         * This Feature id.
         * @type {number} 
         */
        this._id = id;
        /**
         * Properties associated with this Feature.
         * @type {{fx: string, _gisplayid:number}}  
         */
        this._properties = properties;
        /**
         * Number of triangles associated with this Feature. The Object that contains the itemSize and numItems is a WebGLBuffer.
         * @type {{itemSize: number, numItems: number}}
         */
        this._triangles = triangles;
        /**
         * Number of borders associated with this Feature. The Object that contains the itemSize and numItems is a WebGLBuffer.
         * @type {{itemSize: number, numItems: number}}
         */
        this._borders = borders;
        /**
         * The points that belong to this Feature.  The Object that contains the itemSize and numItems is a WebGLBuffer.
         * @type {{itemSize: number, numItems: number}}
         */
        this._points = points;
    }

    /**
     * Returns all triangles that belong to the Feature.
     * @returns {Feature._triangles} - All triangles that belong to the Feature.
     * @memberOf Feature
     */
    getTriangles() {
        return this._triangles;
    }

    /**
     * Returns all borders that belong to the Feature.
     * @returns {Feature._borders} - All borders that belong to the Feature.
     * @memberOf Feature
     */
    getBorders() {
        return this._borders;
    }

    /**
     * Returns all points that belong to the Feature.
     * @returns {Feature._points} - All points that belong to the Feature.
     * @memberOf Feature
     */
    getPoints() {
        return this._points;
    }

    /**
     * Returns all properties that belong to the Feature.
     * @returns {Feature._properties}
     * @memberOf Feature
     */
    getProperties() {
        return this._properties;
    }
}

class BGMapWrapper {

    /**
     * Creates an instance of BGMapWrapper.
     * @param {Object} bgmap - The background map object that came from the provider (e.g., Mapbox, Google Maps). 
     */
    constructor(bgmap) {
        /**
         * This is the background map object that comes from the background map provider(e.g., MapBox). 
         * @type {Object}
         */
        this.bgMapObject = bgmap;
    }

    /**
     * Returns the map's containing HTML element.
     * @return {HTMLElement} - The map's HTML element container.
     */
    getContainer() {
        throw new Error("Not implemented.");
    }

    /**
     * Returns the width of the canvas elment.
     * @returns {number} the width of the canvas elment.
     * @memberOf BGMapWrapper
     */
    getWidth() {
        return this.getContainer().offsetWidth;
    }

    /**
     * Returns the height of the canvas element.
     * @returns {number} the height of the canvas elment.
     * @memberOf BGMapWrapper
     */
    getHeight() {
        return this.getContainer().offsetHeight;
    }

    /**
     * Given one id it creates a canvas object.
     * @todo Understand case mapbox comment bellow.
     * @param {number} id - The id of the canvas to be created.
     * @return {HTMLElement} Canvas object where everything will be drawn.
     */
    createCanvas(id) {
        throw new Error("Not implemented.");
    }

    /**
     * Returns the map's current zoom level.
     * @return {number} - The map's current zoom level.
     */
    getZoom() {
        throw new Error("Not implemented.");
    }

    /**
     * Returns the longitude of the bounding box northwest corner.
     * @return {number} - Longitude of northwest corner, measured in degrees.
     */
    getCenterLng() {
        throw new Error("Not implemented.");
    }

    /**
     * Returns the latitude of the bounding box northwest corner.
     * @return {number} - Latitude of northwest corner, measured in degrees.
     */
    getCenterLat() {
        throw new Error("Not implemented.");
    }

    /**
     * Adds a listener to a specified event type.
     * @param {string} eventstr - The event type to add a listen for.
     * @param {Function} eventfunction - The function to be called when the event is fired. The listener function is called with the data object passed to  fire , extended with  target and  type properties.
     * @return {void} 
     */
    addEventListener(eventstr, eventfunction) {
        throw new Error("Not implemented.");
    }

    /**
     * Add Pan/Drag event.
     * @param {Function} fun - The function to be called when the user performs drag on the map.
     * @memberOf BGMapWrapper
     */
    addPanEvent(fun) {
        throw new Error("Not implemented.");
    }

    /**
     * Add zoom event.
     * @param {Function} fun - The function to be called when the user performs zoom in/out on the map.
     * @memberOf BGMapWrapper
     */
    addZoomEvent(fun) {
        throw new Error("Not implemented.");
    }

    /**
     * Add click event.
     * @param {Map} map - The function to be called when the user clicks on the map.
     * @memberOf BGMapWrapper
     */
    addClickEvent(map) {
        throw new Error("Not implemented.");
    }

    /**
     * Shows loader at the beginning when the API is loading the data.
     * @return {void} 
     * @see Page 72 Diogo's thesis.
     */
    showLoader() {
        if (this.loaderDiv === undefined) //@TODO: REMOVE If (See M1 + M8) 
            this.createLoader();
        else {
            if (this.loaderDiv.style.display === 'none')
                this.loaderDiv.style.display = 'flex';
            else
                this.loaderDiv.style.display = 'none';

            if (this.loaderDiv.className.includes('_gisplayhidden'))
                this.loaderDiv.className = this.loaderDiv.className.replace(/(?:^|\s)_gisplayhidden(?!\S)/g, '_gisplayLoaderOuterDiv');
            else
                this.loaderDiv.className = this.loaderDiv.className.replace(/(?:^|\s)_gisplayLoaderOuterDiv(?!\S)/g, '_gisplayhidden');
        }
    }

    /**
     * Auxiliar method to be called when there is no loader  and we want to create one.
     * @return {void} 
     */
    createLoader() {
        const outerDiv = document.createElement('div');
        const innerDiv = document.createElement('div');
        innerDiv.className = '_gisplayloader';

        const mapDiv = this.getContainer();
        outerDiv.className = '_gisplayLoaderOuterDiv';
        outerDiv.style.height = mapDiv.offsetHeight;
        outerDiv.style.width = mapDiv.offsetWidth;
        outerDiv.appendChild(innerDiv);
        /**
         * The div that contains the loader.
         * @type {HTMLDivElement}
         */
        this.loaderDiv = outerDiv;
        mapDiv.parentElement.insertBefore(outerDiv, mapDiv);
    }

    /**
     * Returns the background map object. This is the Background provider object (e.g., Mapbox, GMaps, HereMaps, Bing Maps).
     * @returns {BGMapWrapper#bgMapObject} the background map object.
     * @memberOf BGMapWrapper
     */
    getBackgroundMapProviderObject() {
        return this.bgMapObject;
    }
}

class Aesthetic {

    /**
     * Creates an instance of Aesthetic. 
     * There will be as many Aesthetic objects as the number of classes on the Legend. 
     * @example 1-> {"id":0,"attr":"f3","fcolor":[255,255,255,0.8],
     *         "stroke":[0,0,0,1],"pointsize":null,"range":[1,37]}
     * @example 2-> {"id":1,"attr":"f3","fcolor":[255,255,0,0.8],
     *         "stroke":[0,0,0,1],"pointsize":null,"range":[37,78]}
     * @param {number} id - The unique id of the Aesthetic object.
     * @param {string} attr - The attribute being mapped on this Aesthetic.
     * @param {number[]|Function} fcolor - The color to fill the Aesthetic element(RGBA).
     * @param {number[]} stroke - Stroke color values(RGBA).
     * @param {number|null} pointsize - Size of the Aesthetic point to be drawn (Used only in maps that require dots to be drawn).
     * @param {number[]} range - The range for this particular Aesthetic element.
     * 
     * @memberOf Aesthetic
     */
    constructor(id, attr, fcolor, stroke, pointsize, range) {
        /**
         * The unique id of the Aesthetic object. 
         * @type {number}
         */
        this.id = id;
        /**
         * The attribute being mapped on the Aesthetic.
         * @type {string}
         */
        this._attr = attr;
        /**
         * The color to fill the Aesthetic element(RGBA) OR a function to create this color.
         * @type {number[4]|Function}
         */
        this.fillColor = fcolor;
        /**
         * Stroke color values(RGBA).
         * @type {number[4]}
         */
        this.strokeColor = stroke;
        /**
         * The size of the Aesthetic point to be drawn (Used only in maps that require dots to be drawn).
         * @type {number|null}
         */
        this.pointSize = pointsize === null ? 1.0 : parseFloat(pointsize);
        /**
         * The range for this particular Aesthetic element.
         * @type {number[2]}
         */
        this.range = range;
        /**
         * This Array will keep track of all Features associated with this Aesthetic object.
         * @type {Array<Feature>}
         */
        this._features = new Array();
        /**
         * This Array is used for? 
         * @todo
         * @type {Array<Feature>}
         */
        this._allFeatures = new Array();
        /**
         * This particular element will be active or not in the Legend.
         * @type {boolean}
         */
        this.enabled = true;//Elemento da legenda ativo ou desativo
        /**
         * Outer is used for the last element of the Legend. Example [500, 1000]<
         * @type {boolean}
         */
        this.outer = false;
    }

    /**
     * Adds a new feature to this Aesthetic object.
     * @param {number} id - The Feature id. Each feature will have a different id inside this Aesthetic object.
     * @param {{fx: string, _gisplayid:number}} properties - Properties associated with the Feature.
     * @param {{itemSize: number, numItems: number}} triangles - Number of triangles associated with the Feature.
     * @param {{itemSize: number, numItems: number}} borders - Number of borders associated with the Feature.
     * @param {{itemSize: number, numItems: number}} points - The points that belong to the Feature.
     * 
     * @memberOf Aesthetic
     */
    addFeature(id, properties, triangles, borders, points) {
        this._features.push(new Feature(id, properties, triangles, borders, points));
    }

    /**
     * Gets this Aesthetic attribute.
     * @returns {Aesthetic._attr} - The string representing the attr of this Aesthetic.
     * 
     * @memberOf Aesthetic
     */
    getAttr() {
        return this._attr;
    }

    /**
     * Verifies the existence or not of the property Aesthethic._attr and if it fits inside this Aesthetic range.
     * @param {string} value - The attribute ?.
     * @returns {boolean} - True if there's no range or it is inside the range or ?, otherwise, false.
     * 
     * @memberOf Aesthetic
     */
    checkProperty(value) {
        if (this.range === null)
            return true;
        else {
            if (typeof value === 'number')
                return ((this.range[0] === null || value >= this.range[0]) &&
                    (this.range[1] === null || (value < this.range[1] || (value <= this.range[1] && this.isOuter()))));
            else
                return (value === this.range[0]);
        }
    }

    /**
     * Add new grouped feature. Only used for Maps with points. 
     * @todo Finish document of this method.
     * @param {number} id - The id of the Feature.
     * @param {{buffer: WebGLBuffer, itemSize: number, numItems: number}} triangles - Triangles that belong to the Feature.
     * @param {{buffer: WebGLBuffer, itemSize: number, numItems: number}} borders - Borders that belong to the Feature.
     * @param {{buffer: WebGLBuffer, itemSize: number, numItems: number}} points - Points that belong to the Feature.
     * @see Diogo's thesis page 57/58
     */
    addGroupedFeature(id, triangles, borders, points) {
        this._allFeatures.push(new Feature(id, null, triangles, borders, points));
    }

    /**
     * Inverts this Aesthetic element state in the Legend object.
     * If it was enabled it will be disabled or vice-versa.
     * @returns {boolean} Inverse of current enabled value.
     */
    enableDisable() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    /**
     * Returns all Features that belong to this Aesthetic object.
     * @returns {Array<Feature>} - All the Features of this Aeshtetic.
     * @memberOf Aesthetic
     */
    getFeatures() {
        return this._features;
    }

    /**
     * Returns all Features as one?
     * @returns {Array<Feature>} - All features grouped together?
     * @memberOf Aesthetic
     */
    getAllFeatures() {
        return this._allFeatures;
    }

    /**
     * Returns the stroke color for this Aesthetic object.
     * @returns {Aesthetic#strokeColor}
     * @memberOf Aesthetic
     */
    getStrokeColor() {
        return this.strokeColor;
    }

    /**
     * Returns the fill color for this Aesthetic object.
     * @returns {Aesthetic#fillColor}
     * @memberOf Aesthetic
     */
    getFillColor() {
        return this.fillColor;
    }

    /**
     * Returns the size of this Aesthetic points.
     * @returns {number} - The size of the point. 
     * @memberOf Aesthetic
     */
    getPointSize() {
        return this.pointSize;
    }

    /**
     * Returns if this Aesthetic is outer or not.
     * @returns {boolean} - true if it is outer, false, otherwise.
     * @memberOf Aesthetic
     */
    isOuter() {
        return this.outer;
    }

    /**
     * Verifies if this Aeshtetic element is enable on the Legend or not.
     * @returns {boolean} - True if it's enabled, false, otherwise.
     * @memberOf Aesthetic
     */
    isEnabled() {
        return this.enabled;
    }
}

class ChangeMap extends Map {

    /**
     * Creates an instance of ChangeMap.
     * @param {BGMapWrapper} bgmap - Background map object.
     * @param {JSON} geometry - JSON object with the geometry that was read from the file.
     * @param {Object} options - User options to be used.
     * @memberOf ChangeMap
     */
    constructor(bgmap, geometry, options) {
        super(bgmap, geometry, options);
        options.attr = "change"; //window.maps.push(this);
        this.loadOptions(options, bgmap);
        this.initializeCanvasAndEvents();
    }

    /**
     * Draw Change map, at the beginning and when the map is moved.
     * @see initialize() and makeMap() methods.
     * @override 
     * @memberOf ChangeMap
     */
    draw() {
        this.clear();
        for (const aes of this.aesthetics) {
            if (aes.isEnabled())
                this.drawTriangles(aes);//this.drawContinuousPolygons(aes);
            this.drawBorders(aes);
        }
    }

    /**
     * Process data loaded by the user. This mothed overrides the parent(Map class) default processData method.
     * @param {JSON} geojson - GeoJSON object.
     * @param {number} numberOfClasses - Number of classes that the Legend will contain.
     * @param {string} classBreaksMethod - Algorithm to be used to calculate class breaks. Only used it class breaks are not given by the user.
     * @param {string[]} colorScheme - Color scheme to be used by this map.
     * @override 
     * @memberOf ChangeMap
     */
    preProcessData(geojson, numberOfClasses, classBreaksMethod, colorScheme) {
        let opts = this.gisplayOptions;
        let gjonFeatures = geojson.features;
        for (let i = 0; i < gjonFeatures.length && i < opts.maxFeatures; i++) {
            let gjsonMinuend = gjonFeatures[i].properties[opts.minuend];
            let gjsonSubtrahend = gjonFeatures[i].properties[opts.subtrahend];
            if (typeof gjsonMinuend === 'number' && typeof gjsonSubtrahend === 'number') {
                this.max = Math.max(this.max, gjsonMinuend - gjsonSubtrahend);
                this.min = Math.min(this.min, gjsonMinuend - gjsonSubtrahend);
            }
        }

        let X = Math.round(this.min + Math.abs(this.min / 3));
        let Y = Math.round(this.min + Math.abs(this.min / 3) * 2);
        let bm = -4;
        let middle = 0;
        let am = 4;
        let Z = Math.round(this.max - Math.abs(this.max / 3) * 2);
        let W = Math.round(this.max - Math.abs(this.max / 3));
        let classBreaks = [this.min, X, Y, bm, am, Z, W, this.max];//this.calcClassBreaks([this.min, X, Y, middle, Z, W, this.max], classBreaksMethod, 6);
        //let classBreaks = [this.min, X, Y, 0, Z, W, this.max];

        const aesarray = []; //Array of aesthetic objects loaded from the file
        let fcolor = this.getDefaultColors(classBreaks.length - 1);
        for (let i = 0; i < classBreaks.length - 1; i++) {
            let [r, g, b] = chroma(fcolor[i]).rgb();
            let aes;
            if (i !== classBreaks.length - 2)
                aes = new Aesthetic(i, opts.attr, [Math.round(r), Math.round(g), Math.round(b), opts.alpha], [0, 0, 0, 1], null, [classBreaks[i], classBreaks[i + 1]]);
            else {
                aes = new Aesthetic(i, opts.attr, [Math.round(r), Math.round(g), Math.round(b), opts.alpha], [0, 0, 0, 1], null, [classBreaks[i], classBreaks[i + 1]]);
                aes.outer = true;
            }
            aesarray.push(aes);
        }
        /**
         * Aesthetic object. In the case of a Change Map only one Aesthetic exists.
         * @type {Array<Aesthetic>}
         */
        this.aesthetics = aesarray;
    }

    /**
     * Method called to build the Map Legend.
     * Create a gradient and insert legend onto background map.
     * @override 
     * @memberOf ChangeMap
     */
    buildLegend() {
        /**
         * The Legend to be used through the life of the map.
         * @type {Legend} 
         */
        this.legend = new Legend(this.id, this.gisplayOptions.legendTitle);
        for (const aes of this.aesthetics)
            this.legend.insertPolygonRow(aes, this);
        this.legend.insertLegend(this.bGMap);
    }

    /**
     * Defaults for ChangeMap.
     * @memberOf ChangeMap
     */
    defaults() {
        let options = { numberOfClasses: 7 };
        return options;
    }

    /**
     * Returns the colors for this map given the number of classes and the nature of the data (sequential,  diverging or qualitative). 
     * @param {number} numClasses - Number of classes. 
     * @param {string} dataNature - Nature of the data.
     * @returns {Array<Array<RGB>>} Default colors for the map given the number of classes and nature of data.
     * @override 
     * @memberOf ChangeMap
     */
    getDefaultColors(numClasses, dataNature) {
        return ColorBrewer.getDefautls('ChangeMap', numClasses, dataNature || "Divergent");
    }
}

class Choropleth extends Map {

    /**
     * Creates an instance of Choropleth.
     * @param {BGMapWrapper} bgmap - Background map object.
     * @param {JSON} geometry - JSON object with the geometry that was read from the file.
     * @param {Object} userOptions - User options to be used.
     * @memberOf Choropleth
     */
    constructor(bgmap, geometry, userOptions) {
        super(bgmap, geometry, userOptions);
        this.loadOptions(userOptions, bgmap);// this.type = 'CP'; window.maps.push(this);
        this.initializeCanvasAndEvents();
    }

    /**
     * Draw Choropleth map, at the beginning and when the map is moved.
     * @see initialize() and makeMap() methods.
     * @override  
     * @memberOf Choropleth
     */
    draw() {
        this.clear();
        for (const aes of this.aesthetics) {
            if (aes.isEnabled())
                this.drawTriangles(aes);
            this.drawBorders(aes);
        }
    }

    /**
     * Method called to build the Map Legend.
     * For all Aesthethics that exist crate one polygon row and then insert the Legend to the map. 
     * @override 
     * @memberOf Choropleth
     */
    buildLegend() {
        /**
         * The Legend to be used through the life of the map.
         * @type {Legend} 
         */
        this.legend = new Legend(this.id, this.gisplayOptions.legendTitle);
        for (const aes of this.aesthetics)
            this.legend.insertPolygonRow(aes, this);
        this.legend.insertLegend(this.bGMap);
    }

    /**
     * Returns the color scheme and number of classes associated with the id given.
     * @returns {{colorScheme: string[], numberOfClasses: number}} - Color scheme and number of classes associated with the id given, empty object otherwise.
     * @override 
     * @memberOf Choropleth
     */
    defaults() {
        const options = {};
        options.numberOfClasses = 4;
        return options;
    }

    /**
     * Returns the colors for this map given the number of classes and the nature of the data (sequential,  diverging or qualitative). 
     * @param {number} numClasses - Number of classes. 
     * @param {string} dataNature - Nature of the data.
     * @returns {Array<Array<RGB>>} Default colors for the map given the number of classes and nature of data.
     * @override 
     * @memberOf Choropleth
     */
    getDefaultColors(numClasses, dataNature) {
        return ColorBrewer.getDefautls('Choropleth', numClasses, dataNature || "Sequential");
    }
}

class DotMap extends Map {

    /**
     * Creates an instance of DotMap.
     * @param {BGMapWrapper} bgmap - Background map object.
     * @param {JSON} geometry - JSON object with the geometry that was read from the file.
     * @param {Object} options - User options to be used.
     * @memberOf DotMap
     */
    constructor(bgmap, geometry, options) {
        super(bgmap, geometry, options);
        this.loadOptions(options, bgmap);
        this.initializeCanvasAndEvents();
    }

    /**
     * Draw Dot map, at the beginning and when the map is moved.
     * @see initialize() and makeMap() methods.
     * @override
     * @memberOf DotMap
     */
    draw() {
        this.clear();
        for (const aes of this.aesthetics)
            if (aes.isEnabled())
                this.drawPoints(aes);
    }

    /**
     * Method called to build the Map Legend.
     * For all Aesthethics that exist crate one point row and then insert the Legend to the map
     * @override 
     * @memberOf DotMap
     */
    buildLegend() {
        /**
         * The Legend to be used through the life of the map.
         * @type {Legend} 
         */
        this.legend = new Legend(this.id, this.gisplayOptions.legendTitle);
        for (const aes of this.aesthetics)
            this.legend.insertPointRow(aes, this);
        this.legend.insertLegend(this.bGMap);
    }

    /**
     * Returns the color scheme and number of classes associated with the id given.
     * @returns {{colorScheme: string[], numberOfClasses: number}}
     * @override 
     * @memberOf DotMap
     */
    defaults() {
        const options = {};
        options.numberOfClasses = 1;
        return options;
    }

    /**
     * Returns the colors for this map given the number of classes and the nature of the data (sequential,  diverging or qualitative). 
     * @param {number} numClasses - Number of classes. 
     * @param {string} dataNature - Nature of the data.
     * @returns {Array<Array<RGB>>} Default colors for the map given the number of classes and nature of data.
     * @override 
     * @memberOf DotMap
     */
    getDefaultColors(numClasses, dataNature) {
        return ColorBrewer.getDefautls('DotMap', numClasses, dataNature || "Sequential");
    }
}

class ProportionalSymbolsMap extends Map {

    /**
     * Creates an instance of ProportionalSymbolsMap.
     * @param {BGMapWrapper} bgmap - Background map object.
     * @param {JSON} geometry - JSON object with the geometry that was read from the file.
     * @param {Object} options - User options to be used.
     * @memberOf ProportionalSymbolsMap
     */
    constructor(bgmap, geometry, options) {
        super(bgmap, geometry, options);
        this.loadOptions(options, bgmap);
        this.gisplayOptions.isDynamic = !options.sizeByClass;
        this.initializeCanvasAndEvents();
    }

    /**
     * Draw ProportionalSymbols map, at the beginning and when the map is moved.
     * @see initialize() and makeMap() methods.
     * @override 
     * @memberOf ProportionalSymbolsMap
     */
    draw() {
        this.clear();
        if (!this.gisplayOptions.isDynamic) {
            for (let i = this.aesthetics.length - 1; i >= 0; i--)
                if (this.aesthetics[i].isEnabled())
                    this.drawPoints(this.aesthetics[i]);
        }
        else {
            for (let i = this.aesthetics.length - 1; i >= 0; i--)
                if (this.aesthetics[i].isEnabled())
                    this.drawProportionalPoints(this.aesthetics[i]);
        }
    }

    /**
     * Method called to build the Map Legend.
     * For all Aesthethics that exist crate one proportional symbol row and then insert the Legend to the map. 
     * @override 
     * @memberOf ProportionalSymbolsMap
     */
    buildLegend() {
        /**
         * The Legend to be used through the life of the map.
         * @type {Legend} 
         */
        this.legend = new Legend(this.id, this.gisplayOptions.legendTitle);
        if (this.aesthetics.length === 1)
            this.legend.insertProportionalSymbols(this.aesthetics[0], this, this.gisplayOptions.numberOfLegendItems);
        else
            for (let i = this.aesthetics.length - 1; i >= 0; i--) {
                if (i === 0)
                    this.legend.insertProportionalSymbols(this.aesthetics[i], this, 2);
                else
                    this.legend.insertProportionalSymbols(this.aesthetics[i], this, 1);
            }
        // i == 0 ? this.legend.insertProportionalSymbols(this.aesthetics[i], this, 2) : this.legend.insertProportionalSymbols(this.aesthetics[i], this, 1);
        this.legend.insertLegend(this.bGMap);
    }

    /**
     * Returns the color scheme, number of classes, minimum point size and max point size associated with the id given.
     * @returns {{maxPointSize: number, minPointSize: number, colorScheme: string[], numberOfClasses: number}}
     * @override 
     * @memberOf ProportionalSymbolsMap
     */
    defaults() {
        const options = {};
        options.maxPointSize = 60;
        options.minPointSize = 5;
        options.numberOfClasses = 1;
        return options;
    }

    /**
     * Returns the colors for this map given the number of classes and the nature of the data (sequential,  diverging or qualitative). 
     * @param {number} numClasses - Number of classes. 
     * @param {string} dataNature - Nature of the data.
     * @returns {Array<Array<RGB>>} Default colors for the map given the number of classes and nature of data.
     * @override 
     * @memberOf ProportionalSymbolsMap
     */
    getDefaultColors(numClasses, dataNature) {
        return ColorBrewer.getDefautls('ProportionalSymbols', numClasses, dataNature || "Sequential");
    }
}

class BGMapBingMaps extends BGMapWrapper {

    /**
     * Creates an instance of Bing Maps.
     * @param {Object} bgmap - The Bing Maps object.
     * @memberOf BGMapBingMaps
     */
    constructor(bgmap) {
        super(bgmap);
    }

    /**
     * Returns the map's containing HTML element.
     * @return {HTMLElement} - The map's HTML element container.
     */
    getContainer() {
        return this.bgMapObject.getRootElement();
    }

    /**
     * Given one id it creates a canvas object.
     * @todo Understand case mapbox comment bellow.
     * @param {number} id - The id of the canvas to be created.
     * @return {HTMLElement} Canvas object where everything will be drawn.
     * @see http://stackoverflow.com/a/6862022
     */
    createCanvas(id) {
        const mapCanvas = document.createElement('canvas');
        mapCanvas.id = `mapCanvas${id}`;
        mapCanvas.style.position = 'absolute';

        const mapDiv = this.bgMapObject.getRootElement();//Could be: this.getContainer();
        mapCanvas.height = mapDiv.offsetHeight;
        mapCanvas.width = mapDiv.offsetWidth;

        // Bing Maps
        mapCanvas.style.pointerEvents = 'none';
        mapDiv.insertBefore(mapCanvas, mapDiv.firstChild.nextSibling);

        const canvas = document.getElementById(`mapCanvas${id}`);
        return canvas;
    }

    /**
     * Returns the map's current zoom level.
     * @return {number} - The map's current zoom level.
     */
    getZoom() {
        return this.bgMapObject.getZoom();
    }

    /**
     * Returns the longitude(X) of the bounding box northwest corner.
     * @return {number} - Longitude of northwest corner, measured in degrees.
     * @see 
     */
    getCenterLng() {
        return this.bgMapObject.getCenter().longitude;
    }

    /**
     * Returns the latitude(Y) of the bounding box northwest corner.
     * @return {number} - Latitude of northwest corner, measured in degrees.
     * @see 
     */
    getCenterLat() {
        return this.bgMapObject.getCenter().latitude;
    }

    /**
     * Add Pan/Drag event.
     * @param {Function} fun - The function to be called when the user performs drag on the map.
     * @memberOf BGMapWrapper
     */
    addPanEvent(fun) {
        Microsoft.Maps.Events.addHandler(this.getBackgroundMapProviderObject(), 'mousewheel', fun);
        // this.addEventListener('move', fun);
    }

    /**
     * Add zoom event.
     * @param {Function} fun - The function to be called when the user performs zoom in/out on the map.
     * @memberOf BGMapWrapper
     */
    addZoomEvent(fun) {
        Microsoft.Maps.Events.addHandler(this.getBackgroundMapProviderObject(), 'viewchange', fun);
    }

    /**
     * Add click event.
     * @param {Map} map - The function to be called when the user clicks on the map.
     * @memberOf BGMapWrapper
     */
    addClickEvent(map) {
        Microsoft.Maps.Events.addHandler(this.getBackgroundMapProviderObject(), 'click', (e) => {
            let point = new Microsoft.Maps.Point(e.getX(), e.getY());
            let loc = e.target.tryPixelToLocation(point);
            const lng = loc.longitude;
            const lat = loc.latitude;
            map.clickEvent(lng, lat);
        });
        /* this.addEventListener('click', e => {
             const lng = ((((180 + e.latlng.lng) % 360) + 360) % 360) - 180;
             const lat = e.latlng.lat;
             map.clickEvent(lng, lat);
         });*/
    }
}

class BGMapGoogleMaps extends BGMapWrapper {

    /**
     * Creates an instance of GoogleMapsBGMap.
     * @param {Object} bgmap - The Google Maps object.
     * @memberOf GoogleMapsBGMap
     */
    constructor(bgmap) {
        super(bgmap);
    }

    /**
     * Returns the map's containing HTML element.
     * @return {HTMLElement} - The map's HTML element container.
     */
    getContainer() {
        return this.bgMapObject.getDiv();
    }

    /**
     * Given one id it creates a canvas object.
     * @todo Understand case mapbox comment bellow.
     * @param {number} id - The id of the canvas to be created.
     * @return {HTMLElement} Canvas object where everything will be drawn.
     * @see http://stackoverflow.com/a/6862022
     */
    createCanvas(id) {
        const mapCanvas = document.createElement('canvas');
        mapCanvas.id = `mapCanvas${id}`;
        mapCanvas.style.position = 'absolute';

        const mapDiv = this.bgMapObject.getDiv();
        mapCanvas.height = mapDiv.offsetHeight;
        mapCanvas.width = mapDiv.offsetWidth;

        // Google Maps
        mapCanvas.style.pointerEvents = 'none';
        mapDiv.insertBefore(mapCanvas, mapDiv.firstChild.nextSibling);

        const canvas = document.getElementById(`mapCanvas${id}`);
        return canvas;
    }

    /**
     * Returns the map's current zoom level.
     * @return {number} - The map's current zoom level.
     */
    getZoom() {
        return this.bgMapObject.getZoom();
    }

    /**
     * Returns the longitude(X) of the bounding box northwest corner.
     * @return {number} - Longitude of northwest corner, measured in degrees.
     * @see http://stackoverflow.com/a/6913505
     */
    getCenterLng() {
        return ((((180 + this.bgMapObject.getCenter().lng()) % 360) + 360) % 360) - 180;
    }

    /**
     * Returns the latitude(Y) of the bounding box northwest corner.
     * @return {number} - Latitude of northwest corner, measured in degrees.
     * @see http://stackoverflow.com/a/6913505
     */
    getCenterLat() {
        return this.bgMapObject.getCenter().lat();
    }

    /**
     * Adds a listener to a specified event type.
     * @param {string} eventstr - The event type to add a listen for.
     * @param {Function} eventfunction - The function to be called when the event is fired. The listener function is called with the data object passed to  fire , extended with  target and  type properties.
     * @return {void} 
     */
    addEventListener(eventstr, eventfunction) {
        this.bgMapObject.addListener(eventstr, eventfunction);
    }

    /**
     * Add Pan/Drag event.
     * @param {Function} fun - The function to be called when the user performs drag on the map.
     * @memberOf BGMapWrapper
     */
    addPanEvent(fun) {
        this.addEventListener('drag', fun);
    }

    /**
     * Add zoom event.
     * @param {Function} fun - The function to be called when the user performs zoom in/out on the map.
     * @memberOf BGMapWrapper
     */
    addZoomEvent(fun) {
        this.addEventListener('zoom_changed', fun);
    }

    /**
     * Add click event.
     * @param {Map} map - The function to be called when the user clicks on the map.
     * @memberOf BGMapWrapper
     */
    addClickEvent(map) {
        this.addEventListener('click', e => {
            const lng = e.latLng.lng();
            const lat = e.latLng.lat();
            map.clickEvent(lng, lat);
        });
    }
}

class BGMapHereMaps extends BGMapWrapper {

    /**
     * Creates an instance of Here Maps.
     * @param {Object} bgmap - The Here Maps object.
     * @memberOf HereMapsBGMap
     */
    constructor(bgmap) {
        super(bgmap);
    }

    /**
     * Returns the map's containing HTML element.
     * @return {HTMLElement} - The map's HTML element container.
     */
    getContainer() {
        return this.bgMapObject.getElement();
    }

    /**
     * Given one id it creates a canvas object.
     * @todo Understand case mapbox comment bellow.
     * @param {number} id - The id of the canvas to be created.
     * @return {HTMLElement} Canvas object where everything will be drawn.
     * @see http://stackoverflow.com/a/6862022
     */
    createCanvas(id) {
        const mapCanvas = document.createElement('canvas');
        mapCanvas.id = `mapCanvas${id}`;
        mapCanvas.style.position = 'absolute';

        const mapDiv = this.bgMapObject.getElement();//Could be: this.getContainer();
        mapCanvas.height = mapDiv.offsetHeight;
        mapCanvas.width = mapDiv.offsetWidth;

        // Here Maps
        mapCanvas.style.pointerEvents = 'none';
        mapDiv.insertBefore(mapCanvas, mapDiv.firstChild.nextSibling);

        const canvas = document.getElementById(`mapCanvas${id}`);
        return canvas;
    }

    /**
     * Returns the map's current zoom level.
     * @return {number} - The map's current zoom level.
     */
    getZoom() {
        return this.bgMapObject.getZoom();
    }

    /**
     * Returns the longitude(X) of the bounding box northwest corner.
     * @return {number} - Longitude of northwest corner, measured in degrees.
     * @see https://developer.here.com/api-explorer/maps-js/v3.0/infoBubbles/position-on-mouse-click
     */
    getCenterLng() {
        return ((((180 + this.bgMapObject.getCenter().lng) % 360) + 360) % 360) - 180;
    }

    /**
     * Returns the latitude(Y) of the bounding box northwest corner.
     * @return {number} - Latitude of northwest corner, measured in degrees.
     * @see https://developer.here.com/api-explorer/maps-js/v3.0/infoBubbles/position-on-mouse-click
     */
    getCenterLat() {
        return this.bgMapObject.getCenter().lat;
    }

    /**
     * Adds a listener to a specified event type.
     * @param {string} eventstr - The event type to add a listen for.
     * @param {Function} eventfunction - The function to be called when the event is fired. The listener function is called with the data object passed to  fire , extended with  target and  type properties.
     * @return {void} 
     */
    addEventListener(eventstr, eventfunction) {
        this.bgMapObject.addEventListener(eventstr, eventfunction);
    }

    /**
     * Add Pan/Drag event.
     * @param {Function} fun - The function to be called when the user performs drag on the map.
     * @memberOf BGMapWrapper
     */
    addPanEvent(fun) {
        this.addEventListener('drag', fun);
    }

    /**
     * Add zoom event.
     * @param {Function} fun - The function to be called when the user performs zoom in/out on the map.
     * @memberOf BGMapWrapper
     */
    addZoomEvent(fun) {
        this.addEventListener('mapviewchange', fun);
    }

    /**
     * Add click event.
     * @param {Map} map - The function to be called when the user clicks on the map.
     * @memberOf BGMapWrapper
     */
    addClickEvent(map) {
        this.addEventListener('tap', e => {
            let coords = this.getBackgroundMapProviderObject().screenToGeo(e.currentPointer.viewportX, e.currentPointer.viewportY);
            const lng = coords.lng;
            const lat = coords.lat;
            map.clickEvent(lng, lat);
        });
    }
}

class BGMapMapBox extends BGMapWrapper {

    /**
     * Creates an instance of BGMapWrapper.
     * @param {Object} bgmap - The background map object that came from the provider (e.g., Mapbox, Google Maps). 
     */
    constructor(bgmap) {
        super(bgmap);
    }

    /**
     * Returns the map's containing HTML element.
     * @return {HTMLElement} - The map's HTML element container.
     */
    getContainer() {
        return this.bgMapObject.getContainer();
    }

    /**
     * Returns the width of the canvas elment.
     * @returns {number} the width of the canvas elment.
     * @memberOf BGMapWrapper
     */
    getWidth() {
        return this.getContainer().offsetWidth;
    }

    /**
     * Returns the height of the canvas element.
     * @returns {number} the height of the canvas elment.
     * @memberOf BGMapWrapper
     */
    getHeight() {
        return this.getContainer().offsetHeight;
    }

    /**
     * Given one id it creates a canvas object.
     * @todo Understand case mapbox comment bellow.
     * @param {number} id - The id of the canvas to be created.
     * @return {HTMLElement} Canvas object where everything will be drawn.
     */
    createCanvas(id) {
        const mapCanvas = document.createElement('canvas');
        mapCanvas.id = `mapCanvas${id}`;
        mapCanvas.style.position = 'absolute';

        const mapDiv = this.bgMapObject.getContainer();
        mapCanvas.height = mapDiv.offsetHeight;
        mapCanvas.width = mapDiv.offsetWidth;
        //case mapbox
        mapDiv.insertBefore(mapCanvas, mapDiv.firstChild.nextSibling);

        const canvas = document.getElementById(`mapCanvas${id}`);
        return canvas;
    }

    /**
     * Returns the map's current zoom level.
     * @return {number} - The map's current zoom level.
     */
    getZoom() {
        return this.bgMapObject.getZoom();
    }

    /**
     * Returns the longitude of the bounding box northwest corner.
     * @return {number} - Longitude of northwest corner, measured in degrees.
     */
    getCenterLng() {
        return ((((180 + this.bgMapObject.getCenter().lng) % 360) + 360) % 360) - 180;
    }

    /**
     * Returns the latitude of the bounding box northwest corner.
     * @return {number} - Latitude of northwest corner, measured in degrees.
     */
    getCenterLat() {
        return this.bgMapObject.getCenter().lat;
    }

    /**
     * Adds a listener to a specified event type.
     * @param {string} eventstr - The event type to add a listen for.
     * @param {Function} eventfunction - The function to be called when the event is fired. The listener function is called with the data object passed to  fire , extended with  target and  type properties.
     * @return {void} 
     */
    addEventListener(eventstr, eventfunction) {
        this.bgMapObject.on(eventstr, eventfunction);
    }

    /**
     * Add Pan/Drag event.
     * @param {Function} fun - The function to be called when the user performs drag on the map.
     * @memberOf BGMapWrapper
     */
    addPanEvent(fun) {
        this.addEventListener('move', fun);
    }

    /**
     * Add zoom event.
     * @param {Function} fun - The function to be called when the user performs zoom in/out on the map.
     * @memberOf BGMapWrapper
     */
    addZoomEvent(fun) {
        this.addEventListener('move', fun);
    }

    /**
     * Add click event.
     * @param {Map} map - The function to be called when the user clicks on the map.
     * @memberOf BGMapWrapper
     */
    addClickEvent(map) {
        this.addEventListener('click', e => {
            const lng = ((((180 + e.latlng.lng) % 360) + 360) % 360) - 180;
            const lat = e.latlng.lat;
            map.clickEvent(lng, lat);
        });
    }

    /**
     * Returns the background map object. This is the Background provider object (e.g., Mapbox, GMaps, HereMaps, Bing Maps).
     * @returns {BGMapWrapper#bgMapObject} the background map object.
     * @memberOf BGMapWrapper
     */
    getBackgroundMapProviderObject() {
        return this.bgMapObject;
    }
}

class Gisplay {

    /**
     * Creates an instance of the Gisplay API.
     * @memberOf Gisplay
     */
    constructor() {
        /**
         * @type {Array} - Array of maps. @WHY?
         */
        window.maps = new Array();
        /**
         * @type {number} - The number of maps. Used to mark each one with a different id.
         */
        window.mapcount = 0;

        //WebGL API
        /**
         * @type {number} - The number of vertices produced. @WHY?
         * @deprecated
         */
        window._vertexcount = 0;
        /**
         * @type {number} - The number of triangles. @WHY?
         * @deprecated
         */
        window._tricount = 0;
    }

    /**
     * Creates a map of type Choropleth.
     * @param {Object} bgmap - Background map object be used(atm only MapBox being used).- Background map object be used(atm only MapBox being used).
     * @param {JSON} geometry - The object that contains the data.
     * @param {Object} options - Object that contains user personalization options.
     * @memberOf Gisplay
     */
    makeChoropleth(bgmap, geometry, options) {
        const gismap = new Choropleth(bgmap, geometry, options);
        gismap.makeMap();
    }

    /**
     * Creates a Dot Map.
     * @param {Object} bgmap - Background map object be used(atm only MapBox being used).
     * @param {JSON} geometry - The object that contains the data.
     * @param {Object} options - Object that contains user personalization options.
     * @memberOf Gisplay
     */
    makeDotMap(bgmap, geometry, options) {
        const gismap = new DotMap(bgmap, geometry, options);
        gismap.makeMap();
    }

    /**
     * Creates a Change Map.
     * @param {Object} bgmap - Background map object be used(atm only MapBox being used).
     * @param {JSON} geometry - The object that contains the data.
     * @param {Object} options - Object that contains user personalization options.
     * @memberOf Gisplay
     */
    makeChangeMap(bgmap, geometry, options) {
        const gismap = new ChangeMap(bgmap, geometry, options);
        gismap.makeMap();
    }

    /**
     * Creates a Proportional Symbols Map.
     * @param {Object} bgmap - Background map object be used(atm only MapBox being used).
     * @param {JSON} geometry - The object that contains the data.
     * @param {Object} options - Object that contains user personalization options.
     * @memberOf Gisplay
     */
    makeProportionalSymbolsMap(bgmap, geometry, options) {
        const gismap = new ProportionalSymbolsMap(bgmap, geometry, options);
        gismap.makeMap();
    }

    /**
     * Creates a Chorocromatic Map.
     * @param {Object} bgmap - Background map object be used(atm only MapBox being used).
     * @param {JSON} geometry - The object that contains the data.
     * @param {Object} options - Object that contains user personalization options.
     * @memberOf Gisplay
     */
    makeChorochromaticMap(bgmap, geometry, options) {
        const gismap = new ChorochromaticMap(bgmap, geometry, options);
        gismap.makeMap();
    }
}

class GisplayLibrary {

    static createBGMapChoropleth() {
        L.mapbox.accessToken = 'pk.eyJ1IjoibG9sYXNkIiwiYSI6ImNpbmxsZDJkejAwOHR2Zm0yZHVwOWV1ejEifQ.SJ6CupBlW0gPic0n-HgY6w';
        window.map = L.mapbox.map('map', 'mapbox.streets').setView([49.36855556, -81.66371667], 4);
    }

    static startChoropleth() {
        let mb = new BGMapMapBox(window.map);
        var gisplay = new Gisplay();
        var options = {
            numberOfClasses: 4,
            attr: 'f3',
            legendTitle: 'Fatals'
        };

        var reader = new FileReader();
        reader.onloadend = () =>  {
            var data = JSON.parse(reader.result);
            gisplay.makeChoropleth(mb, data, options);
        };
        reader.readAsText(document.getElementById("file").files[0]);
    }

    static createBGMapChangeMap() {
        L.mapbox.accessToken = 'pk.eyJ1IjoibG9sYXNkIiwiYSI6ImNpbmxsZDJkejAwOHR2Zm0yZHVwOWV1ejEifQ.SJ6CupBlW0gPic0n-HgY6w';
        window.map = L.mapbox.map('map', 'mapbox.dark').setView([49.36855556, -81.66371667], 4);
    }

    static startChangeMap() {
        let mb = new BGMapMapBox(window.map);
        var gisplay = new Gisplay();

        var options = {
            minuend: 'f6',
            subtrahend: 'f2',
            alpha: 1,
            legendTitle: "Change between 2009 and 2013"
        };

        var reader = new FileReader();
        reader.onloadend = () =>  {
            var data = JSON.parse(reader.result);
            gisplay.makeChangeMap(mb, data, options);
        };
        reader.readAsText(document.getElementById("file").files[0]);
    }

    static createBGMapDotMap() {
        L.mapbox.accessToken = 'pk.eyJ1IjoibG9sYXNkIiwiYSI6ImNpbmxsZDJkejAwOHR2Zm0yZHVwOWV1ejEifQ.SJ6CupBlW0gPic0n-HgY6w';
        window.map = L.mapbox.map('map', 'mapbox.dark').setView([49.36855556, -81.66371667], 4);
    }

    static startDotMap() {
        let mb = new BGMapMapBox(window.map);
        var gisplay = new Gisplay();

        var options = {
            attr: 'f1',
            legendTitle: "Alcohol"
        };

        var reader = new FileReader();
        reader.onloadend = () =>  {
            var data = JSON.parse(reader.result);
            gisplay.makeDotMap(mb, data, options);
        };
        reader.readAsText(document.getElementById("file").files[0]);
    }

    static createGoogleMapsBGMap() {
        window.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: { lat: 49.36855556, lng: -81.66371667 }
        });
    }

    static startGoogleMapsChoropleth() {
        let gm = new BGMapGoogleMaps(window.map);
        let gisplay = new Gisplay();

        let options = {
            attr: 'f3',
            legendTitle: 'Fatals'
        };

        let reader = new FileReader();
        reader.onloadend = () => {
            let data = JSON.parse(reader.result);
            gisplay.makeChoropleth(gm, data, options);
        };
        reader.readAsText(document.getElementById("file").files[0]);
    }

    static createBGPSymbols() {
        L.mapbox.accessToken = 'pk.eyJ1IjoibG9sYXNkIiwiYSI6ImNpbmxsZDJkejAwOHR2Zm0yZHVwOWV1ejEifQ.SJ6CupBlW0gPic0n-HgY6w';
        window.map = L.mapbox.map('map', 'mapbox.light').setView([49.36855556, -81.66371667], 4);
    }

    static startPSymbols() {
        let mb = new BGMapMapBox(window.map);
        var gisplay = new Gisplay();

        var options = {
            maxPointSize: 100,
            minPointSize: 5,
            attr: 'f1',
            alpha: 1.0,
            numberOfLegendItems: 3,
            legendTitle: "Accidents"
        };

        var reader = new FileReader();
        reader.onloadend = () =>  {
            var data = JSON.parse(reader.result);
            gisplay.makeProportionalSymbolsMap(mb, data, options);
        };
        reader.readAsText(document.getElementById("file").files[0]);
    }

    static createHereMapsBGMap() {
        let platform = new H.service.Platform({
            'app_id': '8fEgxjuheFTYKcvVQhum',
            'app_code': '5z2K0DvfXPNRLVuIaXcfgg'
        });
        let defaultLayers = platform.createDefaultLayers();
        window.map = new H.Map(
            document.getElementById('map'),
            defaultLayers.normal.map,
            {
                zoom: 4,
                center: { lat: 49.36855556, lng: -81.66371667 }
            });
        let mapEvents = new H.mapevents.MapEvents(map);//Enable events
        let behavior = new H.mapevents.Behavior(mapEvents);//Enable zoom and pan
    }

    static startHereMapsChoropleth() {
        let hereMaps = new BGMapHereMaps(window.map);
        let gisplay = new Gisplay();

        var options = {
            minuend: 'f6',
            subtrahend: 'f2',
            alpha: 1,
            legendTitle: "Change between 2009 and 2013"
        };

        let reader = new FileReader();
        reader.onloadend = () =>  {
            let data = JSON.parse(reader.result);
            gisplay.makeChangeMap(hereMaps, data, options);
        };
        reader.readAsText(document.getElementById("file").files[0]);
    }
}