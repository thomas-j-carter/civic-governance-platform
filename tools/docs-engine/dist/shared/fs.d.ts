export declare function ensureDir(dirPath: string): Promise<void>;
export declare function fileExists(filePath: string): Promise<boolean>;
export declare function readText(filePath: string): Promise<string>;
export declare function writeText(filePath: string, contents: string): Promise<void>;
export declare function writeJson(filePath: string, value: unknown): Promise<void>;
