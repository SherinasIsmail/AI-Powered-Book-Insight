"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BookDetail() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/books/${params.id}/`)
      .then((res) => res.json())
      .then((data) => setBook(data));
  }, [params.id]);

  if (!book) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <button onClick={() => router.push('/')} className="mb-6 text-indigo-600 hover:underline">
        ← Back to Dashboard
      </button>
      
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{book.description}</p>
          </div>
          
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h2 className="text-xl font-semibold mb-3 text-indigo-900">✨ AI Insights</h2>
            <div className="mb-4">
              <span className="font-bold text-indigo-800">Genre: </span>
              <span className="bg-indigo-200 text-indigo-800 px-2 py-1 rounded text-sm">{book.genre || "Generating..."}</span>
            </div>
            <div>
              <span className="font-bold text-indigo-800">AI Summary: </span>
              <p className="text-indigo-900 mt-1">{book.summary || "Not available."}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
          <a href={book.book_url} target="_blank" rel="noreferrer" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
            View Source Website
          </a>
        </div>
      </div>
    </div>
  );
}