import { redirect } from "next/navigation";

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/certificate/${encodeURIComponent(id)}`);
}
