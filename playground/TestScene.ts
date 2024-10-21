import { Core, Scene, Actors, Behaviors, Physics, RPipeline } from "../src/mod.ts"
import * as Three from "three"

const app = new Core.Application({
	renderPipeline: new RPipeline.HighDefRenderPipeline
})

const scene = new Scene.Scene;

scene.physics = new Physics.PhysicsWorld({ debug: true })

scene.ambientLight.intensity = 1;

const camera = new Actors.PerspectiveCameraActor;
camera.position.z = 5;
camera.addComponent(new Behaviors.CameraOrbitBehavior);
scene.activeCamera = camera;

const rootActor = new Scene.Actor;
rootActor.position.y = 3;
rootActor.object3d.add(new Three.AxesHelper(1))
rootActor.addComponent(new Physics.RigidBody(Physics.RigidbodyType.Dynamic))

const cube = new Actors.CubeActor;
cube.position.y = -1
cube.addComponent(new Physics.SphereCollider(.8))

const cube2 = new Actors.CubeActor;
cube2.position.x = 2
cube2.position.y = -.5
cube.addComponent(cube2)
cube2.addComponent(new Physics.BoxCollider)

rootActor.addComponent(cube)

const env = new Actors.EnvironmentActor;
env.background = true;
env.backgroundBlur = 4;

const floor = new Actors.CubeActor;
floor.material.color = new Three.Color("black");
floor.position.y = -3;
floor.scale.set(10, .1, 10);
floor.addComponent(new Physics.BoxCollider)
scene.addComponent(camera, rootActor, env, floor)

export { scene, app };
