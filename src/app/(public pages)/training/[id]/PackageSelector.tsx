"use client";

import Link from "next/link";
import Button from "@/sharedComponets/ui/buttons/Button";
import { useState } from "react";

type CoursePackage = {
  _id?: string;
  name: string;
  tier: string;
  duration: string;
  totalFee: number;
  offlineTotalFee?: number;
  registrationFee: number;
  installmentAmount: number;
  installmentCount: number;
  currency: string;
  scheduleType?: string;
  nextCohortDate?: string;
  classDays?: string;
  enrolledCount?: number;
  rating?: number;
  isPopular?: boolean;
  isJobReady?: boolean;
  outcomeStatement?: string;
  deliverables?: string[];
  idealForThisPackage?: string;
  modules: { title: string; duration?: string; project?: string; description?: string }[];
};

export default function PackageSelector({
  packages,
  detailedDescription,
  certification,
  idealFor,
}: {
  packages: CoursePackage[];
  detailedDescription: string;
  certification?: string;
  idealFor?: string[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const pkg = packages[activeIndex] ?? packages[0];
  if (!pkg) return null;

  const currency = pkg.currency || "BDT";
  const hasMultiple = packages.length > 1;
  const nextCohort = pkg.nextCohortDate
    ? new Date(pkg.nextCohortDate).toLocaleDateString("en-BD", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <>
      {/* Package tabs */}
      {hasMultiple && (
        <div className="mb-6 flex flex-wrap gap-2">
          {packages.map((p, i) => (
            <button
              key={p._id ?? i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                i === activeIndex
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              {p.name}
              {p.isPopular && (
                <span className="ml-2 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-semibold text-black">
                  Popular
                </span>
              )}
              {p.isJobReady && (
                <span className="ml-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-semibold text-white">
                  Job-Ready
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Outcome statement */}
      {pkg.outcomeStatement && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">After this course</p>
          <p className="text-base font-medium text-black">{pkg.outcomeStatement}</p>
        </div>
      )}

      {/* Course Header card */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: overview */}
          <div className="lg:col-span-2">
            <h2 className="!text-2xl font-semibold text-black mb-4">Course Overview</h2>
            <p className="text-lg text-gray-600 mb-6">{detailedDescription}</p>

            {idealFor && idealFor.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-black mb-2">Who is this for?</p>
                <div className="flex flex-wrap gap-2">
                  {idealFor.map((item) => (
                    <span key={item} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {pkg.idealForThisPackage && (
              <p className="mb-6 text-sm text-gray-600 italic">{pkg.idealForThisPackage}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
                </svg>
                <span className="text-gray-600">Duration: {pkg.duration}</span>
              </div>
              {certification && (
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">{certification}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: pricing card */}
          <div className={`border rounded-lg p-6 ${pkg.isJobReady ? "border-green-400 bg-green-50" : "bg-gray-50 border-gray-200"}`}>
            {pkg.isJobReady && (
              <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                Job-Ready Program
              </div>
            )}
            {pkg.isPopular && !pkg.isJobReady && (
              <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-black">
                Most Popular
              </div>
            )}

            <h3 className="!text-xl font-semibold text-black mb-4">
              {hasMultiple ? pkg.name : "Course Pricing"}
            </h3>

            <div className="space-y-3 mb-4">
              {/* Online pricing */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Online Mode</p>
                <p className="text-2xl font-bold text-black">
                  {pkg.totalFee.toLocaleString()} {currency}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  ৳{pkg.registrationFee.toLocaleString()} registration + ৳{pkg.installmentAmount.toLocaleString()} × {pkg.installmentCount} monthly installments
                </p>
              </div>

              {/* Offline pricing */}
              {pkg.offlineTotalFee && pkg.offlineTotalFee > 0 && (
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs text-gray-500 mb-1">Offline Mode</p>
                  <p className="text-xl font-bold text-black">
                    {pkg.offlineTotalFee.toLocaleString()} {currency}
                  </p>
                </div>
              )}
            </div>

            {/* Schedule info */}
            {(nextCohort || pkg.classDays) && (
              <div className="border-t border-gray-200 pt-3 mb-4 space-y-1 text-xs text-gray-600">
                {nextCohort && (
                  <div className="flex items-center gap-2">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>Next cohort: {nextCohort}</span>
                  </div>
                )}
                {pkg.classDays && (
                  <div className="flex items-center gap-2">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
                    </svg>
                    <span>{pkg.classDays}</span>
                  </div>
                )}
              </div>
            )}

            {pkg.deliverables && pkg.deliverables.length > 0 && (
              <div className="border-t border-gray-200 pt-3 mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">What you{"'"}ll get</p>
                <ul className="space-y-1.5">
                  {pkg.deliverables.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <svg className="h-3.5 w-3.5 shrink-0 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link href="/contact" className="block">
              <Button label="Enroll Now" className="w-full !rounded-md !px-4 !py-3 !bg-black !text-white" />
            </Link>
          </div>
        </div>
      </div>

      {/* Modules for selected package */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="!text-xl font-semibold text-black mb-4">Course Modules</h2>
        {pkg.modules.length === 0 ? (
          <p className="text-gray-500 text-sm">No modules listed yet.</p>
        ) : (
          <ul className="space-y-3">
            {pkg.modules.map((mod, i) => (
              <li key={i} className="space-y-1">
                <div className="flex items-start gap-3">
                  <div className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5 shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-gray-700">
                    {mod.title}
                    {mod.duration && <span className="ml-2 text-xs text-gray-400">({mod.duration})</span>}
                  </span>
                </div>
                {mod.project && (
                  <p className="ml-9 text-xs text-gray-500">
                    🛠️ <span className="font-medium">Project:</span> {mod.project}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
