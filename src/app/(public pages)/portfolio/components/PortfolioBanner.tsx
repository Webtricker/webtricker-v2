"use client";

import React, { useEffect, useRef } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import { IPortfolioPage } from "@/types/pageTypes";

type Props = {
  bannerSlider: IPortfolioPage["bannerSlider"];
  width?: number;
  height?: number;
  rows?: number;
  cols?: number;
  imageDuration?: number;
  transitionDuration?: number;
};

const PortfolioBanner: React.FC<Props> = ({
  bannerSlider,
  width = 800,
  height = 600,
  rows = 8,
  cols = 8,
  imageDuration = 10000,
  transitionDuration = 4000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const swiperRef = useRef<SwiperCore | null>(null);

  useEffect(() => {
    if (!canvasRef.current || bannerSlider.length < 2) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const wx = width / cols;
    const wy = height / rows;

    let frame = 0;
    let index = 0;
    let coverImg: HTMLImageElement;
    let canvasImg: HTMLImageElement;

    // preload images
    const imgEls: HTMLImageElement[] = bannerSlider.map((el) => {
      const img = new Image();
      img.src = el.img;
      return img;
    });

    function switchImages() {
      coverImg = imgEls[index];
      canvasImg = imgEls[index + 1] || imgEls[0];
      index = index === imgEls.length - 2 ? 0 : index + 1;

      // 🔥 sync Swiper when image changes
      if (swiperRef.current) {
        swiperRef.current.slideToLoop(index); // loop index sync
      }
    }
    switchImages();

    // 🔥 timing
    const transitionFrames = Math.round((transitionDuration / 1000) * 60);
    const totalFrames = Math.round((imageDuration / 1000) * 60);

    function draw(t: number) {
      if (!ctx) return;

      ctx.drawImage(canvasImg, 0, 0, width, height);

      if (t <= transitionFrames) {
        const bx = (t / transitionFrames) * wx;
        const by = (t / transitionFrames) * wy;

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            ctx.drawImage(
              coverImg,
              i * wx,
              j * wy,
              wx - bx,
              wy - by,
              i * wx,
              j * wy,
              wx - bx,
              wy - by
            );
          }
        }
      }
    }

    let frameId: number;
    function render() {
      draw(frame);
      frame++;

      if (frame > totalFrames) {
        frame = 0;
        switchImages();
      }

      frameId = requestAnimationFrame(render);
    }
    render();

    return () => cancelAnimationFrame(frameId);
  }, [
    width,
    height,
    rows,
    cols,
    imageDuration,
    transitionDuration,
    bannerSlider,
  ]);

  return (
    <section className="w-full relative">
      <canvas
        ref={canvasRef}
        className="max-h-[70vh] z-10 md:max-h-[80vh] block w-full h-full"
      />
      <div className="w-full z-20 h-full bg-slate-900/30 absolute top-0 left-0">
        {!!bannerSlider?.length && (
          <Swiper
            allowTouchMove={false}
            loop={true}
            pagination={{ clickable: false }}
            modules={[Pagination]}
            className="portfolio-slider w-full h-full p-10"
            onSwiper={(swiper) => (swiperRef.current = swiper)} // save swiper instance
          >
            {bannerSlider.map((slide) => (
              <SwiperSlide
                key={slide?._id}
                className="w-full h-full bg-transparent text-white p-10 !flex flex-col pt-[60px] items-center justify-center"
              >
                <p>{slide?.technology}</p>
                <h2>{slide?.name}</h2>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default PortfolioBanner;
