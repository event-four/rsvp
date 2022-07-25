import Footer from "../guests/footer";
export default function InnerLayout({ children, urls, title }) {
  return (
    <>
      <div className="container flex flex-col bg-primary">
        <div className=" min-h-full w-full ">
          <div className="f1"></div>
          {/* <div className="bg"></div> */}
          {/* <div className="bg-filter"></div> */}

          <div className="f2"></div>
          <div className="f3"></div>
        </div>
        <div className=" absolute w-screen flex flex-col h-full justify-between p-6">
          {children}
          <div className="h-1"></div>
          <Footer />
        </div>
      </div>
    </>
  );
}
