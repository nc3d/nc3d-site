import os

# Configuration
OUTPUT_FILE = 'full_project_code.txt'

# Folders to completely ignore
IGNORE_DIRS = {
    'node_modules', 
    '.git', 
    'dist', 
    'build', 
    '.vscode', 
    'coverage'
}

# Only include files with these extensions
INCLUDE_EXTENSIONS = {
    '.ts', '.tsx', 
    '.js', '.jsx', '.cjs', '.mjs',
    '.css', 
    '.html', 
    '.json',
    '.md'
}

# Specific files to ignore even if they match extensions
IGNORE_FILES = {
    'package-lock.json',
    'pack_project.py', # Don't include this script itself
    OUTPUT_FILE        # Don't include the output file
}

def pack_project():
    project_root = os.getcwd()
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
        outfile.write(f"Project Context Export\n")
        outfile.write(f"======================\n\n")

        for root, dirs, files in os.walk(project_root):
            # Modify dirs in-place to skip ignored directories
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            
            for file in files:
                if file in IGNORE_FILES:
                    continue
                
                _, ext = os.path.splitext(file)
                if ext.lower() in INCLUDE_EXTENSIONS:
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, project_root)
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            content = infile.read()
                            
                        # Formatting for the AI to read easily
                        outfile.write(f"--- START FILE: {rel_path} ---\n")
                        outfile.write(content)
                        outfile.write(f"\n--- END FILE: {rel_path} ---\n\n")
                        print(f"Packed: {rel_path}")
                        
                    except Exception as e:
                        print(f"Error reading {rel_path}: {e}")

    print(f"\nDone! All code saved to: {OUTPUT_FILE}")

if __name__ == '__main__':
    pack_project()