import { BGMapWrapper } from './BGMapWrapper';

/**
 * Google Maps as background map provider. 
 * @export
 * @class GoogleMapsBGMap
 * @extends {BGMapWrapper}
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference
 * @see 
 */
export class BGMapGoogleMaps extends BGMapWrapper {

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