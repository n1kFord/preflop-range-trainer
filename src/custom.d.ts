declare module "*.mp3" {
    const src: string;
    export default src;
}

declare module "prange" {
    export default function prange(range: string): string[];
}
