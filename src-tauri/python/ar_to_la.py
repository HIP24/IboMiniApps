# Define the transliteration scheme
transliteration_scheme = {
    'ا': 'a',
    'ب': 'b',
    'ت': 't',
    'ث': 'th',
    'ج': 'j',
    'ح': 'h',
    'خ': 'kh',
    'د': 'd',
    'ذ': 'dh',
    'ر': 'r',
    'ز': 'z',
    'س': 's',
    'ش': 'sh',
    'ص': 's',
    'ض': 'd',
    'ط': 't',
    'ظ': 'z',
    'ع': 'a',
    'غ': 'gh',
    'ف': 'f',
    'ق': 'q',
    'ك': 'k',
    'ل': 'l',
    'م': 'm',
    'ن': 'n',
    'ه': 'h',
    'و': 'w',
    'ي': 'y'
    # Add more mappings here
}

def transliterate(text):
    lines = text.split('\n')  # Split the text into lines
    result = ''
    for line in lines:
        for char in line:
            if char in transliteration_scheme:
                result += transliteration_scheme[char]
            else:
                result += char  # If no mapping is found, keep the original character
        result += '\n'  # Add a newline after each line
    return result

# Test the function
arabic_sentence = """في إحساس ماليني
وفي خوف ودموع في عيني مش قادر أداريها
ظروف معانداني بتجبرني حبيبي أنساك
ظروف كتير تاني بتمنعني اكون وياك
مش هنكر حقيقة
حاجات حلوة وبريئة حسيت معاك بيها
طبيعي تتغير عشان بعديها شفت عذاب
طبيعي هتغير مادام بسهولة كده بتساب
تعبت معاك حقيقي خلاص
كلامي كأني أنا مقولتوش
مصحاش عمره فيك إحساس
ضميرك حتى ما لقتهوش
تعبت معاك حقيقي خلاص
كلامي كأني أنا مقولتوش
مصحاش عمره فيك إحساس
ضميرك حتي ما لقتهوش
شوف اللي وصلنا ليه
شوف لو بينا حاجة تشفع لنا نكمل
في مين يعيش راضي وهو خسارة مش مبسوط
في مين يموت عادي ومن يرضالي أعيش مكبوت
هات عقرب ثواني
وشوف كم حد تاني كان زيي اتحمل
سنين وأنا عايش لكن شايل في قلبي كتير
سنين بقول جايز أشوف منك ولو يوم خير
تعبت معاك حقيقي خلاص
كلامي كأني أنا مقولتوش
مصحاش عمره فيك إحساس
ضميرك حتى ما لقتهوش
تعبت معاك حقيقي خلاص
كلامي كأني أنا مقولتوش
مصحاش عمره فيك إحساس
ضميرك حتى ما لقتهوش"""
print(transliterate(arabic_sentence))




