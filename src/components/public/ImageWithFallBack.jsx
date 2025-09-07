"use client";
import { useState } from "react";
import Image from "next/image";
import fallbackImg from "@/assets/fallback.png";

const ImageWithFallBack = ({ src, fallbackSrc = fallbackImg, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  return (
    <Image src={imgSrc} onError={() => setImgSrc(fallbackSrc)} {...props} />
  );
};

export default ImageWithFallBack;
