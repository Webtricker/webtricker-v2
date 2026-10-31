import React, { Suspense } from "react";
import { Metadata } from "next";
import Container from "@/sharedComponets/ui/wrapper/Container";
import ManageBooking from "./ManageBooking";

// Private, tokenised page: keep it out of search results.
export const metadata: Metadata = {
  title: "Manage your consultation",
  robots: { index: false, follow: false },
};

export default function ManageBookingPage() {
  return (
    <main className="w-full z-0">
      <div className="w-full mt-[130px] md:mt-[150px] lg:mt-[180px] mb-16">
        <Container>
          <div className="w-full max-w-[640px] mx-auto">
            <h1 className="heading xl:font-semibold !leading-[100%]">
              Your consultation
            </h1>
            <div className="mt-8">
              <Suspense fallback={null}>
                <ManageBooking />
              </Suspense>
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
}
