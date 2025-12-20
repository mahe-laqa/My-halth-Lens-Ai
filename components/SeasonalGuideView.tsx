
import React from 'react';
import { UserProfile } from '../types';

interface SeasonalGuideProps {
  profile: UserProfile;
  onBack: () => void;
}

const SEASON_DATA_EN = {
  winter: { title: 'Winter Care', icon: '❄️', tips: ['Hydration: We often drink less water in cold weather. Keep sipping warm water.', 'Skin Protection: Cold air dries skin. Use moisturizers and sunscreen.', 'Immunity: Include Vitamin C rich foods (Oranges, Guavas) to help fight flu.'] },
  summer: { title: 'Summer Safety', icon: '☀️', tips: ['Heat Stroke: Avoid direct sun between 12 PM - 3 PM. Wear light cotton.', 'Electrolytes: Sweat causes mineral loss. Coconut water or lemonade helps.', 'Food Safety: Food spoils quickly in heat. Refrigerate perishables immediately.'] },
  monsoon: { title: 'Monsoon / Rainy', icon: '🌧️', tips: ['Mosquito Safety: Use repellents to prevent Dengue/Malaria.', 'Water Hygiene: Boil water or use a purifier. Avoid street food.', 'Dryness: Keep feet dry to prevent fungal infections.'] },
  allergy: { title: 'Allergy Season', icon: '🌸', tips: ['Pollen: Keep windows closed on windy days if you have allergies.', 'Bedding: Wash bed sheets in hot water weekly.', 'Masks: Wear a mask outdoors if pollen count is high.'] }
};

const SEASON_DATA_UR = {
  winter: { title: 'موسم سرما کی دیکھ بھال', icon: '❄️', tips: ['پانی پینا: سردیوں میں ہم کم پانی پیتے ہیں۔ گرم پانی یا قہوہ پیتے رہیں۔', 'جلد کی حفاظت: سرد ہوا جلد خشک کرتی ہے۔ موئسچرائزر کا استعمال کریں۔', 'قوت مدافعت: وٹامن سی والی غذائیں (مالٹا، امرود) کھائیں تاکہ فلو سے بچ سکیں۔'] },
  summer: { title: 'موسم گرما کی احتیاط', icon: '☀️', tips: ['لو سے بچاؤ: دوپہر 12 سے 3 بجے تک دھوپ میں نکلنے سے گریز کریں۔', 'نمکیات: پسینے سے نمکیات ضائع ہوتے ہیں۔ لیموں پانی یا ناریل پانی پئیں۔', 'کھانے کی حفاظت: گرمی میں کھانا جلدی خراب ہوتا ہے۔ اسے فوراً فریج میں رکھیں۔'] },
  monsoon: { title: 'برسات / مون سون', icon: '🌧️', tips: ['مچھروں سے بچاؤ: ڈینگی سے بچنے کے لیے مچھر مار سپرے استعمال کریں۔', 'پانی کی صفائی: پانی ابال کر پئیں اور بازاری کھانوں سے پرہیز کریں۔', 'خشکی: پاؤں گیلے نہ رہنے دیں تاکہ انفیکشن نہ ہو۔'] },
  allergy: { title: 'الرجی کا موسم', icon: '🌸', tips: ['پولن: اگر آپ کو الرجی ہے تو تیز ہوا میں کھڑکیاں بند رکھیں۔', 'بستر: چادریں ہفتے میں ایک بار گرم پانی سے دھوئیں تاکہ جراثیم ختم ہوں۔', 'ماسک: باہر جاتے وقت ماسک پہنیں اگر پولن زیادہ ہو۔'] }
};

const SEASON_DATA_HI = {
  winter: { title: 'सर्दी की देखभाल', icon: '❄️', tips: ['हाइड्रेशन: सर्दियों में हम कम पानी पीते हैं। गुनगुना पानी पीते रहें।', 'त्वचा की सुरक्षा: ठंडी हवा त्वचा को रूखा बनाती है। मॉइस्चराइजर का उपयोग करें।', 'प्रतिरक्षा: फ्लू से बचने के लिए विटामिन सी युक्त भोजन (संतरा, अमरूद) लें।'] },
  summer: { title: 'गर्मी से सुरक्षा', icon: '☀️', tips: ['हीट स्ट्रोक: दोपहर 12 से 3 बजे के बीच सीधी धूप से बचें।', 'इलेक्ट्रोलाइट्स: पसीने से खनिज कम हो जाते हैं। नारियल पानी या शिकंजी पिएं।', 'खाद्य सुरक्षा: गर्मी में खाना जल्दी खराब होता है। इसे तुरंत फ्रिज में रखें।'] },
  monsoon: { title: 'मानसून / बारिश', icon: '🌧️', tips: ['मच्छरों से सुरक्षा: डेंगू से बचने के लिए रिपेलेंट्स का उपयोग करें।', 'पानी की स्वच्छता: पानी उबालकर पिएं और स्ट्रीट फूड से बचें।', 'सूखापन: फंगल इन्फेक्शन से बचने के लिए पैरों को सूखा रखें।'] },
  allergy: { title: 'एलर्जी का मौसम', icon: '🌸', tips: ['पराग: यदि आपको एलर्जी है तो हवा वाले दिनों में खिड़कियां बंद रखें।', 'बिस्तर: धूल के कणों को कम करने के लिए चादरें गर्म पानी से धोएं।', 'मास्क: बाहर जाते समय मास्क पहनें।'] }
};

