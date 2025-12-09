
import React from 'react';
import { UserProfile } from '../types';

interface DietPlanProps {
  profile: UserProfile;
  onBack: () => void;
}

const DIET_DATA_EN = [
  {
    title: 'Diabetes-Friendly',
    icon: '🩸',
    good: ['Leafy Greens (Spinach, Kale)', 'Whole Grains (Oats, Barley)', 'Beans & Lentils', 'Berries (in moderation)', 'Nuts & Seeds'],
    avoid: ['Sugary Drinks & Sodas', 'White Bread & Pasta', 'Deep Fried Foods'],
    tip: 'Pair carbohydrates with protein or healthy fats to slow down sugar absorption.'
  },
  {
    title: 'Kidney-Friendly',
    icon: '💧',
    good: ['Cauliflower', 'Blueberries', 'Egg Whites', 'Garlic & Onions', 'Olive Oil'],
    avoid: ['High-Sodium Processed Foods', 'Bananas & Potatoes (if Potassium restricted)', 'Dark Colas'],
    tip: 'Limit salt intake and stay hydrated with plain water unless fluid restricted.'
  },
  {
    title: 'Liver-Support',
    icon: '🍃',
    good: ['Cruciferous Veggies (Broccoli)', 'Fatty Fish (Salmon)', 'Walnuts', 'Green Tea', 'Avocado'],
    avoid: ['Alcohol', 'Added Sugars', 'Saturated Fats (Red Meat)'],
    tip: 'Focus on whole, unprocessed foods to reduce the workload on your liver.'
  },
  {
    title: 'Heart-Healthy',
    icon: '❤️',
    good: ['Oily Fish (Omega-3)', 'Whole Grains', 'Avocados', 'Dark Chocolate (Low Sugar)', 'Beans'],
    avoid: ['Trans Fats (Bakery items)', 'Processed Meats', 'Excess Salt'],
    tip: 'Aim for 30 minutes of moderate activity daily to support heart function.'
  },
  {
    title: 'Thyroid-Balance',
    icon: '🦋',
    good: ['Roasted Seaweed (Iodine)', 'Brazil Nuts (Selenium)', 'Yogurt', 'Eggs', 'Chicken'],
    avoid: ['Raw Goitrogens (excess Kale/Soy)', 'Highly Processed Foods', 'Gluten (if sensitive)'],
    tip: 'Cooking cruciferous vegetables like broccoli reduces their impact on thyroid function.'
  }
];

const DIET_DATA_UR = [
  {
    title: 'ذیابیطس (شوگر) کے لیے',
    icon: '🩸',
    good: ['سبز پتوں والی سبزیاں (پالک)', 'اناج (جاؤ، دلیا)', 'دالیں اور پھلیاں', 'تھوڑے مقدار میں بیر', 'خشک میوہ جات'],
    avoid: ['میٹھے مشروبات', 'سفید ڈبل روٹی اور پاستا', 'بہت زیادہ تلی ہوئی چیزیں'],
    tip: 'کاربوہائیڈریٹ کو پروٹین کے ساتھ کھائیں تاکہ شوگر آہستہ جذب ہو۔'
  },
  {
    title: 'گردوں کی حفاظت',
    icon: '💧',
    good: ['گوبھی', 'بلیو بیریز', 'انڈے کی سفیدی', 'لہسن اور پیاز', 'زیتون کا تیل'],
    avoid: ['زیادہ نمک والی غذائیں', 'کیلا اور آلو (اگر پوٹاشیم منع ہو)', 'سیاہ کولا مشروبات'],
    tip: 'نمک کا استعمال کم کریں اور پانی مناسب مقدار میں پئیں۔'
  },
  {
    title: 'جگر کی بہتری',
    icon: '🍃',
    good: ['سبزیاں (بروکولی)', 'مچھلی (سامن)', 'اخروٹ', 'سبز چائے (Green Tea)', 'ایوکاڈو'],
    avoid: ['الکحل', 'چینی', 'سرخ گوشت کی چکنائی'],
    tip: 'قدرتی اور سادہ غذا کھائیں تاکہ جگر پر بوجھ نہ پڑے۔'
  },
  {
    title: 'دل کی صحت',
    icon: '❤️',
    good: ['مچھلی (اومیگا 3)', 'اناج', 'ایوکاڈو', 'ڈارک چاکلیٹ', 'پھلیاں'],
    avoid: ['بیکری کی اشیاء', 'پروسیسڈ گوشت', 'زیادہ نمک'],
    tip: 'دل کو مضبوط رکھنے کے لیے روزانہ 30 منٹ ہلکی ورزش کریں۔'
  },
  {
    title: 'تھائیرائیڈ توازن',
    icon: '🦋',
    good: ['سمندری غذا (آیوڈین)', 'برازیل نٹس (سیلینیم)', 'دہی', 'انڈے', 'مرغی'],
    avoid: ['کچی گوبھی (زیادہ مقدار میں)', 'بہت زیادہ پروسیسڈ کھانے', 'گلوٹن (اگر الرجی ہو)'],
    tip: 'سبزیوں کو پکا کر کھائیں تاکہ تھائیرائیڈ پر اثر نہ پڑے۔'
  }
];

