import * as Three from "three";
import { Actor } from "../actor";

export class PerspectiveCameraActor extends Actor<Three.PerspectiveCamera> {
	override object3d: Three.PerspectiveCamera;

	#fov: number;
	get fov() {
		return this.#fov;
	}
	set fov(value: number) {
		this.#fov = value;
		this.object3d.fov = value;
		this.object3d.updateProjectionMatrix();
	}

	#near: number;
	get near() {
		return this.#near;
	}
	set near(value: number) {
		this.#near = value;
		this.object3d.near = value;
		this.object3d.updateProjectionMatrix();
	}

	#far: number;
	get far() {
		return this.#far;
	}
	set far(value: number) {
		this.#far = value;
		this.object3d.far = value;
		this.object3d.updateProjectionMatrix();
	}

	constructor(
		settings: {
			fov?: number;
			near?: number;
			far?: number;
		} = {},
	) {
		super();

		this.#fov = settings.fov ?? 75;
		this.#near = settings.near ?? 0.1;
		this.#far = settings.far ?? 1000;

		this.object3d = new Three.PerspectiveCamera(
			this.#fov,
			1,
			this.#near,
			this.#far,
		);

		this.object3d.userData.owner = this;
	}

	override onCreate() {
		super.onCreate();
		const renderTarget =
			this.scene!.game!.renderPipeline.getRenderer().domElement;
		this.object3d.aspect = renderTarget.clientWidth / renderTarget.clientHeight;
		this.object3d.updateProjectionMatrix();
	}

	override onResize(b: DOMRect) {
		const renderTarget =
			this.scene!.game!.renderPipeline.getRenderer().domElement;
		this.object3d.aspect = renderTarget.clientWidth / renderTarget.clientHeight;
		this.object3d.updateProjectionMatrix();
	}
}
