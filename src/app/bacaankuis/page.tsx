import { ReadingCatalog } from "@/src/components/bacaankuis/ReadingCatalog";
import { mockArticles } from "@/src/lib/mock/bacaankuis";

export default function BacaanKuisPage() {
  return <ReadingCatalog articles={mockArticles} />;
}
