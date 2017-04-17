/**
 * Class with static methods that will help with WebGL related stuff(Matrices, web mercator projection and shaders).
 * Always remeber WebGL is column major when reading the matrix code.
 * @see http://ptgmedia.pearsoncmg.com/images/chap3_9780321902924/elementLinks/03fig27.jpg
 * @static 
 * @class WebGLUtils
 */
export class WebGLUtils {

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