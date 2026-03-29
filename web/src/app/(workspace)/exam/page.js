import ExamStartPageClient from "@/components/exam/ExamStartPageClient.jsx";

export const metadata = {
  title: "Exam Lobby",
  description:
    "Start a secure exam attempt or resume the latest active session saved on this device.",
};

export default function ExamIndexPage() {
  return <ExamStartPageClient />;
}
