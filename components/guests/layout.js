import Header from "./header";
import Footer from "./footer";

export default function Layout({ children, urls, title }) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header urls={urls} title={title} />
        <main>{children}</main>
        <Footer urls={urls}></Footer>
      </div>
    </>
  );
}
