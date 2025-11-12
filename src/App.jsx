import Header from "./components/Header";
import Heading from "./components/Heading";
import Grid from "./components/Grid";
import Panel from "./components/Panel";
import Footer from "./components/Footer";
import SpeedsterImageReveal from "./components/Panel";
import { useState } from "react";

export default function App() {
  const [imageData,setImageData] = useState({})
  const sections = [
    {
      title: "Shane Weber",
      meta: "effect 01: straight linear paths, smooth easing, clean timing, minimal rotation.",
      direction:'left',
      images: ["img1.webp", "img2.webp", "img3.webp", "img4.webp", "img5.webp", "img6.webp", "img7.webp", "img8.webp","img9.webp", "img10.webp", "img11.webp", "img12.webp", "img13.webp", "img14.webp", "img15.webp", "img16.webp"],
    },
    {
      title: "Manika Jorge",
      direction:'right',
      meta: "effect 02: Adjusts mover count, rotation, timing, and animation feel.",
      images: ["img17.webp", "img18.webp", "img19.webp", "img20.webp", "img21.webp", "img22.webp", "img23.webp", "img24.webp","img25.webp", "img26.webp", "img27.webp", "img28.webp", "img29.webp", "img30.webp", "img31.webp", "img32.webp"],
    },
    {
      title: "Angela Wong",
      direction:'left',
      meta: "effect 03: Big arcs, smooth start, powerful snap, slow reveal.",
      images: ["img33.webp", "img1.webp", "img2.webp", "img3.webp", "img4.webp", "img5.webp", "img6.webp", "img7.webp","img1.webp", "img8.webp", "img9.webp", "img10.webp", "img11.webp", "img12.webp", "img13.webp", "img14.webp"],
    },
    {
      title: "Kaito Nakamo",
      direction:'right',
      meta: "effect 04: Quick upward motion with bold blending and smooth slow reveal.",
      images: ["img16.webp", "img17.webp", "img18.webp", "img19.webp", "img20.webp", "img21.webp", "img22.webp", "img23.webp","img24.webp", "img25.webp", "img26.webp", "img27.webp", "img28.webp", "img29.webp", "img30.webp", "img8.webp"],
    },
  ];

  return (
    <main className="bg-white px-4 py-6  w-full text-gray-900 min-h-screen font-sans">
      <Header />
      {sections.map((section, i) => (
        <section key={i} className="my-12">
          <Heading title={section.title} meta={section.meta} />
          <Grid images={section.images} direction={section.direction} setImageData={setImageData}  />
        </section>
      ))}
      {imageData.src ? <Panel imageData={imageData} setImageData={setImageData} /> :  <></> }
      <Footer />
      {/* <SpeedsterImageReveal/> */}
    </main>
  );
}
