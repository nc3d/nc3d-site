import os
import json
import tkinter as tk
from tkinter import ttk, messagebox
from PIL import Image, ImageTk

# --- PATH CONFIGURATION ---
# 1. Find the directory where this script is running
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# 2. Determine Project Root (Go up one level if we are inside a 'python' folder)
if os.path.basename(SCRIPT_DIR).lower() == 'python':
    PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
else:
    PROJECT_ROOT = SCRIPT_DIR

# 3. Set Paths
# Data stays in src/data
DATA_FILE = os.path.join(PROJECT_ROOT, 'src', 'data', 'imageData.json')

# Images are now in the specific folder you requested
IMAGE_DIR = os.path.join(PROJECT_ROOT, 'images', 'Discipline', 'original')

print(f"DEBUG: Project Root:   {PROJECT_ROOT}")
print(f"DEBUG: Image Folder:   {IMAGE_DIR}")
print(f"DEBUG: Data File:      {DATA_FILE}")
# --------------------------------

class TaggerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("NC3D Image Tagger")
        self.root.geometry("1100x800")
        self.root.configure(bg="#2d2d2d")

        self.data = []
        self.current_index = 0
        self.unsaved_changes = False
        self.photo = None 

        self.load_data()
        self.scan_for_new_images()
        
        # If still empty after scan, warn user
        if not self.data:
            messagebox.showwarning("No Data", f"No images found!\n\nChecked folder:\n{IMAGE_DIR}")
            
        self.setup_ui()
        self.show_current_slide()

    def load_data(self):
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    self.data = json.load(f)
                print(f"Loaded {len(self.data)} records from JSON.")
            except Exception as e:
                print(f"Error loading JSON: {e}")
                self.data = []
        else:
            print("No existing JSON file found. Starting fresh.")
            self.data = []

    def scan_for_new_images(self):
        if not os.path.exists(IMAGE_DIR):
            messagebox.showerror("Error", f"Image directory missing:\n{IMAGE_DIR}")
            return

        existing_urls = {item['url'] for item in self.data}
        found_count = 0

        # Walk through the directory to find images
        for root_dir, _, files in os.walk(IMAGE_DIR):
            for filename in files:
                if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                    # If image is NOT in our JSON yet, add it
                    if filename not in existing_urls:
                        new_entry = {
                            "url": filename,
                            "caption": "",
                            "tags": [],
                            "display": "hide" 
                        }
                        self.data.append(new_entry)
                        found_count += 1
        
        if found_count > 0:
            print(f"Added {found_count} new images.")
            self.unsaved_changes = True

    def save_data(self):
        self.update_current_record_from_ui()
        try:
            with open(DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(self.data, f, indent=4)
            
            self.unsaved_changes = False
            self.status_label.config(text="Saved successfully!", fg="#00ff00")
            self.root.after(2000, lambda: self.status_label.config(text=""))
        except Exception as e:
            messagebox.showerror("Save Error", str(e))

    def update_current_record_from_ui(self):
        if not self.data: return
        
        record = self.data[self.current_index]
        record['caption'] = self.caption_var.get()
        
        tags_str = self.tags_var.get()
        record['tags'] = [t.strip() for t in tags_str.split(',') if t.strip()]
        
        record['display'] = self.display_var.get()

    def show_current_slide(self):
        if not self.data: return

        record = self.data[self.current_index]
        
        # 1. Load Image
        image_path = os.path.join(IMAGE_DIR, record['url'])
        self.display_image(image_path)

        # 2. Update Fields
        self.filename_label.config(text=f"{record['url']} ({self.current_index + 1}/{len(self.data)})")
        self.caption_var.set(record.get('caption', ''))
        
        tags = record.get('tags', [])
        if tags is None: tags = []
        self.tags_var.set(", ".join(tags))
        
        self.display_var.set(record.get('display', 'hide'))

    def display_image(self, path):
        # Debugging print
        print(f"Loading: {path}")
        
        try:
            img = Image.open(path)
            
            # Resize
            max_w, max_h = 800, 500
            img.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
            
            self.photo = ImageTk.PhotoImage(img)
            self.image_label.config(image=self.photo, text="")
        except Exception as e:
            print(f"   [ERROR]: {e}")
            self.image_label.config(image='', text=f"Image load failed:\n{path}", fg="red")

    def nav_next(self):
        self.update_current_record_from_ui()
        if self.data:
            self.current_index = (self.current_index + 1) % len(self.data)
            self.show_current_slide()

    def nav_prev(self):
        self.update_current_record_from_ui()
        if self.data:
            self.current_index = (self.current_index - 1 + len(self.data)) % len(self.data)
            self.show_current_slide()

    def setup_ui(self):
        style = ttk.Style()
        style.theme_use('clam')
        style.configure("TLabel", background="#2d2d2d", foreground="#ffffff")
        style.configure("TButton", background="#4a4a4a", foreground="#ffffff")

        main_frame = tk.Frame(self.root, bg="#2d2d2d")
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)

        # Image
        self.image_label = tk.Label(main_frame, bg="#000000", text="No Image")
        self.image_label.pack(pady=10, fill=tk.BOTH, expand=True)
        
        self.filename_label = tk.Label(main_frame, text="", bg="#2d2d2d", fg="#aaaaaa")
        self.filename_label.pack(pady=5)

        # Controls
        controls = tk.Frame(main_frame, bg="#2d2d2d")
        controls.pack(fill=tk.X, pady=10)
        controls.columnconfigure(1, weight=1)

        tk.Label(controls, text="Caption:", bg="#2d2d2d", fg="white").grid(row=0, column=0, sticky="e", padx=5)
        self.caption_var = tk.StringVar()
        tk.Entry(controls, textvariable=self.caption_var, bg="#404040", fg="white", insertbackground="white").grid(row=0, column=1, sticky="ew", padx=5)

        tk.Label(controls, text="Tags:", bg="#2d2d2d", fg="white").grid(row=1, column=0, sticky="e", padx=5)
        self.tags_var = tk.StringVar()
        tk.Entry(controls, textvariable=self.tags_var, bg="#404040", fg="white", insertbackground="white").grid(row=1, column=1, sticky="ew", padx=5)

        tk.Label(controls, text="Display:", bg="#2d2d2d", fg="white").grid(row=2, column=0, sticky="e", padx=5)
        display_frame = tk.Frame(controls, bg="#2d2d2d")
        display_frame.grid(row=2, column=1, sticky="w", padx=5)
        
        self.display_var = tk.StringVar(value="hide")
        for text, val in [("Hide", "hide"), ("Homepage", "homepage"), ("Portfolio", "portfolio")]:
            tk.Radiobutton(display_frame, text=text, variable=self.display_var, value=val, 
                           bg="#2d2d2d", fg="white", selectcolor="#404040", activebackground="#2d2d2d", activeforeground="white").pack(side=tk.LEFT, padx=10)

        # Buttons
        btn_frame = tk.Frame(main_frame, bg="#2d2d2d")
        btn_frame.pack(fill=tk.X, pady=20)
        
        tk.Button(btn_frame, text="<< Prev", command=self.nav_prev, bg="#4a4a4a", fg="white", padx=15).pack(side=tk.LEFT)
        self.status_label = tk.Label(btn_frame, text="", bg="#2d2d2d", fg="#00ff00")
        self.status_label.pack(side=tk.LEFT, padx=20)
        tk.Button(btn_frame, text="Next >>", command=self.nav_next, bg="#4a4a4a", fg="white", padx=15).pack(side=tk.RIGHT)
        tk.Button(btn_frame, text="SAVE", command=self.save_data, bg="#2b8a3e", fg="white", padx=20).pack(side=tk.RIGHT, padx=20)

if __name__ == "__main__":
    root = tk.Tk()
    app = TaggerApp(root)
    root.mainloop()