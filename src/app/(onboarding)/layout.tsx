export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] w-full bg-muted/30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {children}
    </div>
  );
}
