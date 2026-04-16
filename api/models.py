from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, null=True, blank=True)
    rating = models.CharField(max_length=50, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    book_url = models.URLField(max_length=500)
    
    # AI Mandatory Insights [cite: 37]
    summary = models.TextField(null=True, blank=True)
    genre = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.title