import json
import os
import re
import ast

# Paths
INPUT_FILE = os.path.join('src', 'data', 'imageData.ts')
OUTPUT_FILE = os.path.join('src', 'data', 'imageData.json')

def clean_and_parse_ts(content):
    print("   ...Cleaning content...")
    
    # 1. Remove Comments
    content = re.sub(r'//.*', '', content)
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)

    # 2. Find the start of the DATA array (look for " = [")
    # This prevents catching "Slide[]" or other type definitions
    match = re.search(r'=\s*\[', content)
    if not match:
        raise ValueError("Could not find the data assignment ' = ['")
    
    # The match.end() gives us the position after '[', so subtract 1 to include it
    start_index = match.end() - 1
    
    # 3. Find the end of the array (last ']')
    end_index = content.rfind(']')
    if end_index == -1:
        raise ValueError("Could not find closing ']' bracket")

    array_str = content[start_index : end_index + 1]

    # 4. Fix Trailing Commas
    array_str = re.sub(r',\s*([\]}])', r'\1', array_str)

    # 5. JS to Python Constants
    array_str = array_str.replace('true', 'True')
    array_str = array_str.replace('false', 'False')
    array_str = array_str.replace('null', 'None')

    # 6. Parse
    try:
        return ast.literal_eval(array_str)
    except Exception as e:
        print(f"   !!! Snippet causing error: {array_str[:50]}...")
        raise e

def convert():
    print(f"Reading {INPUT_FILE}...")
    
    if not os.path.exists(INPUT_FILE):
        print(f"❌ Error: File not found at {INPUT_FILE}")
        return

    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        raw_content = f.read()

    try:
        data = clean_and_parse_ts(raw_content)
        print(f"✅ Successfully parsed {len(data)} items.")

        print("   ...Adding 'display' fields...")
        for item in data:
            if 'display' not in item:
                item['display'] = 'portfolio'
            if 'tags' not in item or item['tags'] is None:
                item['tags'] = []

        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
            
        print(f"🎉 Success! JSON data saved to: {OUTPUT_FILE}")

    except Exception as e:
        print(f"❌ Critical Failure: {e}")

if __name__ == "__main__":
    convert()