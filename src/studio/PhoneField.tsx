"use client";
import React from "react";
import { COUNTRY_CODES } from "./phoneCodes";

/** Country-code select + number input. `code` and `number` come from react-hook-form's register(). */
export default function PhoneField({
  id,
  label = "Phone",
  code,
  number,
  error,
}: {
  id: string;
  label?: string;
  code: any;
  number: any;
  error?: string;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="phonefield">
        <select aria-label="Country code" {...code}>
          {COUNTRY_CODES.map((x) => (
            <option key={x.c} value={x.d}>
              {x.c} {x.d}
            </option>
          ))}
        </select>
        <input id={id} type="tel" inputMode="tel" autoComplete="tel-national" maxLength={20} placeholder="1712 345678" {...number} />
      </div>
      {error ? <p className="form__msg" style={{ color: "var(--amber)" }}>{error}</p> : null}
    </div>
  );
}

export const joinPhone = (code?: string, num?: string) => {
  const n = (num || "").replace(/[^\d\s\-()]/g, "").trim().replace(/^0+(?=\d)/, "");
  return n ? `${code || ""} ${n}`.trim() : "";
};
