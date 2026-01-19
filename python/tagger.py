import os
import json
import sys
import tkinter as tk
from tkinter import ttk, messagebox
from PIL import Image, ImageTk, ExifTags, IptcImagePlugin

# --- PATH CONFIGURATION ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR) 

DATA_FILE = os.path.join(PROJECT_ROOT, 'src', 'data', 'imageData.json')
IMAGE_DIR = os.path.join(PROJECT_ROOT, '_raw_images', 'portfolio')

print(f"DEBUG: Project Root:   {PROJECT_ROOT}")
print(f"DEBUG: Image Folder:   {IMAGE_DIR}")
print(f"DEBUG: Data File:      {DATA_FILE}")
# --------------------------------

class TaggerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("NC3D Image Tagger (Safe Mode)")
        self.root.geometry("1200x900")
        self.root.configure(bg="#2d2d2d")

        self.data = []
        self.current_index = 0
        self.unsaved_changes = False
        self.photo = None 

        # CRITICAL: If load fails, we must NOT continue.
        if not self.load_data():
            print("CRITICAL: Data load failed. Exiting to prevent overwrite.")
            # We destroy the root after a short delay to ensure the message box is seen
            self.root.after(100, self.root.destroy)
            return

        self.scan_for_new_images()
        
        if not self.data:
            messagebox.showwarning("No Data", f"No images found!\nChecked: {IMAGE_DIR}")
            
        self.setup_ui()
        self.show_current_slide()

    def load_data(self):
        """
        Returns True if load was successful (or file didn't exist).
        Returns False if a file existed but failed to load (Critical Error).
        """
        if os.path.exists(DATA_FILE):
            # 1. Check for empty file (0 bytes)
            if os.path.getsize(DATA_FILE) == 0:
                messagebox.showerror(
                    "Critical Data Error", 
                    f"The file exists but is EMPTY (0 bytes):\n{DATA_FILE}\n\n"
                    "The app will close to prevent overwriting it.\n"
                    "Please check the file content in VS Code."
                )
                return False

            # 2. Try to parse JSON
            try:
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    self.data = json.load(f)
                print(f"✅ Successfully loaded {len(self.data)} records.")
                return True
            
            except json.JSONDecodeError as e:
                messagebox.showerror(
                    "JSON Syntax Error", 
                    f"The data file is corrupted or has invalid JSON.\n\nFile: {DATA_FILE}\nError: {e}\n\n"
                    "App will close to protect your data."
                )
                return False
            except Exception as e:
                messagebox.showerror(
                    "File Load Error", 
                    f"Could not open data file.\n\nError: {e}\n\n"
                    "Check if it is locked or open in another program."
                )
                return False
        else:
            print("No existing JSON file found. Starting fresh is safe.")
            self.data = []
            return True

    def scan_for_new_images(self):
        if not os.path.exists(IMAGE_DIR):
            messagebox.showerror("Error", f"Image directory missing:\n{IMAGE_DIR}")
            return

        existing_urls = {item['url'] for item in self.data}
        found_count = 0

        for root_dir, _, files in os.walk(IMAGE_DIR):
            for filename in files:
                if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                    if filename not in existing_urls:
                        self.data.append({
                            "url": filename,
                            "caption": "",
                            "tags": [],
                            "display": "hide" 
                        })
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
            self.status_label.config(text="Saved!", fg="#00ff00")
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
        
        # Load Image
        path = os.path.join(IMAGE_DIR, record['url'])
        self.display_image(path)

        # Update Text Fields
        self.filename_label.config(text=f"{record['url']} ({self.current_index + 1}/{len(self.data)})")
        self.caption_var.set(record.get('caption', ''))
        self.tags_var.set(", ".join(record.get('tags', [])))
        self.display_var.set(record.get('display', 'hide'))

    def get_exif_data(self, img):
        """Extract resolution, Windows Tags, and IPTC Keywords."""
        info = {
            "res": f"{img.width} x {img.height}",
            "meta": []
        }
        found_tags = set()

        # 1. Check Standard EXIF & Windows XP Tags
        WIN_XP_KEYWORDS = 40094
        exif = img._getexif()
        if exif:
            if WIN_XP_KEYWORDS in exif:
                try:
                    val_str = exif[WIN_XP_KEYWORDS].decode('utf-16le').replace('\x00', '').strip()
                    if val_str:
                        found_tags.add(f"Windows Tags: {val_str}")
                except:
                    pass

            for tag_id, value in exif.items():
                decoded = ExifTags.TAGS.get(tag_id, tag_id)
                if decoded == 'ImageDescription' and value:
                    info['meta'].append(f"Caption: {value}")
                if decoded == 'Model' and value:
                    info['meta'].append(f"Camera: {value}")

        # 2. Check IPTC Data
        try:
            iptc = IptcImagePlugin.getiptcinfo(img)
            if iptc and (2, 25) in iptc:
                raw_keywords = iptc[(2, 25)]
                if isinstance(raw_keywords, list):
                    keywords = [str(k.decode('utf-8') if isinstance(k, bytes) else k) for k in raw_keywords]
                    found_tags.add(f"IPTC: {', '.join(keywords)}")
                else:
                    found_tags.add(f"IPTC: {raw_keywords}")
        except:
            pass

        info['meta'].extend(list(found_tags))
        if not info['meta']:
            info['meta'].append("No specific tags found")
            
        return info

    def display_image(self, path):
        try:
            img = Image.open(path)
            meta = self.get_exif_data(img)
            self.res_label.config(text=f"Resolution: {meta['res']}")
            self.exif_label.config(text="\n".join(meta['meta']))

            img.thumbnail((800, 500), Image.Resampling.LANCZOS)
            self.photo = ImageTk.PhotoImage(img)
            self.image_label.config(image=self.photo, text="")
        except Exception as e:
            print(f"Load Error: {e}")
            self.image_label.config(image='', text=f"File not found:\n{path}", fg="red")
            self.res_label.config(text="Resolution: N/A")
            self.exif_label.config(text="")

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
        
        main = tk.Frame(self.root, bg="#2d2d2d")
        main.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)

        self.image_label = tk.Label(main, bg="black", text="No Image")
        self.image_label.pack(pady=10, fill=tk.BOTH, expand=True)
        
        info_frame = tk.Frame(main, bg="#2d2d2d")
        info_frame.pack(fill=tk.X, pady=5)
        self.filename_label = tk.Label(info_frame, text="", bg="#2d2d2d", fg="#aaaaaa", font=("Arial", 11, "bold"))
        self.filename_label.pack()
        self.res_label = tk.Label(info_frame, text="Resolution: --", bg="#2d2d2d", fg="#00ccff", font=("Arial", 9))
        self.res_label.pack()
        self.exif_label = tk.Label(main, text="", bg="#2d2d2d", fg="#888888", font=("Consolas", 8), justify=tk.CENTER)
        self.exif_label.pack(pady=5)

        ctrl = tk.Frame(main, bg="#2d2d2d")
        ctrl.pack(fill=tk.X, pady=10)
        ctrl.columnconfigure(1, weight=1)

        tk.Label(ctrl, text="Caption:", bg="#2d2d2d", fg="white").grid(row=0, column=0, sticky="e")
        self.caption_var = tk.StringVar()
        tk.Entry(ctrl, textvariable=self.caption_var, bg="#404040", fg="white").grid(row=0, column=1, sticky="ew", padx=5)

        tk.Label(ctrl, text="Tags:", bg="#2d2d2d", fg="white").grid(row=1, column=0, sticky="e")
        self.tags_var = tk.StringVar()
        tk.Entry(ctrl, textvariable=self.tags_var, bg="#404040", fg="white").grid(row=1, column=1, sticky="ew", padx=5)

        tk.Label(ctrl, text="Display:", bg="#2d2d2d", fg="white").grid(row=2, column=0, sticky="e")
        disp_frame = tk.Frame(ctrl, bg="#2d2d2d")
        disp_frame.grid(row=2, column=1, sticky="w", padx=5)
        self.display_var = tk.StringVar(value="hide")
        for txt, val in [("Hide","hide"), ("Homepage","homepage"), ("Portfolio","portfolio")]:
            tk.Radiobutton(disp_frame, text=txt, variable=self.display_var, value=val, bg="#2d2d2d", fg="white", selectcolor="#444").pack(side=tk.LEFT, padx=5)

        btns = tk.Frame(main, bg="#2d2d2d")
        btns.pack(fill=tk.X, pady=10)
        tk.Button(btns, text="<< Prev", command=self.nav_prev, bg="#444", fg="white").pack(side=tk.LEFT)
        self.status_label = tk.Label(btns, text="", bg="#2d2d2d")
        self.status_label.pack(side=tk.LEFT, padx=20)
        tk.Button(btns, text="Next >>", command=self.nav_next, bg="#444", fg="white").pack(side=tk.RIGHT)
        tk.Button(btns, text="SAVE", command=self.save_data, bg="green", fg="white").pack(side=tk.RIGHT, padx=20)

if __name__ == "__main__":
    root = tk.Tk()
    app = TaggerApp(root)
    root.mainloop()