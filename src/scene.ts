import * as Three from "three";
import type { Actor } from "./actor";
import { SceneActor } from "./actors/SceneActor";
import type { Behavior } from "./behavior";
import type { Game } from "./game";
import { ActiveCameraTag } from "./tags";

class PointerController {
	#raycaster = new Three.Raycaster();

	intersections = new Set<Actor>();

	cast(pointer: Three.Vector2, camera: Three.Camera, scene: SceneActor) {
		this.#raycaster.setFromCamera(pointer, camera);
		for (const i of this.#raycaster.intersectObjects(scene.object3d.children)) {
			if (i.object.userData.owner)
				this.intersections.add(i.object.userData.owner);
		}
	}
}

export abstract class Scene {
	game?: Game;

	root: SceneActor;

	behaviorsById = new Map<string | symbol, Behavior>();

	behaviorsByTag = new Map<string | symbol, Set<Behavior>>();

	gameObjectsById = new Map<string | symbol, Actor>();

	gameObjectsByTag = new Map<string | symbol, Set<Actor>>();

	get sound() {
		return this.game!.sound;
	}

	get input() {
		return this.game!.input;
	}

	get clock() {
		return this.game!.clock;
	}

	get pointerIntersections() {
		return this.#pointerController.intersections;
	}

	get isLoading() {
		return this.#isLoading;
	}

	get hasLoaded() {
		return this.#hasLoaded;
	}

	get hasStarted() {
		return this.#hasStarted;
	}

	get isPlaying() {
		return this.#isPlaying;
	}

	get isEnding() {
		return this.#isEnding;
	}

	get isDestroyed() {
		return this.#isDestroyed;
	}

	constructor() {
		this.root = new SceneActor();
		this.root.scene = this;
	}

	async setup(): Promise<void> {}

	play() {
		this.#isPlaying = true;
		this.root.create();
		this.root.spawn();
	}

	update(frametime: number, elapsedtime: number) {
		const camera = this.getGameObjectsByTag(ActiveCameraTag)
			.values()
			.next().value;

		this.#pointerController.intersections.clear();

		if (camera) {
			this.#pointerController.cast(
				this.game!.pointer,
				camera.object3d as Three.Camera,
				this.root,
			);
		}

		this.input.replay();

		this.root.update(frametime, elapsedtime);

		this.game!.renderPipeline.render(frametime, elapsedtime);
	}

	endPlay() {
		this.#isPlaying = false;
		this.#isEnding = true;
		this.root.despawn();
		this.root.destroy();
	}

	destructor() {
		this.#isDestroyed = true;
		this.root.despawn();
		this.root.destroy();
		this.sound.destructor();
	}

	getBehaviorById(id: string | symbol): Behavior | undefined {
		return this.behaviorsById.get(id);
	}

	getBehaviorsByTag(tag: string | symbol): Set<Behavior> {
		if (!this.behaviorsByTag.get(tag)) {
			this.behaviorsByTag.set(tag, new Set());
		}
		return this.behaviorsByTag.get(tag)!;
	}

	getGameObjectById(id: string | symbol): Actor | undefined {
		return this.gameObjectsById.get(id);
	}

	getGameObjectsByTag(tag: string | symbol): Set<Actor> {
		if (!this.gameObjectsByTag.get(tag)) {
			this.gameObjectsByTag.set(tag, new Set());
		}
		return this.gameObjectsByTag.get(tag)!;
	}

	getActiveCamera(): Actor<Three.Camera> | undefined {
		return this.getGameObjectsByTag(ActiveCameraTag).values().next().value;
	}

	setActiveCamera(gameObject: Actor): void {
		const current = this.getActiveCamera();
		if (current) {
			current.removeTag(ActiveCameraTag);
		}
		gameObject.addTag(ActiveCameraTag);
	}

	#pointerController = new PointerController();

	#isLoading = false;

	#hasLoaded = false;

	#hasStarted = false;

	#isPlaying = false;

	#isEnding = false;

	#isDestroyed = false;
}
