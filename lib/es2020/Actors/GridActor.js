/** Based on
    https://github.com/Fyrestar/THREE.InfiniteGridHelper by https://github.com/Fyrestar
    and https://github.com/threlte/threlte/blob/main/packages/extras/src/lib/components/Grid/Grid.svelte
    by https://github.com/grischaerbe and https://github.com/jerzakm
 */
import * as Three from 'three';
import { Actor } from "../Scene/Actor.js";
function shaderMaterial(uniforms, vertexShader, fragmentShader, onInit) {
    const entries = Object.entries(uniforms);
    class Material extends Three.ShaderMaterial {
        constructor(parameters) {
            super({
                uniforms: entries.reduce((acc, [name, value]) => {
                    const uniform = Three.UniformsUtils.clone({ [name]: { value } });
                    return {
                        ...acc,
                        ...uniform,
                    };
                }, {}),
                vertexShader,
                fragmentShader,
            });
            for (const [name] of entries) {
                Object.defineProperty(this, name, {
                    get: () => this.uniforms[name].value,
                    set: (v) => (this.uniforms[name].value = v),
                });
            }
            Object.assign(this, parameters);
            onInit?.(this);
        }
    }
    Object.defineProperty(Material, "key", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: Three.MathUtils.generateUUID()
    });
    return Material;
}
const GridMaterial = shaderMaterial({
    cellSize: 0.5,
    sectionSize: 1,
    fadeDistance: 100,
    fadeStrength: 1,
    cellThickness: 0.5,
    sectionThickness: 1,
    cellColor: new Three.Color(),
    sectionColor: new Three.Color(),
    infiniteGrid: true,
    followCamera: true,
    worldCamProjPosition: new Three.Vector3(),
    worldPlanePosition: new Three.Vector3(),
}, 
/* glsl */ `
      varying vec3 localPosition;
      varying vec4 worldPosition;

      uniform vec3 worldCamProjPosition;
      uniform vec3 worldPlanePosition;
      uniform float fadeDistance;
      uniform bool infiniteGrid;
      uniform bool followCamera;

      void main() {
        localPosition = position.xzy;
        if (infiniteGrid) localPosition *= 1.0 + fadeDistance;

        worldPosition = modelMatrix * vec4(localPosition, 1.0);
        if (followCamera) {
          worldPosition.xyz += (worldCamProjPosition - worldPlanePosition);
          localPosition = (inverse(modelMatrix) * worldPosition).xyz;
        }

        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `, 
/* glsl */ `
      varying vec3 localPosition;
      varying vec4 worldPosition;

      uniform vec3 worldCamProjPosition;
      uniform float cellSize;
      uniform float sectionSize;
      uniform vec3 cellColor;
      uniform vec3 sectionColor;
      uniform float fadeDistance;
      uniform float fadeStrength;
      uniform float cellThickness;
      uniform float sectionThickness;

      float getGrid(float size, float thickness) {
        vec2 r = localPosition.xz / size;
        vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
        float line = min(grid.x, grid.y) + 1.0 - thickness;
        return 1.0 - min(line, 1.0);
      }

      void main() {
        float g1 = getGrid(cellSize, cellThickness);
        float g2 = getGrid(sectionSize, sectionThickness);

        float dist = distance(worldCamProjPosition, worldPosition.xyz);
        float d = 1.0 - min(dist / fadeDistance, 1.0);
        vec3 color = mix(cellColor, sectionColor, min(1.0, sectionThickness * g2));

        gl_FragColor = vec4(color, (g1 + g2) * pow(d, fadeStrength));
        gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);
        if (gl_FragColor.a <= 0.0) discard;

        #include <tonemapping_fragment>
        #include <${parseInt(Three.REVISION.replace(/\D+/g, '')) >= 154 ? 'colorspace_fragment' : 'encodings_fragment'}>
      }
    `);
export class GridActor extends Actor {
    constructor(props = {}) {
        super();
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "GridActor"
        });
        /** Cell size, default: 0.5 */
        Object.defineProperty(this, "cellSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** Cell thickness, default: 0.5 */
        Object.defineProperty(this, "cellThickness", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** Cell color, default: black */
        Object.defineProperty(this, "cellColor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** Section size, default: 1 */
        Object.defineProperty(this, "sectionSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** Section thickness, default: 1 */
        Object.defineProperty(this, "sectionThickness", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** Section color, default: #2080ff */
        Object.defineProperty(this, "sectionColor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** Fade distance, default: 100 */
        Object.defineProperty(this, "fadeDistance", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** Fade strength, default: 1 */
        Object.defineProperty(this, "fadeStrength", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** Material side, default: THREE.BackSide */
        Object.defineProperty(this, "side", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "plane", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Three.Plane()
        });
        Object.defineProperty(this, "upVector", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Three.Vector3(0, 1, 0)
        });
        Object.defineProperty(this, "zeroVector", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Three.Vector3(0, 0, 0)
        });
        this.cellSize = props.cellSize || 1;
        this.cellThickness = props.cellThickness || 0.33;
        this.cellColor = props.cellColor || new Three.Color();
        this.sectionSize = props.sectionSize || 2;
        this.sectionThickness = props.sectionThickness || .777;
        this.sectionColor = props.sectionColor || new Three.Color();
        this.fadeDistance = props.fadeDistance || 100;
        this.fadeStrength = props.fadeStrength || 1;
        this.side = Three.BackSide;
        const material = new GridMaterial({
            transparent: true,
            cellSize: this.cellSize,
            sectionSize: this.sectionSize,
            cellColor: this.cellColor,
            sectionColor: this.sectionColor,
            cellThickness: this.cellThickness,
            sectionThickness: this.sectionThickness,
            fadeDistance: this.fadeDistance,
            fadeStrength: this.fadeStrength,
            infiniteGrid: true,
            followCamera: true,
            side: this.side,
        });
        const planeGeometry = new Three.PlaneGeometry(100, 100);
        this.object3d = new Three.Mesh(planeGeometry, material);
        this.object3d.frustumCulled = false;
        this.object3d.renderOrder = 100;
    }
    onUpdate(delta, elapsed) {
        const camera = this.scene?.getActiveCamera();
        if (!camera)
            return;
        this.plane.setFromNormalAndCoplanarPoint(this.upVector, this.zeroVector).applyMatrix4(this.object3d.matrixWorld);
        const gridMaterial = this.object3d.material;
        const worldCamProjPosition = gridMaterial.uniforms.worldCamProjPosition;
        const worldPlanePosition = gridMaterial.uniforms.worldPlanePosition;
        this.plane.projectPoint(camera.position, worldCamProjPosition.value);
        worldPlanePosition.value.set(0, 0, 0).applyMatrix4(this.object3d.matrixWorld);
    }
}
