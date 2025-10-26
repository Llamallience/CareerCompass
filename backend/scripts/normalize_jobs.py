import pandas as pd
import json
import os

# File paths
data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
jobs_csv_path = os.path.join(data_dir, 'jobs.csv')
schema_json_path = os.path.join(data_dir, 'schema.json')

# Read jobs.csv
print("Reading jobs.csv...")
df = pd.read_csv(jobs_csv_path)
print(f"Total number of rows: {len(df)}")

# Rename 'job level' to 'job_level'
df.rename(columns={'job level': 'job_level'}, inplace=True)

# Create job_category column if it doesn't exist
if 'job_category' not in df.columns:
    print("job_category column not found, extracting from job_title...")
    # Simple mapping: categorize based on keywords in job_title
    def categorize_job(title):
        title_lower = str(title).lower()
        if 'data analyst' in title_lower or 'data analysis' in title_lower:
            return 'data_analyst'
        elif 'software engineer' in title_lower or 'software development' in title_lower:
            return 'software_engineer'
        elif 'data engineer' in title_lower or 'data engineering' in title_lower:
            return 'data_engineer'
        elif 'data scientist' in title_lower or 'data science' in title_lower:
            return 'data_scientist'
        else:
            return 'other'  # For others

    df['job_category'] = df['job_title'].apply(categorize_job)
    print("job_category column added.")
else:
    print("job_category column exists, normalizing...")
    # Normalize: standardize existing values
    mapping = {
        # Example mapping, can be expanded by user
        'data analyst': 'data_analyst',
        'data_analyst': 'data_analyst',
        'software engineer': 'software_engineer',
        'software_engineer': 'software_engineer',
        'data engineer': 'data_engineer',
        'data_engineer': 'data_engineer',
        'data scientist': 'data_scientist',
        'data_scientist': 'data_scientist',
        # Other variations can be added
    }
    df['job_category'] = df['job_category'].str.lower().map(mapping).fillna(df['job_category'])

# Save the normalized CSV
normalized_csv_path = os.path.join(data_dir, 'jobs.csv')
df.to_csv(normalized_csv_path, index=False)
print(f"Normalized CSV saved: {normalized_csv_path}")

# Extract categorical field options for schema.json
# Read existing schema.json or create new one
if os.path.exists(schema_json_path):
    with open(schema_json_path, 'r') as f:
        schema = json.load(f)
else:
    schema = {}

categorical_fields = ['job_location', 'state', 'search_city', 'search_country', 'job_level', 'job_type', 'job_category']
for field in categorical_fields:
    if field in df.columns:
        values = sorted(df[field].dropna().str.strip().unique().tolist())
        schema[field] = values
        print(f"{field} options: {values}")
    else:
        print(f"{field} column not found in CSV.")

# Save schema.json
with open(schema_json_path, 'w') as f:
    json.dump(schema, f, indent=2)

print(f"Schema.json updated: {schema_json_path}")
print("Process completed.")