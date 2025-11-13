export default function GridItem({ image, title, model,direction }) {
  return (
    <figure   className="grid__item m-0 p-0 flex  flex-col gap-1 cursor-pointer overflow-hidden [will-change:transform,clip-path]">
      <div data-direction={direction}
        className="grid__item-image w-full aspect-4/5 bg-position-[50%_50%] bg-[length:100%] transition-opacity hover:opacity-70 duration-150"
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      <figcaption className="text-end figcaption ">
        <h3 className="font-bold text-sm hidden">{title}</h3>
        <p className="font-bold text-sm">{model}</p>
      </figcaption>
    </figure>
  );
}
