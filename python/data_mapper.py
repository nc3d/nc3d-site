import os
import csv
import json
import re

# --- CONFIGURATION ---
IMAGE_FOLDER = r'G:\Shared drives\NC3D Portfolio\Published_to_NC3D'
CSV_PATH = r'D:\Projects\nc3d-website\python\Jobs-Job List.csv'
OUTPUT_JSON = 'portfolio_data.json'
IMAGE_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.webp')

def normalize_code(code_str):
    """Converts '315_015' or '315-015' to '315-15' by removing leading zeros."""
    parts = re.split(r'[_-]', code_str)
    # Remove leading zeros from each numeric part (e.g., '015' -> '15')
    normalized_parts = [p.lstrip('0') if p.lstrip('0') else '0' for p in parts]
    return "-".join(normalized_parts[:2]) if len(normalized_parts) >= 2 else normalized_parts[0]

def generate_portfolio_json():
    job_lookup = {}
    
    # 1. Load CSV data
    try:
        with open(CSV_PATH, mode='r', encoding='utf-8-sig') as f:
            # Using delimiter=',' but you can change to ';' if your CSV uses that
            reader = csv.DictReader(f)
            for row in reader:
                raw_code = row.get('Job_Code', '').strip()
                if raw_code:
                    job_lookup[raw_code] = {
                        'Full_Name': row.get('Full_Name', '').strip(),
                        'PriCompany': row.get('PriCompany', '').strip(),
                        'Tags': row.get('Tags', '').strip()
                    }
    except FileNotFoundError:
        print(f"Error: CSV file not found at {CSV_PATH}")
        return

    portfolio_list = []

    # 2. Scan Folder
    if not os.path.exists(IMAGE_FOLDER):
        print(f"Error: Image folder not found at {IMAGE_FOLDER}")
        return

    for filename in os.listdir(IMAGE_FOLDER):
        if filename.lower().endswith(IMAGE_EXTENSIONS):
            
            match_data = None
            parts = filename.split('_')
            
            # --- STRATEGY 1: Normalize 315_015 -> 315-15 ---
            if len(parts) >= 2:
                potential_code = f"{parts[0]}-{parts[1].lstrip('0')}"
                if potential_code in job_lookup:
                    match_data = job_lookup[potential_code]

            # --- STRATEGY 2: Try Direct Substitution 315_015 -> 315-015 ---
            if not match_data and len(parts) >= 2:
                direct_swap = f"{parts[0]}-{parts[1]}"
                if direct_swap in job_lookup:
                    match_data = job_lookup[direct_swap]

            # --- STRATEGY 3: Match by base code (e.g., 315) ---
            if not match_data:
                base_code = parts[0]
                # Find the first job code in CSV that starts with this base code
                for csv_code in job_lookup:
                    if csv_code.startswith(base_code):
                        match_data = job_lookup[csv_code]
                        break

            # --- 3. Construct JSON Object ---
            if match_data:
                tag_list = [t.strip() for t in match_data['Tags'].replace(';', ',').split(',') if t.strip()]
                
                # Format caption: "Full Name: Company"
                full_name = match_data['Full_Name']
                company = match_data['PriCompany']
                caption_str = f"{full_name}: {company}" if full_name and company else (full_name or company)
                
                entry = {
                    "url": filename,
                    "caption": caption_str,
                    "tags": tag_list,
                    "display": "portfolio"
                }
            else:
                entry = {
                    "url": filename,
                    "caption": "",
                    "tags": [],
                    "display": "portfolio"
                }
                print(f"Notice: No data found for {filename}.")

            portfolio_list.append(entry)

    # 4. Save Output
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(portfolio_list, f, indent=4)

    print(f"\nSuccess! Processed {len(portfolio_list)} images.")

if __name__ == "__main__":
    generate_portfolio_json()