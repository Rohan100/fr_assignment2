export default function Heading({ title, meta }) {
  return (
    <div className="mt-10 ">
      <h2 style={{fontFamily: "'owners-xnarrow', sans-serif",fontSize:'clamp(2rem, 10vw, 6rem)',lineHeight:'0.77'}} className="md:text-6xl   text-start  w-full uppercase font-bold" >{title}</h2>
      <div className="flex gap-2  items-center">

      <span className="mt-0 block w-full md:text-end text-start text-sm  ">{meta}</span>
      <p className='w-1.5 h-1.5 bg-black rounded-full inline-block'></p>
      </div>
    </div>
  );
}
