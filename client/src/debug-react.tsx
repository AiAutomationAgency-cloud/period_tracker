// Debug file to test React imports in browser context
import React, { useEffect, useState } from "react";

console.log("Debug: React imported successfully", React);
console.log("Debug: useEffect type", typeof useEffect);
console.log("Debug: useState type", typeof useState);

export function DebugReact() {
  console.log("Debug: Inside component, useEffect type", typeof useEffect);
  
  useEffect(() => {
    console.log("Debug: useEffect callback executed successfully");
  }, []);

  return <div>React Debug Test</div>;
}