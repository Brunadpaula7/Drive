import re

with open('components/SettingsModal.tsx', 'r') as f:
    content = f.read()

# Remove setLocalInfo
content = re.sub(r'const \[localInfo, setLocalInfo\] = useState\(\{.*?\}\);\n', '', content)

# Remove onSaveInfoBoard call
content = re.sub(r'onSaveInfoBoard\(\{(.|\n)*?\}\);', '', content)

# Fix useEffect
effect_search = r'useEffect\(\(\) => \{\s*if \(isOpen\) \{\s*setLocalInfo\(\{.*?\}\);\s*setLocalLaunches'
effect_replace = r'useEffect(() => {\n        if (isOpen) {\n            setLocalLaunches'
content = re.sub(effect_search, effect_replace, content, flags=re.DOTALL)

# Fix useEffect deps
content = re.sub(r'\[isOpen, infoBoardData, launchesData', '[isOpen, launchesData', content)

# Write back
with open('components/SettingsModal.tsx', 'w') as f:
    f.write(content)
