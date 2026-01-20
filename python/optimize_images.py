import os
import json
from PIL import Image, ImageOps

# --- PATH CONFIGURATION ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR) 

DATA_FILE = os.path.join(PROJECT_ROOT, 'src', 'data', 'imageData.json')
SOURCE_DIR = os.path.join(PROJECT_ROOT, '_raw_images', 'portfolio')
DEST_DIR = os.path.join(PROJECT_ROOT, 'public', 'slides')

# Settings
MAX_WIDTH = 1920
MAX_HEIGHT = 1080
QUALITY = 85
TARGET_RATIO = 16 / 9
TOLERANCE = 0.10
FORCE_UPDATE = True  # <--- SET THIS TO TRUE to overwrite existing files
# ---------------------

def optimize_images():
    print(f"🚀  Running Optimizer from: {SCRIPT_DIR}")
    print(f"    Force Update Mode: {FORCE_UPDATE}")
    
    if not os.path.exists(DEST_DIR):
        os.makedirs(DEST_DIR)

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

        # CACHE CHECK: Only skip if file exists AND we aren't forcing an update
        if not FORCE_UPDATE and os.path.exists(dest_path):
            skipped_count += 1
            continue

        try:
            with Image.open(source_path) as img:
                img = ImageOps.exif_transpose(img)
                if img.mode in ("RGBA", "P"): 
                    img = img.convert("RGB")
                
                w, h = img.size
                current_ratio = w / h
                deviation = abs(current_ratio - TARGET_RATIO) / TARGET_RATIO
                
                # --- STRATEGY 1: IMMERSIVE CROP (Landscapes only) ---
                if (w > h) and (deviation <= TOLERANCE):
                    if current_ratio > TARGET_RATIO:
                        new_w = int(h * TARGET_RATIO)
                        offset = (w - new_w) // 2
                        img = img.crop((offset, 0, offset + new_w, h))
                    else:
                        new_h = int(w / TARGET_RATIO)
                        offset = (h - new_h) // 2
                        img = img.crop((0, offset, w, offset + new_h))
                    
                    img = img.resize((MAX_WIDTH, MAX_HEIGHT), Image.Resampling.LANCZOS)
                    print(f"✂️  Landscape Crop: {filename}")

                # --- STRATEGY 2: PILLARBOX (Portraits / Others) ---
                else:
                    img.thumbnail((MAX_WIDTH, MAX_HEIGHT), Image.Resampling.LANCZOS)
                    background = Image.new('RGB', (MAX_WIDTH, MAX_HEIGHT), (0, 0, 0))
                    
                    bg_w, bg_h = background.size
                    img_w, img_h = img.size
                    offset = ((bg_w - img_w) // 2, (bg_h - img_h) // 2)
                    
                    background.paste(img, offset)
                    img = background
                    print(f"🔳 Black Bars Added: {filename}")

                img.save(dest_path, "JPEG", quality=QUALITY, optimize=True)
                processed_count += 1

        except Exception as e:
            print(f"❌  Error processing {filename}: {e}")

    print(f"\n✅  Done! Generated: {processed_count} | Cached: {skipped_count}")

if __name__ == "__main__":
    optimize_images()