import kagglehub
import shutil
import os
import pandas as pd

# List of datasets to download
datasets = [
    "asaniczka/data-analyst-job-postings",
    "asaniczka/linkedin-data-engineer-job-postings",
    "asaniczka/data-scientist-linkedin-job-postings",
    "asaniczka/software-engineer-job-postings-linkedin"
]

# Move to data folder dynamically
script_dir = os.path.dirname(__file__)
project_dir = os.path.dirname(script_dir)
data_dir = os.path.join(project_dir, 'data')

# Ensure data directory exists
os.makedirs(data_dir, exist_ok=True)

# List to hold dataframes
dfs = []

for dataset in datasets:
    # Download latest version
    path = kagglehub.dataset_download(dataset)
    print(f"Path to dataset files for {dataset}:", path)

    # Find CSV files in the downloaded path
    for item in os.listdir(path):
        if item.endswith('.csv'):
            csv_path = os.path.join(path, item)
            df = pd.read_csv(csv_path)
            dfs.append(df)
            print(f"Loaded {item} from {dataset}")

    # Remove the original downloaded files
    shutil.rmtree(path)
    print(f"Original files for {dataset} removed from:", path)

# Merge all dataframes
if dfs:
    merged_df = pd.concat(dfs, ignore_index=True)
    output_path = os.path.join(data_dir, 'jobs.csv')
    merged_df.to_csv(output_path, index=False)
    print("All datasets downloaded and merged successfully.")
else:
    print("No CSV files found.")
