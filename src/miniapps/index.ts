import type { MiniAppDefinition } from "./types";
import { YoutubeApp } from "./samples/YoutubeDownloader";
import { ArabicToLatinApp } from "./samples/ArabicToLatinApp";

export const miniApps: MiniAppDefinition[] = [
  YoutubeApp,
  ArabicToLatinApp
];
