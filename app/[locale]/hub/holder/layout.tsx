import "../../../globals.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return <div className="w-full h-full lg:pl-[80px]">{children}</div>;
}
