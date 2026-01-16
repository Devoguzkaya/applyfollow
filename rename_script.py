import os

def rename_packages(base_path):
    print(f"Processing {base_path}...")
    
    # 1. Rename Directories
    old_dir = os.path.join(base_path, "src", "main", "java", "com", "applytrack")
    new_dir = os.path.join(base_path, "src", "main", "java", "com", "applyfollow")
    
    if os.path.exists(old_dir):
        print(f"Renaming directory {old_dir} to {new_dir}")
        os.rename(old_dir, new_dir)
    else:
        print(f"Directory {old_dir} not found (maybe already renamed?)")

    old_test_dir = os.path.join(base_path, "src", "test", "java", "com", "applytrack")
    new_test_dir = os.path.join(base_path, "src", "test", "java", "com", "applyfollow")

    if os.path.exists(old_test_dir):
        print(f"Renaming test directory {old_test_dir} to {new_test_dir}")
        os.rename(old_test_dir, new_test_dir)
    
    # 2. Replace Content in Files
    src_path = os.path.join(base_path, "src")
    count = 0
    for root, dirs, files in os.walk(src_path):
        for file in files:
            if file.endswith(".java"):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content.replace("package com.applytrack", "package com.applyfollow")
                    new_content = new_content.replace("import com.applytrack", "import com.applyfollow")
                    
                    if content != new_content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        count += 1
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

    print(f"Updated {count} Java files.")

if __name__ == "__main__":
    rename_packages(r"c:\Users\Oguzhan\Desktop\Repositories\ApplyFollow\backend")
