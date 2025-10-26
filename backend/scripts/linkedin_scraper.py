import requests
from bs4 import BeautifulSoup
import json
import re
from urllib.parse import urlparse
import time
import random


class LinkedInJobScraper:
    def __init__(self):
        self.session = requests.Session()
        # Advanced headers for LinkedIn
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9,tr;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
            'DNT': '1',
            'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"macOS"'
        })

    def clean_text(self, text):
        """Clean and format text"""
        if not text:
            return ""
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', '', text)
        # Clean extra spaces
        text = re.sub(r'\s+', ' ', text)
        # Remove leading and trailing spaces
        return text.strip()

    def extract_job_details(self, html_content):
        """Extract job posting details from HTML content"""
        soup = BeautifulSoup(html_content, 'html.parser')

        job_data = {
            'title': '',
            'company': '',
            'location': '',
            'description': '',
            'requirements': '',
            'company_description': '',
            'role_description': '',
            'qualifications': []
        }

        try:
            print("🔍 Analyzing HTML structure...")

            # Debug: Check page title
            page_title = soup.find('title')
            if page_title:
                print(f"📄 Page title: {page_title.get_text()}")

            # Debug: Check existing classes
            all_h1 = soup.find_all('h1')
            print(f"🔍 Found H1 tags: {len(all_h1)}")
            for i, h1 in enumerate(all_h1[:3]):
                print(f"  H1-{i+1}: {h1.get_text()[:50]}... (class: {h1.get('class')})")

            # Job title - try different options
            title_selectors = [
                'h1.top-card-layout__title',
                'h1.job-details-jobs-unified-top-card__job-title',
                'h1.jobs-unified-top-card__job-title',
                'h1[data-test-id="job-title"]',
                'h1.job-title',
                'h1'
            ]

            for selector in title_selectors:
                title_element = soup.select_one(selector)
                if title_element and title_element.get_text().strip():
                    job_data['title'] = self.clean_text(title_element.get_text())
                    print(f"✅ Title found: {job_data['title'][:50]}...")
                    break

            # Company name - try different options
            company_selectors = [
                'a.topcard__org-name-link',
                'a.job-details-jobs-unified-top-card__company-name',
                'a.jobs-unified-top-card__company-name',
                'a[data-test-id="company-name"]',
                'a.company-name',
                'span.company-name'
            ]

            for selector in company_selectors:
                company_element = soup.select_one(selector)
                if company_element and company_element.get_text().strip():
                    job_data['company'] = self.clean_text(company_element.get_text())
                    print(f"✅ Company found: {job_data['company']}")
                    break

            # Location - try different options
            location_selectors = [
                'span.topcard__flavor--bullet',
                'span.job-details-jobs-unified-top-card__bullet',
                'span.jobs-unified-top-card__bullet',
                'span[data-test-id="job-location"]',
                'span.job-location',
                'div.job-location'
            ]

            for selector in location_selectors:
                location_element = soup.select_one(selector)
                if location_element and location_element.get_text().strip():
                    job_data['location'] = self.clean_text(location_element.get_text())
                    print(f"✅ Location found: {job_data['location']}")
                    break

            # Job description - try different options
            description_selectors = [
                'div.jobs-description__content',
                'div.job-details-jobs-unified-top-card__job-description',
                'div.jobs-unified-top-card__job-description',
                'div[data-test-id="job-description"]',
                'div.job-description',
                'div.description',
                'div.jobs-box__html-content',
                'div.jobs-description-content__text',
                'div[class*="description"]',
                'div[class*="content"]'
            ]

            print(f"🔍 Searching for description section...")
            for selector in description_selectors:
                description_section = soup.select_one(selector)
                if description_section:
                    print(f"✅ Description section found: {selector}")
                    # Get all text
                    job_data['description'] = self.clean_text(description_section.get_text())
                    print(f"📝 Description length: {len(job_data['description'])} characters")

                    # Company description
                    company_desc_match = re.search(r'Company Description(.*?)Role Description', description_section.get_text(), re.DOTALL)
                    if company_desc_match:
                        job_data['company_description'] = self.clean_text(company_desc_match.group(1))
                        print("✅ Company description found")

                    # Role description
                    role_desc_match = re.search(r'Role Description(.*?)Qualifications', description_section.get_text(), re.DOTALL)
                    if role_desc_match:
                        job_data['role_description'] = self.clean_text(role_desc_match.group(1))
                        print("✅ Role description found")

                    # Qualifications - try different formats
                    qualifications_text = description_section.get_text()

                    # Search for different qualification formats
                    qualifications_patterns = [
                        r'Genel Nitelikler:(.*?)(?=İş Tanımı:|$)',
                        r'Qualifications:(.*?)(?=Job Description:|$)',
                        r'Nitelikler:(.*?)(?=İş Tanımı:|$)',
                        r'Requirements:(.*?)(?=Job Description:|$)',
                        r'Gereksinimler:(.*?)(?=İş Tanımı:|$)'
                    ]

                    qualifications_found = False
                    for pattern in qualifications_patterns:
                        qualifications_match = re.search(pattern, qualifications_text, re.DOTALL | re.IGNORECASE)
                        if qualifications_match:
                            qualifications_text = qualifications_match.group(1)
                            print(f"✅ Qualifications section found: {pattern}")
                            qualifications_found = True
                            break

                    if qualifications_found:
                        # Find list items - different formats
                        qualifications_list = []

                        # Bullet list formats
                        bullet_patterns = [
                            r'•\s*(.*?)(?=\n|$)',
                            r'-\s*(.*?)(?=\n|$)',
                            r'\*\s*(.*?)(?=\n|$)',
                            r'^\s*\d+\.\s*(.*?)(?=\n|$)',
                            r'^\s*[a-zA-Z]\.\s*(.*?)(?=\n|$)'
                        ]

                        for pattern in bullet_patterns:
                            matches = re.findall(pattern, qualifications_text, re.MULTILINE)
                            if matches:
                                qualifications_list.extend(matches)
                                print(f"✅ {len(matches)} bullets found: {pattern}")

                        # Find HTML list items
                        if not qualifications_list:
                            list_items = description_section.find_all('li')
                            qualifications_list = [self.clean_text(item.get_text()) for item in list_items]
                            print(f"✅ {len(qualifications_list)} HTML list items found")

                        # Line-based parsing
                        if not qualifications_list:
                            lines = qualifications_text.split('\n')
                            for line in lines:
                                line = line.strip()
                                if len(line) > 20 and not line.startswith(('İş Tanımı', 'Job Description', 'Show more', 'Show less')):
                                    qualifications_list.append(line)
                            print(f"✅ {len(qualifications_list)} line-based qualifications found")

                        # Clean and filter
                        job_data['qualifications'] = []
                        for q in qualifications_list:
                            q = self.clean_text(q)
                            if q and len(q) > 10 and not q.startswith(('İş Tanımı', 'Job Description', 'Show more', 'Show less')):
                                job_data['qualifications'].append(q)

                        print(f"✅ {len(job_data['qualifications'])} qualifications processed")
                    else:
                        print("❌ Qualifications section not found")
                    break
                else:
                    print(f"❌ {selector} not found")

            # If no description found, check all divs
            if not job_data['description']:
                print("🔍 Performing alternative search...")
                all_divs = soup.find_all('div', class_=lambda x: x and ('description' in x.lower() or 'content' in x.lower()))
                print(f"📊 Found {len(all_divs)} divs that may contain description")

                for i, div in enumerate(all_divs[:5]):  # Check first 5 divs
                    text_content = self.clean_text(div.get_text())
                    if len(text_content) > 100:  # Sufficiently long content
                        print(f"📝 Div-{i+1}: {text_content[:100]}... (class: {div.get('class')})")
                        if not job_data['description']:  # Take first long content
                            job_data['description'] = text_content
                            print(f"✅ Description found: {len(text_content)} characters")

            # Additional information
            job_data['requirements'] = job_data['qualifications']  # Qualifications can also be used as requirements

            # Debug: Summarize extracted data
            print(f"\n📊 Extracted data:")
            print(f"  Title: {'✅' if job_data['title'] else '❌'}")
            print(f"  Company: {'✅' if job_data['company'] else '❌'}")
            print(f"  Location: {'✅' if job_data['location'] else '❌'}")
            print(f"  Description: {'✅' if job_data['description'] else '❌'}")
            print(f"  Qualifications: {'✅' if job_data['qualifications'] else '❌'}")

        except Exception as e:
            print(f"❌ Detail extraction error: {e}")

        return job_data

    def scrape_job(self, job_link):
        """Scrape LinkedIn job posting"""
        try:
            print(f"Scraping job posting: {job_link}")

            # Longer random wait (for rate limiting)
            wait_time = random.uniform(3, 7)
            print(f"⏳ Waiting {wait_time:.1f} seconds...")
            time.sleep(wait_time)

            # First go to LinkedIn homepage (to create session)
            print("🔗 Connecting to LinkedIn homepage...")
            try:
                self.session.get('https://www.linkedin.com/', timeout=15)
                time.sleep(random.uniform(2, 4))
            except:
                print("⚠️ Homepage connection failed, continuing...")

            # Load job posting page
            print("📄 Loading job posting page...")
            response = self.session.get(job_link, timeout=45)
            response.raise_for_status()

            print(f"✅ Page loaded (Status: {response.status_code})")
            print(f"📊 Content size: {len(response.text)} characters")

            # Parse HTML content
            job_data = self.extract_job_details(response.text)

            # Add additional info from URL
            job_data['url'] = job_link
            job_data['scraped_at'] = time.strftime('%Y-%m-%d %H:%M:%S')

            return job_data

        except requests.exceptions.Timeout as e:
            print(f"⏰ Timeout error: {e}")
            print("💡 LinkedIn is responding slowly, longer wait may be needed")
            return None
        except requests.exceptions.RequestException as e:
            print(f"🌐 HTTP error: {e}")
            print("💡 LinkedIn access may be blocked")
            return None
        except Exception as e:
            print(f"❌ General error: {e}")
            return None

    def save_to_json(self, job_data, filename=None):
        """Save job posting data to JSON file"""
        if not filename:
            # Create filename from job title
            safe_title = re.sub(r'[^\w\s-]', '', job_data.get('title', 'job')).strip()
            safe_title = re.sub(r'[-\s]+', '_', safe_title)
            filename = f"{safe_title[:50]}.json"

        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(job_data, f, ensure_ascii=False, indent=2)
            print(f"Data successfully saved: {filename}")
            return filename
        except Exception as e:
            print(f"JSON save error: {e}")
            return None


