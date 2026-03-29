import ResultsListClient from "@/components/results/ResultsListClient.jsx";

export const metadata = {
  title: "Exam Results",
  description: "Review completed exam sessions and performance metrics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResultsPage() {
  return <ResultsListClient />;
}
