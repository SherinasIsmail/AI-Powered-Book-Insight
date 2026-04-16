"use client";
import { useState, useEffect } from "react";

export default function BookIntelligenceApp() {
  const [books, setBooks] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch books from Django backend
  useEffect(() => {
    fetch("http://localhost:8000/api/books/")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  // Handle RAG AI Query
  const handleQuery = async () => {
    if (!question) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/query/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer("Error connecting to backend. Make sure Django and LM Studio are running.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-indigo-700 tracking-tight">Ergosphere Document Intelligence</h1>
        <p className="text-gray-500 mt-2 text-lg">AI-Powered Book Insights Platform</p>
      </header>

      {/* Q&A SECTION */}
      <section className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-12">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Ask the AI about your Library</h2>
        <div className="flex gap-3">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50"
            placeholder="e.g., Which book is about physics?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            onClick={handleQuery}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-semibold shadow-sm disabled:bg-indigo-300"
            disabled={loading}
          >
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </div>
        {answer && (
          <div className="mt-6 p-5 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl text-gray-800">
            <p className="font-bold text-indigo-900 mb-1 flex items-center gap-2">
              ✨ AI Insight
            </p>
            <p className="leading-relaxed">{answer}</p>
          </div>
        )}
      </section>

      {/* BOOK LISTING SECTION */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Library Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col h-full">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{book.title}</h3>
              <p className="text-sm text-gray-500 mb-4 flex-grow">{book.description}</p>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                <span className="bg-indigo-50 text-indigo-700 font-medium px-3 py-1 rounded-full text-xs">
                  {book.rating || "No Rating"}
                </span>
                <a href={`/book/${book.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition">
                   View Details →
                </a>
              </div>
            </div>
          ))}
          {books.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-12 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-lg mb-2">No books found in the database.</p>
              <p className="text-sm">Make sure you ran the backend scraper!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}