def main():
    # LinkedIn job posting link
    job_link = "https://www.linkedin.com/jobs/view/1234567890"  # Real link will go here

    # Start scraper
    scraper = LinkedInJobScraper()

    # Scrape job posting
    job_data = scraper.scrape_job(job_link)

    if job_data:
        print("\n=== JOB POSTING INFORMATION ===")
        print(f"Title: {job_data.get('title', 'N/A')}")
        print(f"Company: {job_data.get('company', 'N/A')}")
        print(f"Location: {job_data.get('location', 'N/A')}")
        print(f"URL: {job_data.get('url', 'N/A')}")
        print(f"Scrape Date: {job_data.get('scraped_at', 'N/A')}")

        if job_data.get('company_description'):
            print(f"\nCompany Description: {job_data['company_description'][:200]}...")

        if job_data.get('role_description'):
            print(f"\nRole Description: {job_data['role_description'][:200]}...")

        if job_data.get('qualifications'):
            print(f"\nQualifications ({len(job_data['qualifications'])} items):")
            for i, qual in enumerate(job_data['qualifications'][:5], 1):
                print(f"{i}. {qual}")

        # Save to JSON file
        filename = scraper.save_to_json(job_data)
        if filename:
            print(f"\nData saved to {filename} file.")
    else:
        print("Job posting information could not be retrieved.")


if __name__ == "__main__":
    main()