const DIET_DATA_HI = [
  {
    title: 'मधुमेह (Diabetes) के लिए',
    icon: '🩸',
    good: ['हरी पत्तेदार सब्जियां (पालक)', 'साबुत अनाज (ओट्स, जौ)', 'दालें और फलियां', 'जामुन (सीमित मात्रा में)', 'मेवे और बीज'],
    avoid: ['मीठे पेय पदार्थ', 'सफेद ब्रेड और पास्ता', 'तला हुआ भोजन'],
    tip: 'कार्बोहाइड्रेट को प्रोटीन के साथ लें ताकि शुगर धीरे अवशोषित हो।'
  },
  {
    title: 'गुर्दे (Kidney) के लिए',
    icon: '💧',
    good: ['फूलगोभी', 'ब्लूबेरी', 'अंडे का सफेद भाग', 'लहसुन और प्याज', 'जैतून का तेल'],
    avoid: ['अधिक नमक वाले खाद्य पदार्थ', 'केला और आलू (यदि पोटेशियम मना हो)', 'कोला पेय'],
    tip: 'नमक का सेवन कम करें और उचित मात्रा में पानी पिएं।'
  },
  {
    title: 'लिवर (Liver) स्वास्थ्य',
    icon: '🍃',
    good: ['क्रूसिफेरस सब्जियां (ब्रोकोली)', 'मछली (सैल्मन)', 'अखरोट', 'ग्रीन टी', 'एवोकाडो'],
    avoid: ['शराब', 'चीनी', 'संतृप्त वसा (Red Meat)'],
    tip: 'प्राकृतिक और सादा भोजन खाएं ताकि लिवर पर भार न पड़े।'
  },
  {
    title: 'हृदय (Heart) स्वास्थ्य',
    icon: '❤️',
    good: ['मछली (ओमेगा-3)', 'साबुत अनाज', 'एवोकाडो', 'डार्क चॉकलेट', 'फलियां'],
    avoid: ['ट्रांस फैट्स (बेकरी आइटम)', 'प्रोसेस्ड मीट', 'अधिक नमक'],
    tip: 'दिल को स्वस्थ रखने के लिए रोजाना 30 मिनट व्यायाम करें।'
  },
  {
    title: 'थायराइड (Thyroid) संतुलन',
    icon: '🦋',
    good: ['समुद्री शैवाल (आयोडीन)', 'ब्राजील नट्स (सेलेनियम)', 'दही', 'अंडे', 'चिकन'],
    avoid: ['कच्ची गोभी (अधिक मात्रा में)', 'प्रोसेस्ड फूड', 'ग्लूटेन (यदि संवेदनशील हों)'],
    tip: 'सब्जियों को पकाकर खाएं ताकि थायराइड पर असर न पड़े।'
  }
];

