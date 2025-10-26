

import { fetchServerNoteById } from "@/lib/api/serverApi";
import NotePreviewClient from "./NotePreview.client";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";


type NotePreviewProps = {
  params: Promise<{ id: string }>;
};

export default async function NotePreview({ params }: NotePreviewProps) {
  const { id } = await params
  
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchServerNoteById(id),
  });
  const dehydratedState = dehydrate(queryClient);
    return (
    <HydrationBoundary state={dehydratedState}>
      <NotePreviewClient noteId={id} />
    </HydrationBoundary>
  );
}