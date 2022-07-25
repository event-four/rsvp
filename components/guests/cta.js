import Link from "next/link";

export default function CTA({ children, type }) {
  let cta = "";
  if (type === "wedding") {
    cta = (
      <>
        Planning an event? &nbsp;
        <a href="#" className="underline text-pink-600">
          Create your own event website for free!
        </a>
      </>
    );
  }
  return (
    <>
      <div className="text-center text-xs mt-2 font-poppins px-8 text-gray-800">
        {cta}
      </div>
    </>
  );
}
