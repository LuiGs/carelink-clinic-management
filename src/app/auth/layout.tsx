/**
 * Layout para las páginas de autenticación
 * No necesita un provider adicional porque el RootLayout ya lo incluye
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
