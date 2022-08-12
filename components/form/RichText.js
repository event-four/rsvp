import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { forwardRef } from "react";
export const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

export default function RichText({ id, defaultValue, toolbar, ...props }) {
  console.log(props.defaultValue);
  const modules = {
    toolbar: toolbar ?? [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];
  return (
    <QuillNoSSRWrapper
      ref={id}
      defaultValue={defaultValue}
      modules={modules}
      formats={formats}
      theme="snow"
      {...props}
    />
  );
}
