import type { Camera, DirectionalLight, Euler, Group, Light, Material, Mesh, Object3D, OrthographicCamera, PerspectiveCamera, PointLight, Quaternion, RenderItem, Scene, SkinnedMesh, SpotLight, Texture, Vector2, Vector3 } from "three";
export declare class AssertionError extends Error {
    constructor(message: string);
}
export declare class DebugAssertionError extends AssertionError {
    constructor(message: string);
}
export declare function ASSERT<T>(condition: T, message?: string | Function | Error): asserts condition;
export declare namespace ASSERT {
    var enabled: boolean;
}
export declare function DEBUG_ASSERT(condition: any, message: string | Function | Error): asserts condition;
export declare namespace DEBUG_ASSERT {
    var enabled: boolean;
}
export declare function isBoolean(value: any): value is boolean;
export declare function isTrue(value: any): value is true;
export declare function isFalse(value: any): value is false;
export declare function isTruthy<T>(value: T): value is NonNullable<T>;
export declare function isFalsy(value: any): value is false | 0 | "" | null | undefined | void;
export declare function isNull(value: any): value is null;
export declare function isUndefined(value: any): value is undefined;
export declare function isNullish(value: any): value is null | undefined;
export declare function isString(value: any): value is string;
export declare function isNumber(value: any): value is number;
export declare function isInteger(value: any): value is number;
export declare function isFloat(value: any): value is number;
export declare function isBigInt(value: any): value is bigint;
export declare function isSymbol(value: any): value is symbol;
export declare function isFunction(value: any): value is Function;
export declare function isDestroyable(value: any): value is {
    destructor(): void;
};
export declare function isObject(value: any): value is Object;
export declare function hasKeys<K extends string | number | symbol>(value: any, ...keys: Array<K>): value is {
    readonly [Key in K]: unknown;
};
export declare function isArray(value: any): value is Array<any>;
export declare function arrayContains<T>(value: any, type: (value: any) => value is T): value is Array<T>;
export declare function isDate(value: any): value is Date;
export declare function isError(value: any): value is Error;
export declare function isRegExp(value: any): value is RegExp;
export declare function isPromise(value: any): value is Promise<unknown>;
export declare function isBrowser(): boolean;
export declare function isNode(): boolean;
declare global {
    var ELYSIA_DEV: boolean | undefined;
}
export declare function isDev(): any;
export declare function hasTTY(): any;
export declare function isCI(): any;
export declare function isObject3D(obj: any): obj is Object3D;
export declare function isScene(obj: any): obj is Scene;
export declare function isGroup(obj: any): obj is Group;
export declare function isCamera(obj: any): obj is Camera;
export declare function isPerspectiveCamera(obj: any): obj is PerspectiveCamera;
export declare function isOrthographicCamera(obj: any): obj is OrthographicCamera;
export declare function isVector2Like(obj: any): obj is Vector2 | {
    x: number;
    y: number;
};
export declare function isVector2(obj: any): obj is Vector2;
export declare function isVector3Like(obj: any): obj is Vector3 | {
    x: number;
    y: number;
    z: number;
};
export declare function isVector3(obj: any): obj is Vector3;
export declare function isQuaternionLike(obj: any): obj is Quaternion | {
    x: number;
    y: number;
    z: number;
    w: number;
};
export declare function isQuaternion(obj: any): obj is Quaternion;
export declare function isEulerLike(obj: any): obj is Euler | {
    x: number;
    y: number;
    z: number;
};
export declare function isEuler(obj: any): obj is Euler;
export declare function isLight(obj: any): obj is Light;
export declare function isPointLight(obj: any): obj is PointLight;
export declare function isSpotLight(obj: any): obj is SpotLight;
export declare function isDirectionalLight(obj: any): obj is DirectionalLight;
export declare function isMesh(obj: any): obj is Mesh;
export declare function isSkinnedMesh(obj: any): obj is SkinnedMesh;
export declare function isMaterial(obj: any): obj is Material;
export declare function isTexture(obj: any): obj is Texture;
export declare function isRenderItem(obj: any): obj is RenderItem;
