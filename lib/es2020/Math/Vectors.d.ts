export type VectorLike = {
    x: number;
    y: number;
    z?: number;
    w?: number;
};
export type Vector2Like = {
    x: number;
    y: number;
};
export type Vector3Like = {
    x: number;
    y: number;
    z: number;
};
export type Vector4Like = {
    x: number;
    y: number;
    z: number;
    w: number;
};
export type QuaternionLike = {
    x: number;
    y: number;
    z: number;
    w: number;
};
export declare function isVectorLike(obj: unknown): obj is VectorLike;
export declare function isVector2Like(obj: unknown): obj is Vector2Like;
export declare function isVector3Like(obj: any): obj is Vector3Like;
export declare function isVector4Like(obj: any): obj is Vector4Like;
