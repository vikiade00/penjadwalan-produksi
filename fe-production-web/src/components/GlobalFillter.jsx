import React from "react";
import { Input } from "@/components/ui/input";

export function GlobalFilter({ globalFilter, setGlobalFilter }) {
  return (
    <span>
      <Input
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search all columns"
      />
    </span>
  );
}
