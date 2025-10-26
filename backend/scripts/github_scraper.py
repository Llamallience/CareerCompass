import requests
from typing import Dict, List, Optional
from datetime import datetime


class GitHubProfileScraper:
    """Scrape GitHub profile information using GitHub API (no auth required for public data)"""
    
    def __init__(self):
        self.base_url = "https://api.github.com"
        self.headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'JobSearch-Backend'
        }
    
    def extract_username_from_url(self, github_url: str) -> Optional[str]:
        """Extract username from GitHub URL"""
        if not github_url:
            return None
        
        # Clean URL
        github_url = github_url.strip().rstrip('/')
        
        # Handle various GitHub URL formats
        if 'github.com/' in github_url:
            parts = github_url.split('github.com/')
            if len(parts) > 1:
                username = parts[1].split('/')[0]
                return username
        
        return None
    
    def get_user_profile(self, username: str) -> Optional[Dict]:
        """Get basic user profile information"""
        try:
            response = requests.get(
                f"{self.base_url}/users/{username}",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            print(f"Error fetching user profile: {e}")
            return None
    
    def get_user_repos(self, username: str, max_repos: int = 30) -> List[Dict]:
        """Get user's public repositories"""
        try:
            response = requests.get(
                f"{self.base_url}/users/{username}/repos",
                headers=self.headers,
                params={
                    'sort': 'updated',
                    'per_page': max_repos,
                    'type': 'owner'
                },
                timeout=10
            )
            
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            print(f"Error fetching repos: {e}")
            return []
    
    def get_user_languages(self, repos: List[Dict]) -> Dict[str, int]:
        """Extract and aggregate programming languages from repos"""
        languages = {}
        
        for repo in repos:
            if repo.get('language'):
                lang = repo['language']
                languages[lang] = languages.get(lang, 0) + 1
        
        return languages
    
    def scrape_profile(self, github_url: str) -> Optional[Dict]:
        """
        Main method to scrape complete GitHub profile
        
        Returns:
            Dict with user info, repos, languages, stats
        """
        username = self.extract_username_from_url(github_url)
        if not username:
            return None
        
        # Get user profile
        profile = self.get_user_profile(username)
        if not profile:
            return None
        
        # Get repositories
        repos = self.get_user_repos(username)
        
        # Analyze languages
        languages = self.get_user_languages(repos)
        
        # Calculate stats
        total_stars = sum(repo.get('stargazers_count', 0) for repo in repos)
        total_forks = sum(repo.get('forks_count', 0) for repo in repos)
        
        # Get top repos by stars
        top_repos = sorted(
            repos,
            key=lambda r: r.get('stargazers_count', 0),
            reverse=True
        )[:5]
        
        # Extract key info
        result = {
            'username': username,
            'name': profile.get('name', username),
            'bio': profile.get('bio', ''),
            'company': profile.get('company', ''),
            'location': profile.get('location', ''),
            'email': profile.get('email', ''),
            'blog': profile.get('blog', ''),
            'twitter_username': profile.get('twitter_username', ''),
            'public_repos': profile.get('public_repos', 0),
            'public_gists': profile.get('public_gists', 0),
            'followers': profile.get('followers', 0),
            'following': profile.get('following', 0),
            'created_at': profile.get('created_at', ''),
            'updated_at': profile.get('updated_at', ''),
            'total_stars_received': total_stars,
            'total_forks_received': total_forks,
            'languages': languages,
            'top_repositories': [
                {
                    'name': repo.get('name'),
                    'description': repo.get('description', ''),
                    'stars': repo.get('stargazers_count', 0),
                    'forks': repo.get('forks_count', 0),
                    'language': repo.get('language', ''),
                    'url': repo.get('html_url', ''),
                    'topics': repo.get('topics', []),
                    'updated_at': repo.get('updated_at', '')
                }
                for repo in top_repos
            ],
            'recent_activity': self._summarize_recent_activity(repos),
        }
        
        return result
    
    def _summarize_recent_activity(self, repos: List[Dict]) -> str:
        """Generate a summary of recent activity"""
        if not repos:
            return "No recent public activity"
        
        # Get repos updated in last 6 months
        recent_repos = []
        now = datetime.now()
        
        for repo in repos:
            try:
                updated = datetime.strptime(
                    repo.get('updated_at', ''), 
                    '%Y-%m-%dT%H:%M:%SZ'
                )
                days_ago = (now - updated).days
                if days_ago <= 180:
                    recent_repos.append((repo.get('name'), days_ago))
            except:
                continue
        
        if recent_repos:
            summary = f"Active on {len(recent_repos)} repositories in the last 6 months. "
            latest = min(recent_repos, key=lambda x: x[1])
            summary += f"Most recently updated: {latest[0]} ({latest[1]} days ago)"
            return summary
        
        return "No activity in the last 6 months"
