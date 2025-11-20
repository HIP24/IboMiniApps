import type { MiniAppDefinition } from "./types";
import { CalculatorApp } from "./samples/CalculatorApp";
import { NotesApp } from "./samples/NotesApp";
import { PomodoroApp } from "./samples/PomodoroApp";
import { YoutubeApp } from "./samples/YoutubeDownloader";

export const miniApps: MiniAppDefinition[] = [
  CalculatorApp,
  NotesApp,
  PomodoroApp,
  YoutubeApp
];
