export default function Section({ children, title, classes = "" }) {
  return (
    <div className={`border rounded-md p-6 w-full bg-white  ${classes} `}>
      {title && <p className="mb-6 text-md text-gray-600">{title}</p>}
      {children}
    </div>
  );
}
