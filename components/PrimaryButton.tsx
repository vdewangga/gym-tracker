"use client";

import { ButtonHTMLAttributes } from "react";

export const PrimaryButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={`w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-300 ${
      props.className ?? ""
    }`}
  />
);
