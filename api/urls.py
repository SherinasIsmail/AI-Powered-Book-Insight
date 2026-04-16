from django.urls import path
from .views import BookListView, ScrapeTriggerView, RAGQueryView, BookDetailView

urlpatterns = [
    path('books/', BookListView.as_view(), name='book-list'),
    path('books/<int:pk>/', BookDetailView.as_view(), name='book-detail'), # <-- New line
    path('scrape/', ScrapeTriggerView.as_view(), name='scrape-trigger'),
    path('query/', RAGQueryView.as_view(), name='rag-query'),
]