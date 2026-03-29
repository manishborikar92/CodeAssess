import JoinTokenForm from "@/components/exam/JoinTokenForm.jsx";

export const metadata = {
  title: "Join Exam",
  robots: {
    index: false,
    follow: false,
  },
};

export default function JoinPage() {
  return <JoinTokenForm />;
}
