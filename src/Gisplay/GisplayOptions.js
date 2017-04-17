/**
 * This class will contain all the options available on the Gisplay API.
 * @see Diogo's thesis page 50-52
 */
export class GisplayOptions {

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