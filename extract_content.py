import glob
import os
import re

os.makedirs('assets/content/projects', exist_ok=True)

html_files = glob.glob('*.html')
project_files = [f for f in html_files if f not in ['index.html', 'about.html', 'contact.html', 'projects.html']]

for file in project_files:
    slug = file.replace('.html', '')
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Try to extract everything from <div class="text-wrapper"> to the end of <div class="contributions">
    # Because of nested divs, regex is tricky. We'll find the index of `<div class="text-wrapper">`
    # and the index of `</div> <!-- contributions -->` or similar.
    
    text_wrapper_idx = content.find('<div class="text-wrapper">')
    if text_wrapper_idx == -1:
        print(f"Skipping {file}: No text-wrapper found")
        continue
        
    contributions_end_idx = content.find('</div> <!-- contributions -->')
    if contributions_end_idx != -1:
        end_idx = contributions_end_idx + len('</div> <!-- contributions -->')
    else:
        # Fallback to content-wrapper end
        content_wrapper_end = content.find('</div><!-- content-wrapper -->')
        if content_wrapper_end != -1:
            end_idx = content_wrapper_end
        else:
            end_idx = len(content)

    extracted_html = content[text_wrapper_idx:end_idx].strip()
    
    with open(f'assets/content/projects/{slug}.html', 'w', encoding='utf-8') as f:
        f.write(extracted_html)
        
    print(f"Extracted content for {slug}")
