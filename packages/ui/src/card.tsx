import React from "react";
import { JSX } from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="border shadow-lg p-6 bg-red rounded-2xl hover:shadow-xl transition-shadow duration-300">
      <h1 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-4">
        {title}
      </h1>
      <div className="text-gray-600">{children}</div>
    </div>
  );
}
