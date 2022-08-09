import Navbar from "./Navbar";

export default function BoxWrap({ children, classes = "" }) {
  return <div className={`px-2 sm:px-6  ${classes} `}>{children}</div>;
}