const SEASON_DATA_AR = {
  winter: { title: 'العناية في الشتاء', icon: '❄️', tips: ['الترطيب: غالباً ما نشرب كميات أقل من الماء في الشتاء. استمر في شرب الماء الدافئ.', 'حماية الجلد: الهواء البارد يجفف الجلد. استخدم المرطبات.', 'المناعة: تناول الأطعمة الغنية بفيتامين سي (البرتقال) لمحاربة الانفلونزا.'] },
  summer: { title: 'سلامة الصيف', icon: '☀️', tips: ['ضربة الشمس: تجنب الشمس المباشرة بين الساعة 12 و 3 مساءً.', 'الشوارد: يسبب التعرق فقدان المعادن. اشرب ماء جوز الهند أو عصير الليمون.', 'سلامة الغذاء: يفسد الطعام بسرعة في الحرارة. ضعه في الثلاجة فوراً.'] },
  monsoon: { title: 'احتياطات المطر', icon: '🌧️', tips: ['الحماية من البعوض: استخدم طارد الحشرات لمنع حمى الضنك.', 'نظافة المياه: اغلي الماء أو استخدم منقياً. تجنب أطعمة الشارع.', 'الجفاف: حافظ على جفاف القدمين لمنع الالتهابات الفطرية.'] },
  allergy: { title: 'موسم الحساسية', icon: '🌸', tips: ['حبوب اللقاح: أغلق النوافذ في الأيام العاصفة إذا كنت تعاني من الحساسية.', 'الفراش: اغسل ملاءات السرير بالماء الساخن أسبوعياً.', 'الكمامة: ارتدِ كمامة في الخارج إذا كان مستوى الغبار عالياً.'] }
};

export const SeasonalGuideView: React.FC<SeasonalGuideProps> = ({ profile, onBack }) => {
  const getSeasonContent = () => {
    const lang = profile.language.toLowerCase();
    let data = SEASON_DATA_EN;
    if (lang === 'urdu') data = SEASON_DATA_UR;
    if (lang === 'hindi') data = SEASON_DATA_HI;
    if (lang === 'arabic') data = SEASON_DATA_AR;
    
    // Logic remains same, just fetching translated strings
    const month = new Date().getMonth();
    let currentSeasonKey: keyof typeof SEASON_DATA_EN = 'winter';
    let currentSeasonLabel = 'Winter';
    
    if (month >= 2 && month <= 4) { currentSeasonKey = 'allergy'; currentSeasonLabel = 'Spring'; }
    else if (month >= 5 && month <= 8) { currentSeasonKey = 'summer'; currentSeasonLabel = 'Summer'; }
    else if (month >= 9 && month <= 10) { currentSeasonKey = 'allergy'; currentSeasonLabel = 'Autumn'; }
    else { currentSeasonKey = 'winter'; currentSeasonLabel = 'Winter'; }

    return { 
      currentSeasonLabel, 
      seasonData: data[currentSeasonKey],
      allData: data
    };
  };

  const { currentSeasonLabel, seasonData, allData } = getSeasonContent();
  const isRTL = profile.language.toLowerCase() === 'urdu' || profile.language.toLowerCase() === 'arabic';

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up pb-20">
      <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
           <h2 className="text-3xl font-bold text-slate-800">{isRTL ? 'موسمی رہنما' : 'Seasonal Guide'}</h2>
           <p className="text-slate-500">
             {isRTL ? `${profile.country} کے لیے موسمی صحت کے مشورے۔` : `Health tips for ${currentSeasonLabel} in ${profile.country}.`}
           </p>
        </div>
        <button onClick={onBack} className="px-4 py-2 bg-white border border-brand-200 text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition">
          {isRTL ? 'واپس' : 'Back'}
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Highlighted Current Season */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-md border-2 border-brand-200 transform scale-[1.02]">
          <div className={`bg-brand-600 p-4 border-b border-brand-700 flex items-center gap-3 text-white ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-3xl">{seasonData.icon}</span>
            <h3 className="font-bold text-lg">{seasonData.title} <span className="text-brand-200 text-sm font-normal">({isRTL ? 'موجودہ موسم' : 'Current'})</span></h3>
          </div>
          <div className="p-6">
            <ul className="space-y-4 text-slate-700 text-sm">
              {seasonData.tips.map((tip, idx) => (
                <li key={idx} className={`flex gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <span className="text-brand-500 font-bold text-lg">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Other Seasons (Simplified View) */}
        <h3 className={`text-sm font-bold text-slate-400 uppercase tracking-wide pt-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          {isRTL ? 'دیگر موسم' : 'Other Seasons'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(allData).map(([key, data]) => {
            if (data.title === seasonData.title) return null;
            return (
              <div key={key} className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-brand-200 transition">
                <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xl">{data.icon}</span>
                  <h4 className="font-bold text-slate-700">{data.title}</h4>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                   {data.tips.slice(0, 2).map((tip, i) => (
                     <li key={i} className={`flex gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                       <span className="text-slate-300">•</span>
                       <span className="line-clamp-2">{tip}</span>
                     </li>
                   ))}
                </ul>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
