import { BGMapWrapper } from './BGMapWrapper';

/**
 * MapBox as background map provider.
 * @see https://www.mapbox.com/mapbox-gl-js/api/ 
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference
 * @see https://developer.here.com/develop/javascript-api 
 * @see Diogo's thesis Page 70-72 + 59
 */
export class BGMapMapBox extends BGMapWrapper {

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
