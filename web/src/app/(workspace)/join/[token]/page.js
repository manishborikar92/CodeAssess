import JoinTokenResolver from "@/components/exam/JoinTokenResolver.jsx";

export const metadata = {
  title: "Joining Exam",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function JoinTokenPage({ params }) {
  const { token } = await params;

  return <JoinTokenResolver token={token} />;
}
