import type { MiniAppDefinition } from "./types";
import { YoutubeApp } from "./samples/YoutubeDownloader";
import { ArabicToLatinApp } from "./samples/ArabicToLatinApp";
import { DecisionMakerApp } from "./samples/DecisionMakerApp";
import SyrianAIApp from "./samples/SyrianAIApp";

export const miniApps: MiniAppDefinition[] = [
  YoutubeApp,
  ArabicToLatinApp,
  DecisionMakerApp,
  SyrianAIApp
];
