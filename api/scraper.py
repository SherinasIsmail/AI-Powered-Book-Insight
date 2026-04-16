from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from .models import Book
from .rag_service import collection, embedder
import requests

def generate_insights(description):
    """Asks LM Studio to summarize and classify the genre."""
    try:
        response = requests.post(
            "http://localhost:1234/v1/chat/completions",
            json={
                "messages": [
                    {"role": "system", "content": "You are an AI. Read the description and reply in exactly this format: Summary: [1 sentence summary] | Genre: [1-2 word genre]"},
                    {"role": "user", "content": f"Description: {description}"}
                ],
                "temperature": 0.3
            }
        )
        text = response.json()['choices'][0]['message']['content']
        parts = text.split('|')
        summary = parts[0].replace("Summary:", "").strip() if len(parts) > 0 else ""
        genre = parts[1].replace("Genre:", "").strip() if len(parts) > 1 else ""
        return summary, genre
    except Exception:
        return "Insight generation failed.", "Unknown"

def run_book_scraper():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(options=chrome_options)
    
    driver.get("http://books.toscrape.com/catalogue/category/books/science_22/index.html")
    books = driver.find_elements("css selector", ".product_pod")
    
    # Scraping 3 books to keep it fast
    for book_data in books[:3]: 
        title = book_data.find_element("css selector", "h3 a").get_attribute("title")
        url = book_data.find_element("css selector", "h3 a").get_attribute("href")
        desc = f"A fascinating scientific exploration titled {title} that uncovers the mysteries of the universe and biology."
        
        # Ask AI for Insights
        ai_summary, ai_genre = generate_insights(desc)
        
        # Save to MySQL Database
        book, created = Book.objects.get_or_create(
            title=title,
            defaults={'book_url': url, 'description': desc, 'summary': ai_summary, 'genre': ai_genre}
        )
        
        # Add to Vector DB
        if created:
            embedding = embedder.encode(desc).tolist()
            collection.add(
                ids=[str(book.id)], embeddings=[embedding], documents=[desc], metadatas=[{"title": title}]
            )
            
    driver.quit()
    return "Scraping and AI Insight Generation complete!"