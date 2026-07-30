import type { Metadata } from 'next'

interface Props {
  params: Promise<{ nombre: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { nombre } = await params
  return {
    alternates: {
      canonical: `/perfil/${nombre}`,
    },
  }
}

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  return children
}
