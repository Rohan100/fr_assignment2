'use client';
import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import Grid from './Grid';
import Heading from './Heading';
import { sections } from './utils'
// --- CONFIG ---
const baseConfig = {
  clipPathDirection: 'top-bottom',
  autoAdjustHorizontalClipPath: true,
  steps: 6,
  stepDuration: 0.35,
  stepInterval: 0.05,
  moverPauseBeforeExit: 0.14,
  rotationRange: 0,
  wobbleStrength: 0,
  panelRevealEase: 'sine.inOut',
  gridItemEase: 'sine',
  moverEnterEase: 'sine.in',
  moverExitEase: 'sine',
  panelRevealDurationFactor: 2,
  clickedItemDurationFactor: 2,
  gridItemStaggerFactor: 0.3,
  moverBlendMode: false,
  pathMotion: 'linear',
  sineAmplitude: 50,
  sineFrequency: Math.PI,
};

export default function GridToPanel() {
  const gridRef = useRef(null);
  const panelRef = useRef(null);
  const panelContentRef = useRef(null);
  const frameRef = useRef(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [config, setConfig] = useState(baseConfig);
  const currentItemRef = useRef(null);




  const init = () => {
    console.log(12221)
    const items = gsap.utils.toArray('.grid__item');
    console.log(items.length)
    items.forEach((item) => {
      item.addEventListener('click', () => onGridItemClick(item));
    });

    const closeBtn = panelContentRef.current?.querySelector('.panel__close');
    if (closeBtn) closeBtn.addEventListener('click', resetView);
    console.log(closeBtn)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isPanelOpen && !isAnimating) {
        resetView();
      }
    });
  };
  const lerp = (a, b, t) => a + (b - a) * t;

  const generateMotionPath = (startRect, endRect, steps) => {
    const path = [];
    const fullSteps = steps + 2;
    const startCenter = {
      x: startRect.left + startRect.width / 2,
      y: startRect.top + startRect.height / 2,
    };
    const endCenter = {
      x: endRect.left + endRect.width / 2,
      y: endRect.top + endRect.height / 2,
    };

    for (let i = 0; i < fullSteps; i++) {
      const t = i / (fullSteps - 1);
      const width = lerp(startRect.width, endRect.width, t);
      const height = lerp(startRect.height, endRect.height, t);
      const centerX = lerp(startCenter.x, endCenter.x, t);
      const centerY = lerp(startCenter.y, endCenter.y, t);
      path.push({
        left: centerX - width / 2,
        top: centerY - height / 2,
        width,
        height,
      });
    }
    return path.slice(1, -1);
  };

  const onGridItemClick = (item) => {
    if (isAnimating) return;
    setIsAnimating(true);
    currentItemRef.current = item;

    // Extract data from the clicked item
    const imgDiv = item.querySelector('.grid__item-image');
    const direction = imgDiv.dataset.direction;
    const caption = item.querySelector('figcaption');
    const imgURL = imgDiv.style.backgroundImage;
    const title = caption.querySelector('h3').textContent;
    const desc = caption.querySelector('p').textContent;

    // Animate grid items
    const allItems = gsap.utils.toArray('.grid__item');
    const delays = computeStaggerDelays(item, allItems);
    gsap.to(allItems, {
      opacity: 0,
      scale: (i, el) => (el === item ? 1 : 0.8),
      duration: (i, el) =>
        el === item ? config.stepDuration * config.clickedItemDurationFactor : 0.3,
      ease: config.gridItemEase,
      delay: (i) => delays[i],
    });

    // Continue with transition

    animateTransition(
      imgDiv,
      panelRef.current.querySelector('.panel__img'),
      imgURL,
      direction
    );
  };

  const computeStaggerDelays = (clickedItem, items) => {
    const baseCenter = getElementCenter(clickedItem);
    const distances = items.map((el) => {
      const center = getElementCenter(el);
      return Math.hypot(center.x - baseCenter.x, center.y - baseCenter.y);
    });
    const max = Math.max(...distances);
    return distances.map((d) => (d / max) * config.gridItemStaggerFactor);
  };

  const getElementCenter = (el) => {
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };


  const animateTransition = (startEl, endEl, imgURL,direction) => {
    const clipPaths = getClipPathsForDirection(direction);
    const startRect = startEl.getBoundingClientRect();
    const endRect = endEl.getBoundingClientRect();
    endEl.style.backgroundImage = imgURL
    const path = generateMotionPath(startRect, endRect, config.steps);
    console.log(path)
    // Create movers
    const fragment = document.createDocumentFragment();
    path.forEach((step, index) => {
      const mover = document.createElement('div');
      mover.className = 'mover fixed bg-cover bg-center';
      Object.assign(mover.style, {
        backgroundImage: imgURL,
        left: `${step.left}px`,
        top: `${step.top}px`,
        width: `${step.width}px`,
        height: `${step.height}px`,
        clipPath: clipPaths.from,
        zIndex: 1000 + index,
      });
      fragment.appendChild(mover);

      const delay = index * config.stepInterval;
      gsap
        .timeline({ delay })
        .fromTo(
          mover,
          { opacity: 0.4, clipPath: clipPaths.hide },
          {
            opacity: 1,
            clipPath: clipPaths.reveal,
            duration: config.stepDuration,
            ease: config.moverEnterEase,
          }
        )
        .to(
          mover,
          {
            clipPath: clipPaths.from,
            duration: config.stepDuration,
            ease: config.moverExitEase,
          },
          `+=${config.moverPauseBeforeExit}`
        );
    });

    gridRef.current.parentNode.insertBefore(fragment, gridRef.current.nextSibling);

    // Cleanup movers after animation
    const cleanupDelay =
      config.steps * config.stepInterval +
      config.stepDuration * 2 +
      config.moverPauseBeforeExit;
    gsap.delayedCall(cleanupDelay, () => {
      document.querySelectorAll('.mover').forEach((m) => m.remove());
    });

    // Reveal panel after movers
    revealPanel(endEl,direction);
  };

  const revealPanel = (endImg,direction) => {
    const clipPaths = getClipPathsForDirection(direction);

    gsap.set(panelContentRef.current, { opacity: 0 });
    gsap.set(panelRef.current, { opacity: 1, pointerEvents: 'auto' });

    gsap
      .timeline({
        defaults: {
          duration: config.stepDuration * config.panelRevealDurationFactor,
          ease: config.panelRevealEase,
        },
      })
      .fromTo(
        endImg,
        { clipPath: clipPaths.hide },
        {
          clipPath: clipPaths.reveal,
          delay: config.steps * config.stepInterval,
        }
      )
      .fromTo(
        panelContentRef.current,
        { y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'expo',
          delay: config.steps * config.stepInterval,
          onComplete: () => {
            setIsAnimating(false);
            setIsPanelOpen(true);
          },
        },
        '<-=.2'
      );
  };

  const getClipPathsForDirection = (direction) => {
    switch (direction) {
      case 'bottom-top':
        return {
          from: 'inset(0% 0% 100% 0%)',
          reveal: 'inset(0% 0% 0% 0%)',
          hide: 'inset(100% 0% 0% 0%)',
        };
      case 'left-right':
        return {
          from: 'inset(0% 100% 0% 0%)',
          reveal: 'inset(0% 0% 0% 0%)',
          hide: 'inset(0% 0% 0% 100%)',
        };
      case 'right-left':
        return {
          from: 'inset(0% 0% 0% 100%)',
          reveal: 'inset(0% 0% 0% 0%)',
          hide: 'inset(0% 100% 0% 0%)',
        };
      case 'top-bottom':
      default:
        return {
          from: 'inset(100% 0% 0% 0%)',
          reveal: 'inset(0% 0% 0% 0%)',
          hide: 'inset(0% 0% 100% 0%)',
        };
    }
  };

  const resetView = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const allItems = gsap.utils.toArray('.grid__item');
    gsap
      .timeline({
        defaults: { duration: config.stepDuration, ease: 'expo' },
        onComplete: () => {
          setIsAnimating(false);
          setIsPanelOpen(false);
        },
      })
      .to(panelRef.current, { opacity: 0, pointerEvents: 'none' })
      .set(allItems, { opacity: 1, scale: 1 });
  };

  useEffect(() => {
    init()
  }, [])

  return (
    <div className="app">
      {sections.map((section, i) => (
        <section ref={gridRef} key={i} className="my-12">
          <Heading title={section.title} meta={section.meta} />
          <Grid images={section.images} direction={section.direction} />
        </section>
      ))}

      <div ref={panelRef} className="panel  fixed 
    top-0 left-0 
    m-0 
    w-full h-screen 
    p-(--page-padding)
    grid 
    bg-white
    gap-(--panel-gap)
    opacity-0 
    pointer-events-none 
    z-10 
    will-change-[transform,clip-path] 
    justify-center 
    grid-rows-[1fr_min-content]
    grid-cols-2
    md:grid-rows-[100%] ">
        <div ref={panelContentRef} className="panel__content self-end ">
          <p href="#" className="panel__close text-red-500 cursor-pointer font-semibold">
            Close
          </p>
          <h3>Panel Title</h3>
          <p>Panel description...</p>
        </div>
        <div className="panel__img 
    bg-cover bg-center
    w-full h-auto
    aspect-4/5
    md:h-full 
    md:w-auto 
    md:max-w-full justify-self-end z-2000"></div>

      </div>
    </div>
  );

}
