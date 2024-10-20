/**
 * Immediately runs the provided function, catching and returning all uncaught exceptions.
 */
export default function guard<T>(fn: () => T): T extends Promise<any> ? (Promise<Error | Awaited<T>>) : (Error | T);
