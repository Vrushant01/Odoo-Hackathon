import React from "react";
import styles from "./LoadingSkeleton.module.css";

export const LoadingSkeleton = ({
  variant = "rect", // 'text' | 'title' | 'circle' | 'rect' | 'card'
  width,
  height,
  style = {},
  className = ""
}) => {
  const customStyle = {
    width: width || undefined,
    height: height || undefined,
    ...style
  };

  const skeletonClass = [
    styles.skeleton,
    styles[variant],
    className
  ].join(" ").trim();

  return <div className={skeletonClass} style={customStyle} />;
};

export default LoadingSkeleton;
