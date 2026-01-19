import os
import json
from PIL import Image

# --- PATH CONFIGURATION ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR) 

# Inputs
DATA_FILE = os.path.join(PROJECT_ROOT, 'src', 'data', 'imageData.json')
SOURCE_DIR = os.path.join(PROJECT_ROOT, '_raw_images', 'portfolio')

# Output
DEST_DIR = os.path.join(PROJECT_ROOT, 'public', 'slides')

# Settings
MAX_WIDTH = 1920
MAX_HEIGHT = 1080
QUALITY = 85
TARGET_RATIO = 16 / 9
TOLERANCE = 0.10  # 10% tolerance
# ---------------------

def optimize_images():
    print(f"🚀  Running Optimizer from: {SCRIPT_DIR}")
    
    if not os.path.exists(DEST_DIR):
        os.makedirs(DEST_DIR)
        print(f"✅  Created output folder: {DEST_DIR}")

    if not os.path.exists(DATA_FILE):
        print(f"❌  Error: Could not find {DATA_FILE}")
        return

    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌  JSON Load Error: {e}")
        return

    processed_count = 0
    skipped_count = 0
    cropped_count = 0
    
    print(f"🔍  Scanning {len(data)} records...")

    for item in data:
        filename = item.get('url')
        display_status = item.get('display', 'hide')

        if display_status == 'hide':
            continue

        source_path = os.path.join(SOURCE_DIR, filename)
        dest_path = os.path.join(DEST_DIR, filename)

        if not os.path.exists(source_path):
            print(f"⚠️  Source missing: {filename}")
            continue

        # Force regenerate if you want to test the new cropping logic immediately
        # Remove "and os.path.exists(dest_path)" to force overwrite every time
        if os.path.exists(dest_path):
            skipped_count += 1
            continue

        try:
            with Image.open(source_path) as img:
                if img.mode in ("RGBA", "P"): 
                    img = img.convert("RGB")
                
                # --- START "NEAR FIT" CROP LOGIC ---
                w, h = img.size
                current_ratio = w / h
                
                # Calculate deviation from 16:9
                # If ratio is 1.77, deviation is 0. 
                # If ratio is 1.6 or 1.9, it might be within 10%
                deviation = abs(current_ratio - TARGET_RATIO) / TARGET_RATIO
                
                if deviation <= TOLERANCE:
                    # It is close enough! Let's crop to exact 16:9
                    
                    if current_ratio > TARGET_RATIO:
                        # Image is too WIDE (Panorama-ish). Crop sides.
                        # Target Width = Height * 1.777
                        new_w = int(h * TARGET_RATIO)
                        offset = (w - new_w) // 2
                        # Crop box: (left, top, right, bottom)
                        img = img.crop((offset, 0, offset + new_w, h))
                        print(f"✂️  Cropping Width: {filename} (was {current_ratio:.2f})")
                        
                    elif current_ratio < TARGET_RATIO:
                        # Image is too TALL (Square-ish). Crop top/bottom.
                        # Target Height = Width / 1.777
                        new_h = int(w / TARGET_RATIO)
                        offset = (h - new_h) // 2
                        img = img.crop((0, offset, w, offset + new_h))
                        print(f"✂️  Cropping Height: {filename} (was {current_ratio:.2f})")
                    
                    cropped_count += 1
                    
                    # After cropping, we can force resize to exactly 1920x1080
                    img = img.resize((MAX_WIDTH, MAX_HEIGHT), Image.Resampling.LANCZOS)
                
                else:
                    # Not close enough (likely a vertical portrait). 
                    # Just fit inside the box without cutting anything.
                    print(f"   Fitting (No Crop): {filename} (Ratio {current_ratio:.2f})")
                    img.thumbnail((MAX_WIDTH, MAX_HEIGHT), Image.Resampling.LANCZOS)
                # --- END CROP LOGIC ---
                
                img.save(dest_path, "JPEG", quality=QUALITY, optimize=True)
                processed_count += 1

        except Exception as e:
            print(f"❌  Error processing {filename}: {e}")

    print(f"\n---------------------------------------")
    print(f"✅  Optimization Complete")
    print(f"---------------------------------------")
    print(f"   Generated: {processed_count}")
    print(f"   (Cropped): {cropped_count} near-match images")
    print(f"   Cached:    {skipped_count}")
    print(f"   Output:    {DEST_DIR}")

if __name__ == "__main__":
    optimize_images()