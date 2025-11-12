export default function GridItem({ image, title, model,setImageData,direction }) {
  return (
    <figure onClick={()=>setImageData({src:image,model,title,direction})} className="m-0 p-0 flex  flex-col gap-1 cursor-pointer overflow-hidden [will-change:transform,clip-path]">
      <div
        className="w-full aspect-4/5 bg-position-[50%_50%] bg-[length:100%] transition-opacity hover:opacity-70 duration-150"
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      <figcaption className="text-end ">
        <p className="font-bold text-sm">{model}</p>
      </figcaption>
    </figure>
  );
}
