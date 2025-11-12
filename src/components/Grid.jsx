import GridItem from "./GridItem";

export default function Grid({ images,setImageData, direction }) {
  return (
    <div className="grid py-4 md:grid-cols-8 grid-cols-4 gap-x-2  gap-y-20">
      {images.map((img, i) => (
        <GridItem key={i} image={`assets/${img}`} title={`Image ${i + 1}`} model={`Model ${i + 1}`} setImageData={setImageData} direction={direction}  />
      ))}
    </div>
  );
}
