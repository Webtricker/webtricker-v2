import { socialLinks } from "@/data/navLinks";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function SocialLinks() {
  const getRandomID = () => parseInt(Math.random() * 30 + "");
  return (
    <>
      {socialLinks.map((item) => (
        <Link key={item._id + getRandomID()} target="_blank" href={item.link}>
          <Image src={item.iconURL} width={26} height={26} alt="Social icon" />
        </Link>
      ))}
    </>
  );
}
