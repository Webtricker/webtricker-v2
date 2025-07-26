import React from "react";
import Container from "../wrapper/Container";
import Image from "next/image";
import Link from "next/link";
import NewsLetterForm from "./NewsLetterForm";
import BouncingText from "../effects/BouncingText";
import SiteLogoLong from "../logos/SiteLogoLong";

export default function Footer() {
  return (
    <footer className="mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18">
      <div className="w-full bg-slate-200 dark:bg-black py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
        <Container className="flex justify-between flex-wrap gap-10 md:gap-16 lg:gap-10 2xl:gap-24">
          <div className="w-full max-w-[500px] md:max-w-[45%] 2xl:max-w-[450px] md:mt-[-4px]">
            <Link className="flex items-center gap-1 bold" href="/">
              <SiteLogoLong />
            </Link>
            <p className="mt-3 wt_fs-md">
              Looking for a reliable digital partner? We provide end-to-end
              solutions—design, development, marketing, SEO, and more.
              Let&apos;s collaborate for lasting success.
            </p>
          </div>
          <div className="w-full md:max-w-[45%] 2xl:max-w-[150px]">
            <h5>Our Pages</h5>
            <div className="mt-3 items-start flex flex-col gap-2 w-full wt_fs-md">
              <Link href="/About">About</Link>
              <Link href="/About">Services</Link>
              <Link href="/About">Portfolio</Link>
              <Link href="/About">Blog</Link>
              <Link href="/About">Contact</Link>
            </div>
          </div>
          <div className="w-full  md:max-w-[45%] 2xl:max-w-[200px]">
            <h5>Services</h5>
            <div className="mt-3 items-start flex flex-col gap-2 w-full wt_fs-md">
              <Link href="#">Web Development</Link>
              <Link href="#">UX/UI Design</Link>
              <Link href="#">SEO</Link>
              <Link href="#">Digital Marketing</Link>
              <Link href="#">Shopify Development</Link>
            </div>
          </div>
          <div className="w-full max-w-[400px] md:max-w-[45%] 2xl:max-w-[350px]">
            <h5>Follow Us on</h5>
            <div className="flex gap-5 md:gap-7 w-full mt-3">
              <Link href="#">
                <Image
                  src="/icons/home/facebook.svg"
                  width={26}
                  height={26}
                  alt="Social icon"
                />
              </Link>
              <Link href="#">
                <Image
                  src="/icons/home/twitter.svg"
                  width={26}
                  height={26}
                  alt="Social icon"
                />
              </Link>
              <Link href="#">
                <Image
                  src="/icons/home/linkedIn.svg"
                  width={26}
                  height={26}
                  alt="Social icon"
                />
              </Link>
              {/* <Link href="#"><Image src="/icons/home/you-tube.svg" width={26} height={26} alt="Social icon" /></Link> */}
              <Link href="#">
                <Image
                  src="/icons/home/pinterest.svg"
                  width={26}
                  height={26}
                  alt="Social icon"
                />
              </Link>
              <Link href="#">
                <Image
                  src="/icons/home/instagram.svg"
                  width={26}
                  height={26}
                  alt="Social icon"
                />
              </Link>
            </div>
            <div className="w-full mt-7">
              <label className="wt_fs-md">Subscribe to our newsletter:</label>
              <NewsLetterForm />
            </div>
          </div>
        </Container>
        <Container className="my-10">
          <div className="w-full flex items-center justify-center">
            <BouncingText
              size="wt_fs-7xl"
              text="Contact Us"
              interval={100}
              duration={4}
            />
          </div>
        </Container>
        <div className="w-full h-[1px] bg-slate-100 dark:bg-slate-800"></div>
        <Container className="text-center mt-5 lg:mt-10">
          <p>
            All rights reserved — {new Date().getFullYear()} &copy; Webtricker
          </p>
        </Container>
      </div>
    </footer>
  );
}
