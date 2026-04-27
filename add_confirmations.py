import os
import re

dir_path = '/Volumes/WORKS/i/react-app/src/components/admin/'

for filename in os.listdir(dir_path):
    if not filename.endswith('Editor.jsx'):
        continue
    filepath = os.path.join(dir_path, filename)
    with open(filepath, 'r') as f:
        content = f.read()

    # Regex to find `const remove... = (...) => { ... }`
    # We want to non-greedily match the body until the first `  };` or similar
    pattern = re.compile(r'(const remove[A-Z]\w* = \([^)]*\) => \{)(.*?)(^\s*\};)', re.DOTALL | re.MULTILINE)
    
    modified = False
    
    def replacer(match):
        start = match.group(1)
        body = match.group(2)
        end = match.group(3)
        
        if 'window.confirm' in body:
            return match.group(0)
            
        # Indent the body
        lines = body.split('\n')
        indented_lines = []
        for line in lines:
            if line.strip():
                indented_lines.append('  ' + line)
            else:
                indented_lines.append(line)
        indented_body = '\n'.join(indented_lines)
        
        # Determine the indentation of the end brace to align the if block
        # end looks like "  };"
        indent = end.replace('};', '').strip('\n')
        
        new_str = f"{start}\n{indent}  if (window.confirm('هل أنت متأكد من الحذف؟')) {{{indented_body}\n{indent}  }}\n{end.lstrip()}"
        return new_str
        
    new_content, count = pattern.subn(replacer, content)
    if count > 0:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Modified {filename}")

