/**
 * This class represents a background map wrapper. Used to be a "middle-man" between the 
 * background map provider and the Gisplay API.
 * @see https://www.mapbox.com/mapbox-gl-js/api/ 
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference
 * @see https://developer.here.com/develop/javascript-api 
 * @see Diogo's thesis Page 70-72 + 59
 */
export class BGMapWrapper {

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
