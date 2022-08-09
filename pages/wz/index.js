import Link from "next/link";
import Layout from "@/components/wz/Layout";

const DZLandingPage = () => {
  return (
    <Layout>
      <div className="items-center mx-auto my-auto">
        <div>
          <Link href="/wz/start">Create your website</Link>
        </div>
      </div>
    </Layout>
  );
};
export default DZLandingPage;
