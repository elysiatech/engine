var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _EnvironmentActor_pmremGenerator, _EnvironmentActor_texture, _EnvironmentActor_envScene, _EnvironmentActor_rotation, _EnvironmentActor_environmentIntensity, _EnvironmentActor_background, _EnvironmentActor_backgroundIntensity, _EnvironmentActor_backgroundBlur;
import * as Three from "three";
import { Actor } from "../Scene/Actor.js";
import { BackSide, BoxGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, PointLight, Scene, } from 'three';
import { Colors } from "../Core/Colors.js";
class RoomEnvironment extends Scene {
    constructor() {
        super();
        const geometry = new BoxGeometry();
        geometry.deleteAttribute('uv');
        const roomMaterial = new MeshStandardMaterial({ side: BackSide, color: Colors.VonCount });
        const boxMaterial = new MeshStandardMaterial({ color: Colors.VonCount });
        const mainLight = new PointLight(0xffffff, 900, 28, 2);
        mainLight.position.set(0.418, 16.199, 0.300);
        this.add(mainLight);
        const room = new Mesh(geometry, roomMaterial);
        room.position.set(-0.757, 13.219, 0.717);
        room.scale.set(31.713, 28.305, 28.591);
        this.add(room);
        const box1 = new Mesh(geometry, boxMaterial);
        box1.position.set(-10.906, 2.009, 1.846);
        box1.rotation.set(0, -0.195, 0);
        box1.scale.set(2.328, 7.905, 4.651);
        this.add(box1);
        const box2 = new Mesh(geometry, boxMaterial);
        box2.position.set(-5.607, -0.754, -0.758);
        box2.rotation.set(0, 0.994, 0);
        box2.scale.set(1.970, 1.534, 3.955);
        this.add(box2);
        const box3 = new Mesh(geometry, boxMaterial);
        box3.position.set(6.167, 0.857, 7.803);
        box3.rotation.set(0, 0.561, 0);
        box3.scale.set(3.927, 6.285, 3.687);
        this.add(box3);
        const box4 = new Mesh(geometry, boxMaterial);
        box4.position.set(-2.017, 0.018, 6.124);
        box4.rotation.set(0, 0.333, 0);
        box4.scale.set(2.002, 4.566, 2.064);
        this.add(box4);
        const box5 = new Mesh(geometry, boxMaterial);
        box5.position.set(2.291, -0.756, -2.621);
        box5.rotation.set(0, -0.286, 0);
        box5.scale.set(1.546, 1.552, 1.496);
        this.add(box5);
        const box6 = new Mesh(geometry, boxMaterial);
        box6.position.set(-2.193, -0.369, -5.547);
        box6.rotation.set(0, 0.516, 0);
        box6.scale.set(3.875, 3.487, 2.986);
        this.add(box6);
        // -x right
        const light1 = new Mesh(geometry, createAreaLightMaterial(50));
        light1.position.set(-16.116, 14.37, 8.208);
        light1.scale.set(0.1, 2.428, 2.739);
        this.add(light1);
        // -x left
        const light2 = new Mesh(geometry, createAreaLightMaterial(50));
        light2.position.set(-16.109, 18.021, -8.207);
        light2.scale.set(0.1, 2.425, 2.751);
        this.add(light2);
        // +x
        const light3 = new Mesh(geometry, createAreaLightMaterial(17));
        light3.position.set(14.904, 12.198, -1.832);
        light3.scale.set(0.15, 4.265, 6.331);
        this.add(light3);
        // +z
        const light4 = new Mesh(geometry, createAreaLightMaterial(43));
        light4.position.set(-0.462, 8.89, 14.520);
        light4.scale.set(4.38, 5.441, 0.088);
        this.add(light4);
        // -z
        const light5 = new Mesh(geometry, createAreaLightMaterial(20));
        light5.position.set(3.235, 11.486, -12.541);
        light5.scale.set(2.5, 2.0, 0.1);
        this.add(light5);
        // +y
        const light6 = new Mesh(geometry, createAreaLightMaterial(100));
        light6.position.set(0.0, 20.0, 0.0);
        light6.scale.set(1.0, 0.1, 1.0);
        this.add(light6);
    }
}
function createAreaLightMaterial(intensity) {
    const material = new MeshBasicMaterial();
    material.color.setScalar(intensity);
    return material;
}
export { RoomEnvironment };
function constructScene(pmremGenerator, envScene) {
    const envMap = pmremGenerator.fromScene(envScene).texture;
    pmremGenerator.dispose();
    return envMap;
}
export class EnvironmentActor extends Actor {
    get texture() { return __classPrivateFieldGet(this, _EnvironmentActor_texture, "f"); }
    set texture(v) { __classPrivateFieldSet(this, _EnvironmentActor_texture, v, "f"); this.updateState(); }
    get envScene() { return __classPrivateFieldGet(this, _EnvironmentActor_envScene, "f"); }
    set envScene(v) { __classPrivateFieldSet(this, _EnvironmentActor_envScene, v, "f"); this.updateState(); }
    get rotation() { return __classPrivateFieldGet(this, _EnvironmentActor_rotation, "f"); }
    set rotation(v) { __classPrivateFieldSet(this, _EnvironmentActor_rotation, v, "f"); this.updateState(); }
    get intensity() { return __classPrivateFieldGet(this, _EnvironmentActor_environmentIntensity, "f"); }
    set intensity(v) { __classPrivateFieldSet(this, _EnvironmentActor_environmentIntensity, v, "f"); this.updateState(); }
    get background() { return __classPrivateFieldGet(this, _EnvironmentActor_background, "f"); }
    set background(v) { __classPrivateFieldSet(this, _EnvironmentActor_background, v, "f"); this.updateState(); }
    get backgroundIntensity() { return __classPrivateFieldGet(this, _EnvironmentActor_backgroundIntensity, "f"); }
    set backgroundIntensity(v) { __classPrivateFieldSet(this, _EnvironmentActor_backgroundIntensity, v, "f"); this.updateState(); }
    get backgroundBlur() { return __classPrivateFieldGet(this, _EnvironmentActor_backgroundBlur, "f"); }
    set backgroundBlur(v) { __classPrivateFieldSet(this, _EnvironmentActor_backgroundBlur, v, "f"); this.updateState(); }
    constructor(args = {}) {
        super();
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "EnvironmentActor"
        });
        _EnvironmentActor_pmremGenerator.set(this, void 0);
        _EnvironmentActor_texture.set(this, void 0);
        _EnvironmentActor_envScene.set(this, void 0);
        _EnvironmentActor_rotation.set(this, void 0);
        _EnvironmentActor_environmentIntensity.set(this, void 0);
        _EnvironmentActor_background.set(this, void 0);
        _EnvironmentActor_backgroundIntensity.set(this, void 0);
        _EnvironmentActor_backgroundBlur.set(this, void 0);
        __classPrivateFieldSet(this, _EnvironmentActor_texture, args.texture ?? null, "f");
        __classPrivateFieldSet(this, _EnvironmentActor_envScene, args.envScene ?? null, "f");
        __classPrivateFieldSet(this, _EnvironmentActor_rotation, args.rotation ?? new Three.Euler(), "f");
        __classPrivateFieldSet(this, _EnvironmentActor_environmentIntensity, args.environmentIntensity ?? 1, "f");
        __classPrivateFieldSet(this, _EnvironmentActor_background, args.background ?? false, "f");
        __classPrivateFieldSet(this, _EnvironmentActor_backgroundIntensity, args.backgroundIntensity ?? 1, "f");
        __classPrivateFieldSet(this, _EnvironmentActor_backgroundBlur, args.backgroundBlur ?? 0, "f");
    }
    updateState() {
        const renderer = this.app?.renderPipeline.getRenderer();
        const pmremGenerator = __classPrivateFieldGet(this, _EnvironmentActor_pmremGenerator, "f");
        if (!this.scene || !renderer)
            return;
        if (__classPrivateFieldGet(this, _EnvironmentActor_texture, "f")) {
            this.scene.object3d.environment = __classPrivateFieldGet(this, _EnvironmentActor_texture, "f");
        }
        else if (__classPrivateFieldGet(this, _EnvironmentActor_envScene, "f") && pmremGenerator) {
            __classPrivateFieldSet(this, _EnvironmentActor_texture, constructScene(pmremGenerator, __classPrivateFieldGet(this, _EnvironmentActor_envScene, "f")), "f");
            this.scene.object3d.environment = __classPrivateFieldGet(this, _EnvironmentActor_texture, "f");
        }
        else if (pmremGenerator) {
            const roomEnv = new RoomEnvironment();
            __classPrivateFieldSet(this, _EnvironmentActor_texture, constructScene(pmremGenerator, roomEnv), "f");
            this.scene.object3d.environment = __classPrivateFieldGet(this, _EnvironmentActor_texture, "f");
        }
        if (__classPrivateFieldGet(this, _EnvironmentActor_background, "f")) {
            this.scene.object3d.backgroundIntensity = __classPrivateFieldGet(this, _EnvironmentActor_backgroundIntensity, "f");
            this.scene.object3d.backgroundRotation = __classPrivateFieldGet(this, _EnvironmentActor_rotation, "f");
            this.scene.object3d.backgroundBlurriness = __classPrivateFieldGet(this, _EnvironmentActor_backgroundBlur, "f");
            this.scene.object3d.background = __classPrivateFieldGet(this, _EnvironmentActor_texture, "f");
        }
        else {
            this.scene.object3d.background = null;
        }
        this.scene.object3d.environmentIntensity = __classPrivateFieldGet(this, _EnvironmentActor_environmentIntensity, "f");
        this.scene.object3d.environmentRotation = __classPrivateFieldGet(this, _EnvironmentActor_rotation, "f");
    }
    onCreate() {
        const renderer = this.app?.renderPipeline.getRenderer();
        if (!renderer)
            throw new Error("Renderer not found");
        __classPrivateFieldSet(this, _EnvironmentActor_pmremGenerator, new Three.PMREMGenerator(renderer), "f");
        this.updateState();
    }
    onEnable() { this.updateState(); }
    onDisable() {
        if (this.scene?.object3d?.background === __classPrivateFieldGet(this, _EnvironmentActor_texture, "f")) {
            this.scene.object3d.background = null;
        }
    }
    onDestroy() { __classPrivateFieldGet(this, _EnvironmentActor_pmremGenerator, "f")?.dispose(); }
}
_EnvironmentActor_pmremGenerator = new WeakMap(), _EnvironmentActor_texture = new WeakMap(), _EnvironmentActor_envScene = new WeakMap(), _EnvironmentActor_rotation = new WeakMap(), _EnvironmentActor_environmentIntensity = new WeakMap(), _EnvironmentActor_background = new WeakMap(), _EnvironmentActor_backgroundIntensity = new WeakMap(), _EnvironmentActor_backgroundBlur = new WeakMap();
