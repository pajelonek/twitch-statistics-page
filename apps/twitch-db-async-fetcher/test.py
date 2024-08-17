from bs4 import BeautifulSoup 
import cloudscraper 
 
url = "https://kick.com/stream/livestreams/pl?limit=31&subcategory=&sort=desc&strict=true" 
scraper = cloudscraper.create_scraper() 
info = scraper.get(url) 
 
print(info.status_code)