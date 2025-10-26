"use client";
import { useState } from "react";
import css from "./NotesPage.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";


import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchNotes, Tag } from "@/lib/api/clientApi";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";

type Props = {
   tag?: Tag;
  initialSearch?: string;
};

export default function NotesClient({ tag, initialSearch = "" }: Props) {
  const router = useRouter();
  const [curPage, setCurPage] = useState(1);
  
  const [search, setSearch] = useState(initialSearch);

  const normalizedTag = tag;
  
  

  const { data: notes } = useQuery({
    queryKey: ["notes", search, curPage, normalizedTag],
    queryFn: () => fetchNotes(search, curPage, normalizedTag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setCurPage(1);
    const urlTag = normalizedTag ?? "all";
    router.push(`/notes/filter/${urlTag}/${value}`);
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} value={search} />
        {notes && notes.totalPages > 1 && (
          <Pagination
            curPage={curPage}
            totalPages={notes?.totalPages ?? 0}
            setCurrentPage={setCurPage}
          />
        )}
        <Link className={css.button} href={"/notes/action/create"}>
            Create note +
          </Link>
        
      </header>

      <main>
        {notes && notes.notes.length > 0 && <NoteList notes={notes.notes} />}
      </main>
    </div>
  );
}