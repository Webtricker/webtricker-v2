"use client";

import React, { useEffect, useRef } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperCore } from "swiper";

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

  // helper: draw image like background-size: cover into target ctx
  function drawImageCoverToCanvas(
    img: HTMLImageElement,
    targetCanvas: HTMLCanvasElement
  ) {
    const ctx = targetCanvas.getContext("2d");
    if (!ctx) return;

    const { width: w, height: h } = targetCanvas;

    const imgRatio = img.width / img.height;
    const canvasRatio = w / h;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > canvasRatio) {
      drawHeight = h;
      drawWidth = img.width * (h / img.height);
      offsetX = -(drawWidth - w) / 2;
      offsetY = 0;
    } else {
      drawWidth = w;
      drawHeight = img.height * (w / img.width);
      offsetX = 0;
      offsetY = -(drawHeight - h) / 2;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

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

    const coverCanvas = document.createElement("canvas");
    const nextCanvas = document.createElement("canvas");
    coverCanvas.width = nextCanvas.width = width;
    coverCanvas.height = nextCanvas.height = height;

    // preload images
    const imgEls: HTMLImageElement[] = bannerSlider.map((el) => {
      const img = new Image();
      img.src = el.img;
      return img;
    });

    let coverImg: HTMLImageElement;
    let canvasImg: HTMLImageElement;

    function switchImages() {
      coverImg = imgEls[index];
      canvasImg = imgEls[index + 1] || imgEls[0];
      index = index === imgEls.length - 2 ? 0 : index + 1;

      // pre-render both to canvases with "cover"
      drawImageCoverToCanvas(coverImg, coverCanvas);
      drawImageCoverToCanvas(canvasImg, nextCanvas);

      if (swiperRef.current) {
        swiperRef.current.slideToLoop(index);
      }
    }
    switchImages();

    const transitionFrames = Math.round((transitionDuration / 1000) * 60);
    const totalFrames = Math.round((imageDuration / 1000) * 60);

    function draw(t: number) {
      if (!ctx) return;

      // always background = next image
      ctx.drawImage(nextCanvas, 0, 0, width, height);

      if (t <= transitionFrames) {
        const bx = (t / transitionFrames) * wx;
        const by = (t / transitionFrames) * wy;

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            ctx.drawImage(
              coverCanvas,
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
            onSwiper={(swiper) => (swiperRef.current = swiper)}
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
