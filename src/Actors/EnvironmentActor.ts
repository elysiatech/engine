import * as Three from "three";
import { Actor } from "../Scene/Actor";
import { RoomEnvironment } from "three-stdlib";

function constructScene(pmremGenerator: Three.PMREMGenerator, envScene: Three.Scene)
{
	const envMap = pmremGenerator.fromScene(envScene).texture;
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

export class EnvironmentActor extends Actor
{
	get texture() { return this.#texture; }
	set texture(v) { this.#texture = v; this.updateState(); }

	get envScene() { return this.#envScene; }
	set envScene(v) { this.#envScene = v; this.updateState(); }

	get rotation() { return this.#rotation; }
	set rotation(v) { this.#rotation = v; this.updateState(); }


	get intensity() { return this.#environmentIntensity; }
	set intensity(v) { this.#environmentIntensity = v; this.updateState(); }

	get background() { return this.#background; }
	set background(v) { this.#background = v; this.updateState(); }

	get backgroundIntensity() { return this.#backgroundIntensity; }
	set backgroundIntensity(v) { this.#backgroundIntensity = v; this.updateState(); }

	get backgroundBlur() { return this.#backgroundBlur; }
	set backgroundBlur(v) { this.#backgroundBlur = v; this.updateState(); }

	constructor(args: EnvironmentArgs = {})
	{
		super();
		this.#texture = args.texture ?? null;
		this.#envScene = args.envScene ?? null;
		this.#rotation = args.rotation ?? new Three.Euler();
		this.#environmentIntensity = args.environmentIntensity ?? 1;
		this.#background = args.background ?? false;
		this.#backgroundIntensity = args.backgroundIntensity ?? 1;
		this.#backgroundBlur = args.backgroundBlur ?? 0;
	}

	updateState()
	{
		const renderer = this.app?.renderPipeline.getRenderer();
		const pmremGenerator = this.#pmremGenerator;

		if (!this.scene || !renderer)
			throw new Error("Scene or renderer not found");

		if (this.#texture) { this.scene.object3d.environment = this.#texture; }
		else if (this.#envScene && pmremGenerator)
		{
			this.#texture = constructScene(
				pmremGenerator,
				this.#envScene,
			);
			this.scene.object3d.environment = this.#texture;
		}
		else if(pmremGenerator)
		{
			this.#texture = constructScene(
				pmremGenerator,
				RoomEnvironment(),
			);
			this.scene.object3d.environment = this.#texture;
		}

		if (this.#background)
		{
			this.scene.object3d.backgroundIntensity = this.#backgroundIntensity;
			this.scene.object3d.backgroundRotation = this.#rotation;
			this.scene.object3d.backgroundBlurriness = this.#backgroundBlur;
			this.scene.object3d.background = this.#texture;
		}
		else
		{
			this.scene.object3d.background = null;
		}

		this.scene.object3d.environmentIntensity = this.#environmentIntensity;
		this.scene.object3d.environmentRotation = this.#rotation;
	}

	onCreate()
	{
		const renderer = this.app?.renderPipeline.getRenderer();
		if(!renderer) throw new Error("Renderer not found");

		this.#pmremGenerator = new Three.PMREMGenerator(renderer);
		this.updateState();
	}

	onEnable() { this.updateState(); }

	onDisable()
	{
		if(this.scene?.object3d?.background === this.#texture) { this.scene.object3d.background = null; }
	}

	onDestroy() { this.#pmremGenerator?.dispose(); }

	#pmremGenerator?: Three.PMREMGenerator;
	#texture: Three.Texture | Three.CubeTexture | null;
	#envScene: Three.Scene | null;
	#rotation: Three.Euler;
	#environmentIntensity: number;
	#background: boolean;
	#backgroundIntensity: number;
	#backgroundBlur: number;
}
