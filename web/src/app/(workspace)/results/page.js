import ResultsListClient from "@/components/results/ResultsListClient.jsx";

export const metadata = {
  title: "Exam Results",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResultsPage() {
  return <ResultsListClient />;
}
