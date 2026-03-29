import Spinner from "@/components/ui/Spinner";

export default function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <div className="text-[0.88rem] font-semibold text-text-secondary">
          Loading page...
        </div>
      </div>
    </div>
  );
}
