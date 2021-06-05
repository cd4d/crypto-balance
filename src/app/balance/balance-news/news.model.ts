export interface newsElement {
  title: string;
  id: string;
  language?: string;
  url: string;
  description: string;
  snippet: string;
  keywords: string;
  datePublished: string;
  body: string;
  image: {
    url: string;
    title: string;
  };
}
