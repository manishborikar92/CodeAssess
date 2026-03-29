import JoinTokenForm from "@/components/exam/JoinTokenForm.jsx";

export const metadata = {
  title: "Join Exam",
  description: "Enter your invitation token to access the exam session.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function JoinPage() {
  return <JoinTokenForm />;
}
