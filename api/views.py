from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer
from .scraper import run_book_scraper
from .rag_service import get_ai_answer  # We will create this next

class BookListView(APIView):
    # Requirement: Lists all uploaded books [cite: 18]
    def get(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

class ScrapeTriggerView(APIView):
    # Requirement: Uploading and processing books [cite: 22]
    def post(self, request):
        message = run_book_scraper()
        return Response({"message": message})

class RAGQueryView(APIView):
    # Requirement: Asking questions about books (RAG query endpoint) [cite: 23]
    def post(self, request):
        question = request.data.get('question')
        answer = get_ai_answer(question)
        return Response({"answer": answer})
    
class BookDetailView(APIView):
    # Requirement: Retrieves all detail about each book
    def get(self, request, pk):
        try:
            book = Book.objects.get(pk=pk)
            serializer = BookSerializer(book)
            return Response(serializer.data)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=404)