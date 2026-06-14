"use client"
import { useState } from "react"

const categories = {
  "الحلول الرقمية": ["ريشة", "الأثير", "إرث", "حلول"],
  "الخدمات والأعمال": ["سند", "صنعة", "ميدان"],
  "المعرفة والتطوير": ["مداد", "مهارة"],
  "المجتمع": ["عون"]
}

export function AddProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: ""
  })

  return (
    <div className="flex flex-col gap-4 p-6 max-w-2xl mx-auto border rounded-2xl shadow-sm" dir="rtl">
      <h2 className="text-xl font-bold mb-4">البيانات</h2>
      
      <input 
        type="text" 
        placeholder="اسم المنتج *" 
        className="p-3 border rounded-xl"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />

      <select 
        value={formData.category} 
        onChange={(e) => setFormData({...formData, category: e.target.value, subcategory: ""})} 
        className="p-3 border rounded-xl bg-gray-50"
      >
        <option value="">اختر القسم الرئيسي *</option>
        {Object.keys(categories).map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      
      {formData.category && (
        <select 
          value={formData.subcategory} 
          onChange={(e) => setFormData({...formData, subcategory: e.target.value})} 
          className="p-3 border rounded-xl bg-gray-50"
        >
          <option value="">اختر القسم الفرعي *</option>
          {categories[formData.category as keyof typeof categories].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      )}

      <textarea 
        placeholder="الوصف *" 
        className="p-3 border rounded-xl h-32"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
      />
      
      <input 
        type="number" 
        placeholder="السعر (ر.س) *" 
        className="p-3 border rounded-xl"
        value={formData.price}
        onChange={(e) => setFormData({...formData, price: e.target.value})}
      />
      
      <button className="bg-blue-900 text-white p-4 rounded-xl font-bold mt-4 hover:bg-blue-800 transition-colors">
        التالي
      </button>
    </div>
  )
}
