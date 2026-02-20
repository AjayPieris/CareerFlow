export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
      {children}
    </div>
  );
}
