import SessionResultClient from "@/components/results/SessionResultClient.jsx";

export const metadata = {
  title: "Session Result",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SessionResultPage({ params }) {
  const { sessionId } = await params;

  return <SessionResultClient sessionId={sessionId} />;
}
