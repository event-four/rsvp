import Link from "next/link";
import Layout from "@/components/host/Layout";
import { getCookie } from "cookies-next";

const DZLandingPage = () => {
  return (
    <Layout>
      <div className="items-center mx-auto my-auto">
        <div>
          <Link href="/host/start">Create your website</Link>
        </div>
      </div>
    </Layout>
  );
};
export default DZLandingPage;
export const getServerSideProps = async ({ req, res }) => {
  let user = getCookie("E4_UIF", { req, res });

  console.log("user", user);

  return {
    props: { user },
  };
};
