import CVEditClient from "@/app/components/cvedit/CVEditClient";

export const metadata = {
  title: 'CV Editor',
  description: 'Edit your CV online',
};

export default async function CVEditPage() {
  return <CVEditClient />;
} 