const DIET_DATA_AR = [
  {
    title: 'صديقة لمرضى السكري',
    icon: '🩸',
    good: ['الخضروات الورقية (السبانخ)', 'الحبوب الكاملة (الشوفان)', 'الفاصوليا والعدس', 'التوت (باعتدال)', 'المكسرات والبذور'],
    avoid: ['المشروبات السكرية', 'الخبز الأبيض والمعكرونة', 'الأطعمة المقلية'],
    tip: 'تناول الكربوهيدرات مع البروتين لإبطاء امتصاص السكر.'
  },
  {
    title: 'صحة الكلى',
    icon: '💧',
    good: ['القرنبيط', 'التوت الأزرق', 'بياض البيض', 'الثوم والبصل', 'زيت الزيتون'],
    avoid: ['الأطعمة عالية الصوديوم', 'الموز والبطاطس (إذا كان البوتاسيوم مقيداً)', 'المشروبات الغازية الداكنة'],
    tip: 'قلل من تناول الملح واشرب الماء بانتظام.'
  },
  {
    title: 'دعم الكبد',
    icon: '🍃',
    good: ['الخضروات الصليبية (البروكلي)', 'الأسماك الدهنية (السلمون)', 'الجوز', 'الشاي الأخضر', 'الأفوكادو'],
    avoid: ['الكحول', 'السكريات المضافة', 'الدهون المشبعة'],
    tip: 'ركز على الأطعمة الكاملة غير المصنعة لتقليل العبء على الكبد.'
  },
  {
    title: 'صحة القلب',
    icon: '❤️',
    good: ['الأسماك الدهنية (أوميغا 3)', 'الحبوب الكاملة', 'الأفوكادو', 'الشوكولاتة الداكنة', 'الفاصوليا'],
    avoid: ['الدهون المتحولة (المخبوزات)', 'اللحوم المصنعة', 'الملح الزائد'],
    tip: 'مارس النشاط البدني المعتدل لمدة 30 دقيقة يومياً.'
  },
  {
    title: 'توازن الغدة الدرقية',
    icon: '🦋',
    good: ['الأعشاب البحرية (اليود)', 'المكسرات البرازيلية (السيلينيوم)', 'الزبادي', 'البيض', 'الدجاج'],
    avoid: ['الخضروات النيئة (بكميات كبيرة)', 'الأطعمة المصنعة جداً', 'الغلوتين (إذا كان لديك حساسية)'],
    tip: 'طبخ الخضروات مثل البروكلي يقلل من تأثيرها على الغدة الدرقية.'
  }
];

export const DietPlansView: React.FC<DietPlanProps> = ({ profile, onBack }) => {
  const getContent = () => {
    const lang = profile.language.toLowerCase();
    if (lang === 'urdu') return DIET_DATA_UR;
    if (lang === 'hindi') return DIET_DATA_HI;
    if (lang === 'arabic') return DIET_DATA_AR;
    return DIET_DATA_EN;
  };

  const content = getContent();
  const isRTL = profile.language.toLowerCase() === 'urdu' || profile.language.toLowerCase() === 'arabic';

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up pb-20">
      <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
           <h2 className="text-3xl font-bold text-slate-800">
             {isRTL ? 'غذائی منصوبہ' : 'Diet Plans'}
           </h2>
           <p className="text-slate-500">
             {isRTL ? 'عام صحت کے لیے محفوظ غذائی رہنمائی۔' : 'General safe food guides for common needs.'}
           </p>
        </div>
        <button onClick={onBack} className="px-4 py-2 bg-white border border-brand-200 text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition">
          {isRTL ? 'واپس' : 'Back'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {content.map((plan, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:border-brand-200 transition-colors">
            <div className={`flex items-center gap-3 mb-4 border-b border-slate-100 pb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-2xl bg-brand-50 w-10 h-10 flex items-center justify-center rounded-full">{plan.icon}</span>
              <h3 className="text-lg font-bold text-slate-800">{plan.title}</h3>
            </div>
            
            <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
              <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-2">{isRTL ? '✅ بہتر ہے' : '✅ Prefer'}</p>
              <ul className="text-sm text-slate-600 space-y-1">
                {plan.good.map((item, i) => (
                  <li key={i} className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className={isRTL ? "ml-2" : "mr-2"}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
              <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-2">{isRTL ? '❌ پرہیز کریں' : '❌ Limit / Avoid'}</p>
              <ul className="text-sm text-slate-600 space-y-1">
                {plan.avoid.map((item, i) => (
                  <li key={i} className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className={isRTL ? "ml-2" : "mr-2"}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className={`bg-slate-50 p-3 rounded-xl border border-slate-100 ${isRTL ? 'text-right' : ''}`}>
              <p className="text-xs font-medium text-slate-500 italic">💡 {plan.tip}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-400 bg-slate-50 inline-block px-4 py-2 rounded-full border border-slate-100">
          * {isRTL ? 'یہ صرف تعلیمی مشورے ہیں، ڈاکٹر سے رجوع کریں۔' : 'These are general educational suggestions and not a substitute for medical advice.'}
        </p>
      </div>
    </div>
  );
};
