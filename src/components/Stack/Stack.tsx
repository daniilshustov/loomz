import React from "react";

import styles from "./Stack.module.css";

interface StackProps {
  children: React.ReactNode;
}

export const Stack = ({ children }: StackProps) => (
  <div className={styles.container}>
    {React.Children.map(
      children,
      (child: React.ReactNode, index: number) =>
        child && <div key={index}>{child}</div>
    )}
  </div>
);
