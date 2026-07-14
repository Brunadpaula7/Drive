with open('components/JobSection.tsx', 'r') as f:
    content = f.read()

content = content.replace(") : null)\n                                    ))}", ") : null\n                                    )}")

with open('components/JobSection.tsx', 'w') as f:
    f.write(content)
