import Container from "@/sharedComponets/ui/wrapper/Container";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <>
      <div className="w-full min-h-[600px] h-screen flex flex-col items-center justify-center">
        <Container className="text-center flex flex-col items-center">
          <h1 className="wt_fs-6xl font-bold mb-5 lg:mb-8">Oops!</h1>
          <Image
            width={600}
            height={400}
            className="max-w-[350px] w-full md:max-w-[400px] lg:max-w-[500px]"
            src="/images/shared/404-image.webp"
            alt="Error 404"
          />

          <div className="tp-error-content mt-5 lg:mt-8">
            <h4 className="mb-1 lg:mb-2">Page Not Found</h4>

            <p>Sorry, we couldn&apos;t find your page.</p>

            <p>
              <span className="mr-1">Back to</span>
              <Link  href="/" className="underline">
                Home
              </Link>
            </p>
          </div>
        </Container>
      </div>
    </>
  );
}
