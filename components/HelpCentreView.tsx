
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface HelpCentreProps {
  profile: UserProfile;
  onBack: () => void;
}

const HELP_DATA_EN = {
  faqLabel: 'Frequently Asked Questions',
  glossaryLabel: 'Medical Glossary',
  aboutLabel: 'About MyHealthLens AI',
  aboutText: 'We aim to empower you with educational health insights. Our AI is designed to explain complex medical reports in simple language, considering your cultural and regional context.',
  faqs: [
    { q: 'How do I upload a report?', a: 'Go to "Upload Report". You can take a photo or upload an image/PDF.' },
    { q: 'What do "Eat" and "Do" mean?', a: '"Eat" suggests foods to help. "Do" suggests lifestyle changes.' },
    { q: 'Is my data safe?', a: 'Yes. Images are stored locally on your device history.' },
    { q: 'Can I print my report?', a: 'Yes. Use the "Print Report" button on the results page.' },
  ],
  glossary: [
    { term: 'HbA1c', def: 'Average blood sugar over 3 months.' },
    { term: 'Lipid Profile', def: 'Tests for cholesterol and fats.' },
    { term: 'CBC', def: 'Complete Blood Count (cells & platelets).' },
    { term: 'TSH', def: 'Thyroid hormone level check.' },
    { term: 'LFT', def: 'Liver health tests.' },
  ]
};

const HELP_DATA_UR = {
  faqLabel: 'عام پوچھے گئے سوالات',
  glossaryLabel: 'طبی اصطلاحات',
  aboutLabel: 'مائی ہیلتھ لینس کے بارے میں',
  aboutText: 'ہمارا مقصد آپ کو صحت کی معلومات فراہم کرنا ہے۔ ہمارا AI آپ کی رپورٹس کو آسان زبان میں سمجھاتا ہے۔',
  faqs: [
    { q: 'رپورٹ کیسے اپلوڈ کریں؟', a: '"رپورٹ اپلوڈ" پر جائیں۔ آپ تصویر لے سکتے ہیں یا فائل اپلوڈ کر سکتے ہیں۔' },
    { q: '"Eat" اور "Do" کا کیا مطلب ہے؟', a: '"Eat" میں مفید غذائیں اور "Do" میں طرز زندگی کے مشورے ہوتے ہیں۔' },
    { q: 'کیا میرا ڈیٹا محفوظ ہے؟', a: 'جی ہاں۔ آپ کی تصاویر صرف آپ کے ڈیوائس میں محفوظ رہتی ہیں۔' },
    { q: 'کیا میں رپورٹ پرنٹ کر سکتا ہوں؟', a: 'جی ہاں۔ نتائج کے صفحے پر "Print" کا بٹن استعمال کریں۔' },
  ],
  glossary: [
    { term: 'HbA1c', def: 'پچھلے 3 ماہ کی اوسط شوگر۔' },
    { term: 'Lipid Profile', def: 'کولیسٹرول اور چکنائی کا ٹیسٹ۔' },
    { term: 'CBC', def: 'خون کے خلیات کی مکمل گنتی۔' },
    { term: 'TSH', def: 'تھائیرائیڈ ہارمون کا ٹیسٹ۔' },
    { term: 'LFT', def: 'جگر کی صحت کے ٹیسٹ۔' },
  ]
};

const HELP_DATA_HI = {
  faqLabel: 'अक्सर पूछे जाने वाले प्रश्न',
  glossaryLabel: 'चिकित्सा शब्दावली',
  aboutLabel: 'MyHealthLens AI के बारे में',
  aboutText: 'हमारा उद्देश्य आपको स्वास्थ्य जानकारी देना है। हमारा AI आपकी रिपोर्ट को सरल भाषा में समझाता है।',
  faqs: [
    { q: 'रिपोर्ट कैसे अपलोड करें?', a: '"अपलोड रिपोर्ट" पर जाएं। आप फोटो ले सकते हैं या फाइल अपलोड कर सकते हैं।' },
    { q: '"Eat" और "Do" का क्या अर्थ है?', a: '"Eat" में भोजन और "Do" में जीवनशैली के सुझाव होते हैं।' },
    { q: 'क्या मेरा डेटा सुरक्षित है?', a: 'हाँ। आपकी रिपोर्ट केवल आपके डिवाइस पर सुरक्षित रहती है।' },
    { q: 'क्या मैं रिपोर्ट प्रिंट कर सकता हूँ?', a: 'हाँ। परिणाम पृष्ठ पर "Print" बटन का उपयोग करें।' },
  ],
  glossary: [
    { term: 'HbA1c', def: 'पिछले 3 महीनों की औसत शुगर।' },
    { term: 'Lipid Profile', def: 'कोलेस्ट्रॉल और वसा की जांच।' },
    { term: 'CBC', def: 'पूर्ण रक्त गणना (Complete Blood Count)।' },
    { term: 'TSH', def: 'थायराइड हार्मोन की जांच।' },
    { term: 'LFT', def: 'लिवर स्वास्थ्य परीक्षण।' },
  ]
};

