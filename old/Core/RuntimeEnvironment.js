import { ELYSIA_LOGGER } from "./Logger";
export class RuntimeEnvironment {
    static EnvMode = RuntimeEnvironment.GetModeFromEnvironment();
    static GetModeFromEnvironment() {
        // @ts-ignore
        const viteMode = import.meta?.env?.PROD;
        const nodeMode = process.env.NODE_ENV;
        if (viteMode || nodeMode === "production") {
            return "production";
        }
        if (nodeMode === "debug") {
            return "debug";
        }
        return "dev";
    }
    static GetWebglSupport(canvas) {
        try {
            const gl = canvas.getContext("webgl2");
            if (gl) {
                return 2;
            }
            const gl1 = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            if (gl1) {
                return 1;
            }
            return 0;
        }
        catch (e) {
            ELYSIA_LOGGER.error("Error detecting WebGL support:", e);
            if (e instanceof Error)
                return e;
            return Error(String(e));
        }
    }
}
