
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { Metadata } from "next";
import { Tag } from "@/lib/api/clientApi";
import { fetchServerNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({params}:Props): Promise<Metadata>{
  const { slug } = await params;
  const [tag] = slug;
  const normalizedTag: Tag | undefined = tag === "all" ? undefined : tag as Tag;
  const title = normalizedTag === undefined ? "Усі нотатки" : `NoteHub - ${normalizedTag}`
  const description = normalizedTag === undefined ? "Перегляд усіх нотаток" : `Перегляд нотаток - ${normalizedTag}`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `http://localhost:3000/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub Open Graph Image",
        },
      ],
    }
  }
}




export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const [tag, searchValue] = slug;
  const normalizedTag: Tag | undefined = tag === "all" ? undefined : tag as Tag;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", searchValue, 1, normalizedTag],
    queryFn: () => fetchServerNotes(searchValue ?? "", 1, normalizedTag),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient tag={normalizedTag} initialSearch={searchValue} />
    </HydrationBoundary>
  );
}