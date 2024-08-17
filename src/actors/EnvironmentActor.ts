import * as Three from "three";
import { Actor } from "../mod";

function createDefaultEnvironment() {
	const scene = new Three.Scene();

	const geometry = new Three.BoxGeometry();
	geometry.deleteAttribute("uv");

	const roomMaterial = new Three.MeshStandardMaterial({ side: Three.BackSide });
	const boxMaterial = new Three.MeshBasicMaterial({ color: "#f1fffe" });

	const mainLight = new Three.PointLight(0xffffff, 5.0, 28, 2);
	mainLight.position.set(0.418, 16.199, 0.3);
	scene.add(mainLight);

	const room = new Three.Mesh(geometry, roomMaterial);
	room.position.set(-0.757, 13.219, 0.717);
	room.scale.set(31.713, 28.305, 28.591);
	scene.add(room);

	const box1 = new Three.Mesh(geometry, boxMaterial);
	box1.position.set(-10.906, 2.009, 1.846);
	box1.rotation.set(0, -0.195, 0);
	box1.scale.set(2.328, 7.905, 4.651);
	scene.add(box1);

	const box2 = new Three.Mesh(geometry, boxMaterial);
	box2.position.set(-5.607, -0.754, -0.758);
	box2.rotation.set(0, 0.994, 0);
	box2.scale.set(1.97, 1.534, 3.955);
	scene.add(box2);

	const box3 = new Three.Mesh(geometry, boxMaterial);
	box3.position.set(6.167, 0.857, 7.803);
	box3.rotation.set(0, 0.561, 0);
	box3.scale.set(3.927, 6.285, 3.687);
	scene.add(box3);

	const box4 = new Three.Mesh(geometry, boxMaterial);
	box4.position.set(-2.017, 0.018, 6.124);
	box4.rotation.set(0, 0.333, 0);
	box4.scale.set(2.002, 4.566, 2.064);
	scene.add(box4);

	const box5 = new Three.Mesh(geometry, boxMaterial);
	box5.position.set(2.291, -0.756, -2.621);
	box5.rotation.set(0, -0.286, 0);
	box5.scale.set(1.546, 1.552, 1.496);
	scene.add(box5);

	const box6 = new Three.Mesh(geometry, boxMaterial);
	box6.position.set(-2.193, -0.369, -5.547);
	box6.rotation.set(0, 0.516, 0);
	box6.scale.set(3.875, 3.487, 2.986);
	scene.add(box6);

	// -x right
	const light1 = new Three.Mesh(geometry, createAreaLightMaterial(50));
	light1.position.set(-16.116, 14.37, 8.208);
	light1.scale.set(0.1, 2.428, 2.739);
	scene.add(light1);

	// -x left
	const light2 = new Three.Mesh(geometry, createAreaLightMaterial(50));
	light2.position.set(-16.109, 18.021, -8.207);
	light2.scale.set(0.1, 2.425, 2.751);
	scene.add(light2);

	// +x
	const light3 = new Three.Mesh(geometry, createAreaLightMaterial(17));
	light3.position.set(14.904, 12.198, -1.832);
	light3.scale.set(0.15, 4.265, 6.331);
	scene.add(light3);

	// +z
	const light4 = new Three.Mesh(geometry, createAreaLightMaterial(43));
	light4.position.set(-0.462, 8.89, 14.52);
	light4.scale.set(4.38, 5.441, 0.088);
	scene.add(light4);

	// -z
	const light5 = new Three.Mesh(geometry, createAreaLightMaterial(20));
	light5.position.set(3.235, 11.486, -12.541);
	light5.scale.set(2.5, 2.0, 0.1);
	scene.add(light5);

	// +y
	const light6 = new Three.Mesh(geometry, createAreaLightMaterial(100));
	light6.position.set(0.0, 20.0, 0.0);
	light6.scale.set(1.0, 0.1, 1.0);
	scene.add(light6);

	function createAreaLightMaterial(intensity: number) {
		const material = new Three.MeshBasicMaterial();
		material.color.setScalar(intensity);
		return material;
	}

	return scene;
}

function constructScene(
	envScene: Three.Scene,
	scene: Three.Scene,
	renderer: Three.WebGLRenderer,
) {
	const pmremGenerator = new Three.PMREMGenerator(renderer);
	const envMap = pmremGenerator.fromScene(envScene).texture;
	scene.environment = envMap;
	pmremGenerator.dispose();
	return envMap;
}

type EnvironmentArgs = {
	texture?: Three.Texture | Three.CubeTexture;
	envScene?: Three.Scene;
	rotation?: Three.Euler;
	environmentIntensity?: number;
	background?: boolean;
	backgroundIntensity?: number;
	backgroundBlur?: number;
};

export class EnvironmentActor extends Actor {
	#texture: Three.Texture | Three.CubeTexture | null;

	get texture() {
		return this.#texture;
	}
	set texture(v) {
		this.#texture = v;
		this.#set();
	}

	#envScene: Three.Scene | null;
	get envScene() {
		return this.#envScene;
	}
	set envScene(v) {
		this.#envScene = v;
		this.#set();
	}

	#rotation: Three.Euler;
	get rotation() {
		return this.#rotation;
	}
	set rotation(v) {
		this.#rotation = v;
		this.#set();
	}

	#environmentIntensity: number;
	get environmentIntensity() {
		return this.#environmentIntensity;
	}
	set environmentIntensity(v) {
		this.#environmentIntensity = v;
		this.#set();
	}

	#background: boolean;
	get background() {
		return this.#background;
	}
	set background(v) {
		this.#background = v;
		this.#set();
	}

	#backgroundIntensity: number;
	get backgroundIntensity() {
		return this.#backgroundIntensity;
	}
	set backgroundIntensity(v) {
		this.#backgroundIntensity = v;
		this.#set();
	}

	#backgroundBlur: number;
	get backgroundBlur() {
		return this.#backgroundBlur;
	}
	set backgroundBlur(v) {
		this.#backgroundBlur = v;
		this.#set();
	}

	constructor(args: EnvironmentArgs = {}) {
		super();
		this.#texture = args.texture ?? null;
		this.#envScene = args.envScene ?? null;
		this.#rotation = args.rotation ?? new Three.Euler();
		this.#environmentIntensity = args.environmentIntensity ?? 1;
		this.#background = args.background ?? false;
		this.#backgroundIntensity = args.backgroundIntensity ?? 1;
		this.#backgroundBlur = args.backgroundBlur ?? 0;
	}

	#set() {
		const renderer = this.scene?.game?.renderPipeline.getRenderer();

		if (!this.scene || !renderer)
			throw new Error("Scene or renderer not found");

		if (this.#texture) {
			this.scene.root.object3d.environment = this.#texture;
		} else if (this.#envScene) {
			this.#texture = constructScene(
				this.#envScene,
				this.scene.root.object3d,
				renderer,
			);
		} else {
			this.#texture = constructScene(
				createDefaultEnvironment(),
				this.scene.root.object3d,
				renderer,
			);
		}

		if (this.#background) {
			this.scene.root.object3d.backgroundIntensity = this.#backgroundIntensity;
			this.scene.root.object3d.backgroundRotation = this.#rotation;
			this.scene.root.object3d.backgroundBlurriness = this.#backgroundBlur;
			this.scene.root.object3d.background = this.#texture;
		} else {
			this.scene.root.object3d.background = null;
		}

		this.scene.root.object3d.environmentIntensity = this.#environmentIntensity;
		this.scene.root.object3d.environmentRotation = this.#rotation;
	}

	onCreate() {
		super.onCreate();
		this.#set();
	}
}
