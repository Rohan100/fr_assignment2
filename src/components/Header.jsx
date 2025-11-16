export default function Header() {
  return (
    <header className="flex md:flex-row text-lg flex-col justify-between font-semibold tracking-tight mb-32 ">
      <p >repeating image transition</p>
      <div >
        <LinkDecoratedText>more info, </LinkDecoratedText>
        <LinkDecoratedText >code, </LinkDecoratedText>
        <LinkDecoratedText >all demos</LinkDecoratedText>
      </div>
      <div>
        <LinkDecoratedText >page-trainsition, </LinkDecoratedText>
        <LinkDecoratedText >repetition, </LinkDecoratedText>
        <LinkDecoratedText >grid</LinkDecoratedText>
      </div>
      <div className="flex flex-row md:flex-col text-wrap md:w-44 w-full">
        design,
        animate and
        ship real-time 3d experiences with spline.
      </div>
    </header>
  );
}

function LinkDecoratedText({ children }) {
  return (
    <span className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-current after:transition-transform after:duration-400 after:ease-linear after:origin-[right_center] after:scale-x-0 hover:after:scale-x-100 hover:after:origin-[left_center]">
      {children}
    </span>
  );
}
