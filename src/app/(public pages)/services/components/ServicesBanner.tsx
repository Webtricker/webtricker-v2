import Container from "@/sharedComponets/ui/wrapper/Container";
import { IServicesPage } from "@/types/pageTypes";
import Image from "next/image";
import React from "react";

export default function ServicesBanner({
  banner,
  bg,
}: {
  banner: IServicesPage["banner"];
  bg: IServicesPage["bannerBG"];
}) {

  return (
    <section className={`w-full min-h-screen z-0 flex relative`}>
      <Container className="flex items-center justify-center">
        <div className="w-full max-w-[1000px] text-center">
          <h1 className="wt_fs-7xl font-medium heading !leading-[100%]">
            {banner?.title}
          </h1>
          <p className="wt_fs-xl bold mt-5">{banner?.description}</p>
        </div>
      </Container>
      {bg?.type === "image" ? (
        <Image
          title="Click to change background"
          width={1800}
          height={900}
          src={bg?.src || ""}
          className=" absolute top-0 left-0 w-full h-full object-cover -z-10"
          alt="Service Banner Image"
        />
      ) : (
        <video
          title="Click to change background"
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          src={bg?.src || ""}
        >
          <source src={bg?.src || ""} type="video/mp4" />
        </video>
      )}
    </section>
  );
}
