import os

def remove_bom(base_path):
    print(f"Scanning for files with BOM in {base_path}...")
    count = 0
    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file.endswith(".java"):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'rb') as f:
                        content = f.read()
                    
                    if content.startswith(b'\xef\xbb\xbf'):
                        print(f"Removing BOM from: {file}")
                        new_content = content[3:]
                        with open(file_path, 'wb') as f:
                            f.write(new_content)
                        count += 1
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

    print(f"Fixed encoding for {count} files.")

if __name__ == "__main__":
    remove_bom(r"c:\Users\Oguzhan\Desktop\Repositories\ApplyFollow\backend\src")
