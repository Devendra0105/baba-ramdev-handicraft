import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Layout title="Page not found">
      <div className="container-wide py-32 text-center">
        <p className="eyebrow">404</p>
        <h1 className="heading-lg mt-4">This path leads nowhere.</h1>
        <Button asChild className="mt-8"><Link to="/">Return Home</Link></Button>
      </div>
    </Layout>
  );
}