const HELP_DATA_AR = {
  faqLabel: 'الأسئلة الشائعة',
  glossaryLabel: 'المصطلحات الطبية',
  aboutLabel: 'عن MyHealthLens AI',
  aboutText: 'هدفنا هو تزويدك بمعلومات صحية تعليمية. يشرح الذكاء الاصطناعي تقاريرك بلغة بسيطة.',
  faqs: [
    { q: 'كيف أقوم بتحميل تقرير؟', a: 'انتقل إلى "تحميل تقرير". يمكنك التقاط صورة أو تحميل ملف.' },
    { q: 'ماذا تعني "Eat" و "Do"؟', a: '"Eat" تقترح أطعمة مفيدة، و "Do" تقترح تغييرات في نمط الحياة.' },
    { q: 'هل بياناتي آمنة؟', a: 'نعم. يتم تخزين الصور محلياً على جهازك فقط.' },
    { q: 'هل يمكنني طباعة التقرير؟', a: 'نعم. استخدم زر "طباعة" في صفحة النتائج.' },
  ],
  glossary: [
    { term: 'HbA1c', def: 'متوسط السكر في الدم خلال 3 أشهر.' },
    { term: 'Lipid Profile', def: 'فحوصات الكوليسترول والدهون.' },
    { term: 'CBC', def: 'تعداد الدم الكامل.' },
    { term: 'TSH', def: 'فحص هرمون الغدة الدرقية.' },
    { term: 'LFT', def: 'فحوصات وظائف الكبد.' },
  ]
};

export const HelpCentreView: React.FC<HelpCentreProps> = ({ profile, onBack }) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'glossary'>('faq');

  const getContent = () => {
    const lang = profile.language.toLowerCase();
    if (lang === 'urdu') return HELP_DATA_UR;
    if (lang === 'hindi') return HELP_DATA_HI;
    if (lang === 'arabic') return HELP_DATA_AR;
    return HELP_DATA_EN;
  };

  const content = getContent();
  const isRTL = profile.language.toLowerCase() === 'urdu' || profile.language.toLowerCase() === 'arabic';

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up pb-20">
      <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
           <h2 className="text-3xl font-bold text-slate-800">{isRTL ? 'ہیلپ سینٹر' : 'Help Centre'}</h2>
           <p className="text-slate-500">{isRTL ? 'معلومات، سوالات اور اصطلاحات۔' : 'Support, FAQs, and Medical Terms.'}</p>
        </div>
        <button onClick={onBack} className="px-4 py-2 bg-white border border-brand-200 text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition">
          {isRTL ? 'واپس' : 'Back'}
        </button>
      </div>

      <div className={`flex gap-4 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button 
          onClick={() => setActiveTab('faq')}
          className={`flex-1 py-3 rounded-xl font-bold transition ${activeTab === 'faq' ? 'bg-brand-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
        >
          {content.faqLabel}
        </button>
        <button 
          onClick={() => setActiveTab('glossary')}
          className={`flex-1 py-3 rounded-xl font-bold transition ${activeTab === 'glossary' ? 'bg-brand-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
        >
          {content.glossaryLabel}
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 min-h-[400px]">
        {activeTab === 'faq' ? (
          <div className="space-y-6">
            {content.faqs.map((item, idx) => (
              <div key={idx} className={`border-b border-slate-50 last:border-0 pb-4 last:pb-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className="font-bold text-slate-800 mb-2">{item.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <p className={`text-xs text-slate-400 uppercase tracking-wide mb-4 ${isRTL ? 'text-right' : ''}`}>{content.glossaryLabel}</p>
            {content.glossary.map((item, idx) => (
              <div key={idx} className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 p-3 rounded-xl hover:bg-slate-50 transition ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <span className="font-bold text-brand-700 min-w-[100px]">{item.term}</span>
                <span className="text-sm text-slate-600">{item.def}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className={`mt-8 p-6 bg-brand-50 rounded-2xl border border-brand-100 ${isRTL ? 'text-right' : 'text-center'}`}>
        <h4 className="font-bold text-brand-800 mb-2">{content.aboutLabel}</h4>
        <p className="text-sm text-brand-700 leading-relaxed max-w-lg mx-auto">
          {content.aboutText}
        </p>
      </div>
    </div>
  );
};
