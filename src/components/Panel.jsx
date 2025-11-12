'use client'
import React, { useEffect, useRef,useState } from "react";
import { gsap } from "gsap";

export default function LeftToRightReveal({ imageData,setImageData }) {
    const containerRef = useRef(null);
    const copiesRef = useRef([]);



    useEffect(() => {
        if (imageData.src === undefined) return;
        let images = copiesRef.current;

        // Initial hidden state — top clipped, slightly smaller
        gsap.set(images, {
            opacity: 0,
            clipPath: "inset(0% 0% 100% 0%)",
            scale: 0.9,
            rotateX: 30,
        });

        const tl = gsap.timeline();
        const closeRef = containerRef.current?.querySelector('.close-button');
        if (imageData.direction == 'right'){
            images = images.toReversed();
        }
        images.forEach((img, i) => {
            // each starts before the previous finishes (overlap by 0.4s)
            const startTime = i * 0.4;

            tl.to(
                img,
                {
                    opacity: 1,
                    clipPath: "inset(0% 0% 0% 0%)",
                    scale: 1,
                    duration: 0.8,
                    rotateX: 0,
                    ease: "power2.out",
                },
                startTime
            );

            // hide only if not the final image
            if (i !== images.length - 1) {
                tl.to(
                    img,
                    {
                        clipPath: "inset(100% 0% 0% 0%)",
                        // opacity: 0.5,
                        duration: 0.6,
                        ease: "power1.in",
                    },
                    startTime + 0.7 // starts before full reveal of next begins
                );
            }
        });

        // Show close button after all animations end
        if (closeRef) {
            tl.to(closeRef, { opacity: 1, duration: 0.3 }, "<0.2");
        }
        
    }, [imageData]);

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0">
            <div
                ref={containerRef}
                className="relative p-10 w-full h-screen bg-white overflow-hidden flex justify-center items-end"
            >
                <div className={`close-button absolute px-5 pb-10 flex flex-col gap-1 ${imageData.direction == 'left' ? 'left-2' : 'right-2'} bottom-2`} style={{ opacity: 0 }}>
                    <p className="text-lg font-bold">{imageData.title}</p>
                    <p className="font-bold">{imageData.model}</p>
                    <p onClick={()=>setImageData({})} className="text-base font-semibold text-red-600 bg-transparent border-none  cursor-pointer">
                        Close
                    </p>
                </div>
                {
                    imageData.src && [...Array(6)].map((_, i) => (
                        <img
                            key={i}
                            ref={(el) => (copiesRef.current[i] = el)}
                            src={imageData.src}
                            alt="motion-frame"
                            className="-mr-12 aspect-4/5 "
                            style={{
                                height: imageData.direction == 'left' ? `${86 - (5 - i) * 10}%` : `${86 - i *10}%`,
                                zIndex: imageData.direction == 'left' ? i + 1 : 5-i,
                            }}
                        />
                    ))
                }

            </div>
        </div>
    );
}
