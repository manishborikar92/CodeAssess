import ExamSessionClient from "@/components/exam/ExamSessionClient.jsx";

export const metadata = {
  title: "Secure Exam Session",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ExamSessionPage({ params }) {
  const { sessionId } = await params;

  return <ExamSessionClient sessionId={sessionId} />;
}
