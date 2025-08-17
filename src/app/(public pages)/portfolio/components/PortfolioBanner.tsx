"use client";
import React, { useEffect, useRef } from "react";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type Props = {
  images: string[];
  width?: number;
  height?: number;
  rows?: number;
  cols?: number;
  imageDuration?: number;
  transitionDuration?: number;
};

const PortfolioBanner: React.FC<Props> = ({
  images,
  width = 800,
  height = 600,
  rows = 8,
  cols = 8,
  imageDuration = 10000,
  transitionDuration = 4000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || images.length < 2) return;

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
    const imgEls: HTMLImageElement[] = images.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    function switchImages() {
      coverImg = imgEls[index];
      canvasImg = imgEls[index + 1] || imgEls[0];
      index = index === imgEls.length - 2 ? 0 : index + 1;
    }
    switchImages();

    // 🔥 timing
    const transitionFrames = Math.round((transitionDuration / 1000) * 60);
    const totalFrames = Math.round((imageDuration / 1000) * 60);

    function draw(t: number) {
      if (!ctx) return;

      ctx.drawImage(canvasImg, 0, 0, width, height);

      if (t <= transitionFrames) {
        const bx = (t / transitionFrames) * wx; // smooth shrink until fully gone
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
  }, [images, width, height, rows, cols, imageDuration, transitionDuration]);

  return (
    <section className="w-full relative">
      <canvas
        ref={canvasRef}
        className="max-h-[70vh] md:max-h-[80vh] block w-full h-full"
      />
      <div className="w-full h-full bg-slate-900/30 absolute top-0 left-0">
        <Swiper
          modules={[EffectFade, Autoplay]}
          effect="fade"
          loop={true}
          autoplay={{
            delay: imageDuration, // time between slides
            disableOnInteraction: false,
          }}
          speed={1000} // fade speed
          className="w-full h-full"
        >
          <SwiperSlide className="w-full h-full bg-red-200/50">
            <h1>Text 1</h1>
          </SwiperSlide>
          <SwiperSlide className="w-full h-full bg-green-200/50">
            <h1>Text 2</h1>
          </SwiperSlide>
          <SwiperSlide className="w-full h-full bg-blue-200/50">
            <h1>Text 3</h1>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default PortfolioBanner;
