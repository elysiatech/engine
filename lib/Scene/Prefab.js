/**
 * Define a prefab with resources and factory function.
 * @param resources - A function that returns resources. It will be called only once, when the first instance of the prefab is created.
 * @param factory - A function that creates an instance of the prefab using the resources and additional arguments.
 *
 * @example
 * const createModelWithSharedGltf = definePrefab(
 * 	() => ({ gltf: assets.unwrap("myModel").clone() }),
 * 	({ gltf }, color: Vector3) => new MyModelActor(gltf, color)
 *);
 * await assets.load();
 * const model1 = ModelWithSharedGltf(new Three.Color("red"));
 * const model2 = ModelWithSharedGltf(new Three.Color("blue"));
 */
export function definePrefab(resources, factory) {
    let r;
    return (...args) => {
        if (!r)
            r = resources();
        return factory(r, ...args);
    };
}
