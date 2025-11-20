import type { ComponentType } from "react";

export interface MiniAppDefinition {
  id: string;
  name: string;
  description: string;
  icon?: string;
  component: ComponentType;
}
