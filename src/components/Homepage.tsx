"use client";
import React from "react";
import Image from "next/image";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { WavyBackground } from "@/components/WavyBackground";
import { Chatbot } from "@/components/Chatbot";

export function Homepage() {
  return (
    <div className="relative min-h-screen w-full bg-neutral-900 overflow-hidden">
      <WavyBackground className="absolute inset-0" />
      <ShootingStars className="absolute inset-0" />
      <StarsBackground className="absolute inset-0" />
      <div className="relative z-10 min-h-screen w-full flex flex-col items-center p-4">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 md:pt-12 lg:pt-16">
          <div className="flex flex-col items-center">
            <Image
              src="/images/jarvis logo.png"
              alt="Jarvis"
              width={800}
              height={600}
              className="object-contain w-48 h-20 sm:w-64 sm:h-26 md:w-80 md:h-32 lg:w-96 lg:h-40 mt-0"
              priority
              title="Jarvis"
            />
            <div className="mt-2 sm:mt-4 md:mt-6 lg:mt-8">
              <Chatbot />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}