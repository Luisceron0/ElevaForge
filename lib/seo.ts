const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://elevaforge.com'

export interface BreadcrumbItem {
  name: string
  path: string
}

/** BreadcrumbList JSON-LD for internal pages (SEO-08). */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

export interface FaqItem {
  question: string
  answer: string
}

/** FAQPage JSON-LD (RF-019). */
export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export { SITE_URL }
