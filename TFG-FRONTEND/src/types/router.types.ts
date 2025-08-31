import { JSX } from "react";

export interface RouterType {
  title: string;
  path: string;
  element: JSX.Element;
  roles?: string[];
}