const coursesData = {
    "MTH-101": {
        en: {
            title: "Calculus & Analysis",
            description: "A rigorous introduction to limits, derivatives, integrals, and infinite series. This course builds the mathematical foundation required for advanced physics and engineering.",
            syllabus: [
                "Limits and Continuity",
                "Differentiation: Theory and Applications",
                "Integration: Riemann Sums and Techniques",
                "Sequences and Series",
                "Introduction to Differential Equations"
            ],
            duration: "12 Weeks",
            level: "Foundational"
        },
        ar: {
            title: "التفاضل والتكامل والتحليل",
            description: "مقدمة دقيقة للنهايات، المشتقات، التكاملات، والمتسلسلات اللا نهائية. يبني هذا المساق الأساس الرياضي المطلوب للفيزياء والهندسة المتقدمة.",
            syllabus: [
                "النهايات والاتصال",
                "التفاضل: النظرية والتطبيقات",
                "التكامل: مجاميع ريمان والتقنيات",
                "المتتاليات والمتسلسلات",
                "مقدمة في المعادلات التفاضلية"
            ],
            duration: "١٢ أسبوع",
            level: "تأسيسي"
        },
        he: {
            title: "חשבון אינפיניטסימלי",
            description: "מבוא קפדני לגבולות, נגזרות, אינטגרלים וטורים אינסופיים. קורס זה בונה את היסוד המתמטי הדרוש לפיזיקה מתקדמת והנדסה.",
            syllabus: [
                "גבולות ורציפות",
                "חשבון דיפרנציאלי: תיאוריה ויישומים",
                "אינטגרלים: סכומי רימן ושיטות אינטגרציה",
                "סדרות וטורים",
                "מבוא למוואות דיפרנציאליות"
            ],
            duration: "12 שבועות",
            level: "יסודות"
        },
        ru: {
            title: "Математический Анализ",
            description: "Строгое введение в пределы, производные, интегралы и бесконечные ряды. Этот курс создает математическую базу, необходимую для передовой физики и инженерии.",
            syllabus: [
                "Пределы и Непрерывность",
                "Дифференцирование: Теория и Приложения",
                "Интегрирование: Суммы Римана",
                "Последовательности и Ряды",
                "Введение в Дифференциальные Уравнения"
            ],
            duration: "12 Недель",
            level: "Базовый"
        }
    },
    "MTH-102": {
        en: {
            title: "Linear Algebra",
            description: "Vector spaces, linear transformations, matrices, and eigenvalues. The language of quantum mechanics and machine learning.",
            syllabus: [
                "Systems of Linear Equations",
                "Vector Spaces and Subspaces",
                "Linear Transformations",
                "Determinants and Eigenvalues",
                "Inner Product Spaces"
            ],
            duration: "10 Weeks",
            level: "Essential"
        },
        ar: {
            title: "الجبر الخطي",
            description: "الفضاءات المتجهية، التحويلات الخطية، المصفوفات، والقيم الذاتية. لغة ميكانيكا الكم والتعلم الآلي.",
            syllabus: [
                "أنظمة المعادلات الخطية",
                "الفضاءات المتجهية والفضاءات الجزئية",
                "التحويلات الخطية",
                "المحددات والقيم الذاتية",
                "فضاءات الضرب الداخلي"
            ],
            duration: "١٠ أسابيع",
            level: "أساسي"
        },
        he: {
            title: "אלגברה ליניארית",
            description: "מרחבים וקטוריים, העתקות ליניאריות, מטריצות וערכים עצמיים. השפה של מכניקת הקוונטים ולמידת מכונה.",
            syllabus: [
                "מערכות משוואות ליניאריות",
                "מרחבים וקטוריים ותתי-מרחבים",
                "העתקות ליניאריות",
                "דטרמיננטות וערכים עצמיים",
                "מרחבי מכפלה פנימית"
            ],
            duration: "10 שבועות",
            level: "חיוני"
        },
        ru: {
            title: "Линейная Алгебра",
            description: "Векторные пространства, линейные преобразования, матрицы и собственные значения. Язык квантовой механики и машинного обучения.",
            syllabus: [
                "Системы Линейных Уравнений",
                "Векторные Пространства",
                "Линейные Преобразования",
                "Определители и Собственные Значения",
                "Пространства Внутреннего Произведения"
            ],
            duration: "10 Недель",
            level: "Важный"
        }
    },
    "MTH-103": {
        en: {
            title: "Discrete Mathematics",
            description: "Logic, set theory, combinatorics, and graph theory. The mathematical structures behind computer science.",
            syllabus: [
                "Propositional and Predicate Logic",
                "Set Theory and Functions",
                "Induction and Recursion",
                "Graph Theory Basics",
                "Combinatorics and Counting"
            ],
            duration: "10 Weeks",
            level: "Essential"
        },
        ar: {
            title: "الرياضيات المتقطعة",
            description: "المنطق، نظرية المجموعات، التوافيق، ونظرية البيان. الهياكل الرياضية وراء علوم الحاسوب.",
            syllabus: [
                "المنطق الافتراضي والمسند",
                "نظرية المجموعات والدوال",
                "الاستقراء والتكرار",
                "أساسيات نظرية البيان",
                "التوافيق والعد"
            ],
            duration: "١٠ أسابيع",
            level: "أساسي"
        },
        he: {
            title: "מתמטיקה בדידה",
            description: "לוגיקה, תורת הקבוצות, קומבינטוריקה ותורת הגרפים. המבנים המתמטיים שמאחורי מדעי המחשב.",
            syllabus: [
                "תחשיב הפסוקים והפרדיקטים",
                "תורת הקבוצות ופונקציות",
                "אינדוקציה ורקורסיה",
                "יסודות תורת הגרפים",
                "קומבינטוריקה וספירה"
            ],
            duration: "10 שבועות",
            level: "חיוני"
        },
        ru: {
            title: "Дискретная Математика",
            description: "Логика, теория множеств, комбинаторика и теория графов. Математические структуры информатики.",
            syllabus: [
                "Логика Высказываний",
                "Теория Множеств",
                "Индукция и Рекурсия",
                "Основы Теории Графов",
                "Комбинаторика"
            ],
            duration: "10 Недель",
            level: "Важный"
        }
    },
    "MTH-104": {
        en: {
            title: "Probability Theory",
            description: "Quantifying uncertainty. Random variables, distributions, and limit theorems. The math of chance.",
            syllabus: [
                "Probability Spaces and Axioms",
                "Random Variables (Discrete & Continuous)",
                "Expectation and Variance",
                "Law of Large Numbers",
                "Central Limit Theorem"
            ],
            duration: "12 Weeks",
            level: "Foundational"
        },
        ar: {
            title: "نظرية الاحتمالات",
            description: "قياس عدم اليقين. المتغيرات العشوائية، التوزيعات، ونظريات النهايات. رياضيات الصدفة.",
            syllabus: [
                "فضاءات الاحتمال والبديهيات",
                "المتغيرات العشوائية",
                "التوقع والتباين",
                "قانون الأعداد الكبيرة",
                "نظرية النهاية المركزية"
            ],
            duration: "١٢ أسبوع",
            level: "تأسيسي"
        },
        he: {
            title: "תורת ההסתברות",
            description: "כימות אי-הודאות. משתנים מקריים, התפלגויות ומשפטי גבול. המתמטיקה של המקרה.",
            syllabus: [
                "מרחבי הסתברות ואקסיומות",
                "משתנים מקריים",
                "תוחלת ושונות",
                "חוק המספרים הגדולים",
                "משפט הגבול המרכזי"
            ],
            duration: "12 שבועות",
            level: "יסודות"
        },
        ru: {
            title: "Теория Вероятностей",
            description: "Оценка неопределенности. Случайные величины, распределения и предельные теоремы. Математика шанса.",
            syllabus: [
                "Вероятностные Пространства",
                "Случайные Величины",
                "Ожидание и Дисперсия",
                "Закон Больших Чисел",
                "Центральная Предельная Теорема"
            ],
            duration: "12 Недель",
            level: "Базовый"
        }
    },
    "MTH-201": {
        en: {
            title: "Abstract Algebra",
            description: "Groups, Rings, and Fields. Exploring the deep structures underlying arithmetic and symmetry.",
            syllabus: [
                "Group Theory and Subgroups",
                "Cyclic Groups and Permutations",
                "Isomorphisms and Homomorphisms",
                "Ring Theory Basics",
                "Introduction to Fields"
            ],
            duration: "14 Weeks",
            level: "Advanced"
        },
        ar: {
            title: "الجبر المجرد",
            description: "الزمر، الحلقات، والحقول. استكشاف الهياكل العميقة الكامنة وراء الحساب والتناظر.",
            syllabus: [
                "نظرية الزمر والزمر الجزئية",
                "الزمر الدورية والتباديل",
                "التشابه والتشاكل",
                "أساسيات نظرية الحلقات",
                "مقدمة في الحقول"
            ],
            duration: "١٤ أسبوع",
            level: "متقدم"
        },
        he: {
            title: "אלגברה מופשטת",
            description: "חבורות, חוגים ושדות. חקירת המבנים העמוקים העומדים בבסיס האריתמטיקה והסימטריה.",
            syllabus: [
                "תורת החבורות",
                "חבורות ציקליות ותמורות",
                "איזומורפיזם והומומורפיזם",
                "תורת החוגים",
                "מבוא לשדות"
            ],
            duration: "14 שבועות",
            level: "מתקדם"
        },
        ru: {
            title: "Общая Алгебра",
            description: "Группы, кольца и поля. Изучение глубоких структур, лежащих в основе арифметики и симметрии.",
            syllabus: [
                "Теория Групп",
                "Циклические Группы",
                "Изоморфизмы",
                "Теория Колец",
                "Введение в Поля"
            ],
            duration: "14 Недель",
            level: "Продвинутый"
        }
    },
    "MTH-202": {
        en: {
            title: "Partial Differential Equations",
            description: "Modeling heat, wave, and potential. The mathematical language of the physical universe.",
            syllabus: [
                "First-Order PDEs",
                "Heat Equation",
                "Wave Equation",
                "Laplace Equation",
                "Fourier Series Methods"
            ],
            duration: "14 Weeks",
            level: "Advanced"
        },
        ar: {
            title: "المعادلات التفاضلية الجزئية",
            description: "نمذجة الحرارة، الموجات، والجهد. اللغة الرياضية للكون المادي.",
            syllabus: [
                "المعادلات التفاضلية من الرتبة الأولى",
                "معادلة الحرارة",
                "معادلة الموجة",
                "معادلة لابلاس",
                "طرق متسلسلات فورييه"
            ],
            duration: "١٤ أسبوع",
            level: "متقدم"
        },
        he: {
            title: "משוואות דיפרנציאליות חלקיות",
            description: "מודלים של חום, גלים ופוטנציאל. השפה המתמטית של היקום הפיזיקלי.",
            syllabus: [
                "מד\"ח מסדר ראשון",
                "משוואת החום",
                "משוואת הגלים",
                "משוואת למפלס",
                "טורי פורייה"
            ],
            duration: "14 שבועות",
            level: "מתקדם"
        },
        ru: {
            title: "Уравнения в Частных Производных",
            description: "Моделирование тепла, волн и потенциала. Математический язык физической вселенной.",
            syllabus: [
                "УЧП Первого Порядка",
                "Уравнение Теплопроводности",
                "Волновое Уравнение",
                "Уравнение Лапласа",
                "Методы Рядов Фурье"
            ],
            duration: "14 Недель",
            level: "Продвинутый"
        }
    },
    "LANG-EN": {
        en: {
            title: "Scientific English",
            description: "Master the global language of science. Focus on academic writing, research terminology, and effective communication.",
            syllabus: ["Academic Writing", "Research Terminology", "Presentation Skills", "Grant Proposal Writing"],
            duration: "8 Weeks",
            level: "Intermediate"
        },
        ar: {
            title: "اللغة الإنجليزية العلمية",
            description: "أتقن لغة العلم العالمية. التركيز على الكتابة الأكاديمية، مصطلحات البحث، والتواصل الفعال.",
            syllabus: ["الكتابة الأكاديمية", "مصطلحات البحث", "مهارات العرض", "كتابة مقترحات المنح"],
            duration: "٨ أسابيع",
            level: "متوسط"
        },
        he: {
            title: "אנגלית מדעית",
            description: "שלטו בשפה הבינלאומית של המדע. התמקדות בכתיבה אקדמית, מינוח מחקרי ותקשורת יעילה.",
            syllabus: ["כתיבה אקדמית", "מינוח מחקרי", "מיומנויות פרזנטציה", "כתיבת בקשות למענקים"],
            duration: "8 שבועות",
            level: "בינוני"
        },
        ru: {
            title: "Научный Английский",
            description: "Овладейте глобальным языком науки. Акцент на академическом письме, исследовательской терминологии и эффективной коммуникации.",
            syllabus: ["Академическое Письмо", "Исследовательская Терминология", "Навыки Презентации", "Написание Грантовых Заявок"],
            duration: "8 Недель",
            level: "Средний"
        }
    },
    "LANG-AR": {
        en: {
            title: "Modern Arabic",
            description: "Learn Modern Standard Arabic (MSA) for academic and professional contexts in the Middle East.",
            syllabus: ["Alphabet & Pronunciation", "Basic Grammar & Syntax", "Reading Scientific Texts", "Conversational Skills"],
            duration: "10 Weeks",
            level: "Beginner"
        },
        ar: {
            title: "اللغة العربية الفصحى",
            description: "دراسة متعمقة للنحو والصرف والبلاغة للأغراض الأكاديمية والمهنية.",
            syllabus: ["النحو والصرف", "البلاغة", "تحليل النصوص", "الكتابة المتقدمة"],
            duration: "١٠ أسابيع",
            level: "متقدم"
        },
        he: {
            title: "ערבית ספרותית",
            description: "למדו ערבית ספרותית מודרנית להקשרים אקדמיים ומקצועיים במזרח התיכון.",
            syllabus: ["אלפבית והגייה", "דקדוק ותחביר בסיסי", "קריאת טקסטים מדעיים", "מיומנויות שיחה"],
            duration: "10 שבועות",
            level: "מתחילים"
        },
        ru: {
            title: "Современный Арабский",
            description: "Изучайте современный литературный арабский язык для академических и профессиональных целей.",
            syllabus: ["Алфавит и Произношение", "Основы Грамматики", "Чтение Научных Текстов", "Разговорные Навыки"],
            duration: "10 Недель",
            level: "Начальный"
        }
    },
    "LANG-HE": {
        en: {
            title: "Hebrew Language",
            description: "From Aleph-Bet to advanced reading. Access the vibrant academic and tech ecosystem of Israel.",
            syllabus: ["Alphabet (Aleph-Bet)", "Vocabulary Building", "Verb Conjugations", "Reading Technical Texts"],
            duration: "10 Weeks",
            level: "Beginner"
        },
        ar: {
            title: "اللغة العبرية",
            description: "من الألف-بي إلى القراءة المتقدمة. الوصول إلى النظام البيئي الأكاديمي والتكنولوجي في المنطقة.",
            syllabus: ["الأبجدية", "بناء المفردات", "تصريف الأفعال", "قراءة النصوص التقنية"],
            duration: "١٠ أسابيع",
            level: "مبتدئ"
        },
        he: {
            title: "עברית אקדמית",
            description: "שיפור יכולות ההבעה והכתיבה האקדמית לדוברי עברית ולומדים מתקדמים.",
            syllabus: ["כתיבה מדעית", "דקדוק מתקדם", "עריכה לשונית", "רטוריקה"],
            duration: "10 שבועות",
            level: "מתקדם"
        },
        ru: {
            title: "Иврит",
            description: "От Алеф-Бет до продвинутого чтения. Доступ к академической и технологической экосистеме Израиля.",
            syllabus: ["Алфавит", "Пополнение Словаря", "Спряжение Глаголов", "Чтение Технических Текстов"],
            duration: "10 Недель",
            level: "Начальный"
        }
    },
    "LANG-RU": {
        en: {
            title: "Russian Language",
            description: "Unlock the vast mathematical and scientific literature written in Russian.",
            syllabus: ["Cyrillic Alphabet", "Grammar Cases", "Scientific Vocabulary", "Reading Classic Papers"],
            duration: "12 Weeks",
            level: "Beginner"
        },
        ar: {
            title: "اللغة الروسية",
            description: "افتح الباب أمام الأدبيات الرياضية والعلمية الواسعة المكتوبة باللغة الروسية.",
            syllabus: ["الأبجدية السيريلية", "قواعد النحو", "المفردات العلمية", "قراءة الأوراق الكلاسيكية"],
            duration: "١٢ أسبوع",
            level: "مبتدئ"
        },
        he: {
            title: "השפה הרוסית",
            description: "פתחו גישה לספרות המתמטית והמדעית הענפה הכתובה ברוסית.",
            syllabus: ["האלפבית הקירילי", "יחסות דקדוקיות", "אוצר מילים מדעי", "קריאת מאמרים קלאסיים"],
            duration: "12 שבועות",
            level: "מתחילים"
        },
        ru: {
            title: "Русский Язык",
            description: "Углубленное изучение для академических целей и редактирования научных текстов.",
            syllabus: ["Стилистика", "Научное Редактирование", "Публичные Выступления", "Академическая Этика"],
            duration: "12 Недель",
            level: "Продвинутый"
        }
    },
    "LANG-PY": {
        en: {
            title: "Python for Science",
            description: "The ultimate tool for modern scientists. Data analysis, simulation, and machine learning/AI.",
            syllabus: ["Python Basics", "NumPy & Pandas", "Matplotlib Visualization", "Introduction to Machine Learning"],
            duration: "10 Weeks",
            level: "Computational"
        },
        ar: {
            title: "بايثون للعلوم",
            description: "الأداة المثلى للعلماء المعاصرين. تحليل البيانات، المحاكاة، والتعلم الآلي/الذكاء الاصطناعي.",
            syllabus: ["أساسيات بايثون", "NumPy & Pandas", "تمثيل البيانات (Matplotlib)", "مقدمة في التعلم الآلي"],
            duration: "١٠ أسابيع",
            level: "حاسوبي"
        },
        he: {
            title: "פייתון למדעים",
            description: "הכלי האולטימטיבי למדענים מודרניים. ניתוח נתונים, סימולציות ולמידת מכונה/AI.",
            syllabus: ["יסודות הפייתון", "NumPy & Pandas", "ויזואליזציה עם Matplotlib", "מבוא ללמידת מכונה"],
            duration: "10 שבועות",
            level: "חישובי"
        },
        ru: {
            title: "Python для Науки",
            description: "Главный инструментарий современного ученого. Анализ данных, моделирование и машинное обучение.",
            syllabus: ["Основы Python", "NumPy и Pandas", "Визуализация (Matplotlib)", "Введение в Машинное Обучение"],
            duration: "10 Недель",
            level: "Вычислительный"
        }
    }
};
