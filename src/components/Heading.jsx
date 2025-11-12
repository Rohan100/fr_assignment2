export default function Heading({ title, meta }) {
  return (
    <div className="mt-10 ">
      <h2 className="md:text-6xl text-4xl text-start tracking-tighter w-full uppercase font-extrabold" >{title}</h2>
      <span className="md:-mt-3 mt-0 block w-full md:text-end text-start text-sm text-gray-500 ">{meta}</span>
    </div>
  );
}
