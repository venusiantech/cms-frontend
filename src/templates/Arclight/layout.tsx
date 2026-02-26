import './styles/tailwind.css'
import { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import ThemeProvider from './theme-provider'
import { ApplicationLayout } from './application-layout'
import { AsideProvider } from './components/aside/aside'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    template: '%s - Ncmaz',
    default: 'Ncmaz - Blog, News, Magazine template',
  },
  description: 'Ncmaz - Blog, News, Magazine template',
  keywords: ['Ncmaz', 'Blog', 'News', 'Magazine'],
}

/** Inner layout: providers + ApplicationLayout. Use when embedding Arclight inside another app (no html/body). */
export function ArclightInnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AsideProvider>
        <ApplicationLayout>{children}</ApplicationLayout>
      </AsideProvider>
    </ThemeProvider>
  )
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en" className={beVietnamPro.className}>
      <body className="bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
        <ArclightInnerLayout>{children}</ArclightInnerLayout>
      </body>
    </html>
  )
}

export default Layout
