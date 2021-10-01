// src/Components/index.tsx
import React from "react";

export interface TestCompProps {
  count: number;
}

export const TestComp: React.FC<TestCompProps> = ({ count }) => {
  return <h1>{count}</h1>;
};
