'use client';

import Input from '@/components/ui/Input';

interface ShippingFormProps {
  data: { fullName: string; email: string; phone: string; address: string; city: string; postalCode: string; country: string };
  onChange: (data: any) => void;
  errors: Record<string, string>;
}

export default function ShippingForm({ data, onChange, errors }: ShippingFormProps) {
  const fields = [
    { key: 'fullName', label: 'Ad Soyad', placeholder: 'Ad Soyad', type: 'text' },
    { key: 'email', label: 'E-poçt', placeholder: 'email@example.com', type: 'email' },
    { key: 'phone', label: 'Telefon', placeholder: '+994 (50) 000-00-00', type: 'tel' },
    { key: 'address', label: 'Ünvan', placeholder: 'Küçə, ev, mənzil', type: 'text' },
    { key: 'city', label: 'Şəhər', placeholder: 'Bakı', type: 'text' },
    { key: 'postalCode', label: 'Poçt Kodu', placeholder: 'AZ1000', type: 'text' },
    { key: 'country', label: 'Ölkə', placeholder: 'Azərbaycan', type: 'text' },
  ];

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-light text-charcoal tracking-wide">Çatdırılma Məlumatları</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map(({ key, label, placeholder, type }) => (
          <div key={key} className={key === 'address' ? 'md:col-span-2' : ''}>
            <Input
              label={label}
              placeholder={placeholder}
              type={type}
              value={(data as any)[key]}
              onChange={(e) => onChange({ ...data, [key]: e.target.value })}
              error={errors[key]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
