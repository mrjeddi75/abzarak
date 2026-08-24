'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Trash2, Printer } from 'lucide-react';
import { toPersianDigits } from '@/lib/jalali';

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  items: InvoiceItem[];
  taxRate: number;
  discount: number;
  notes: string;
  currency: string;
}

const defaultInvoice: InvoiceData = {
  invoiceNumber: 'INV-001',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  senderName: '',
  senderPhone: '',
  senderAddress: '',
  clientName: '',
  clientPhone: '',
  clientAddress: '',
  items: [{ id: 1, description: '', quantity: 1, unitPrice: 0 }],
  taxRate: 9,
  discount: 0,
  notes: '',
  currency: 'تومان',
};

export default function PDFInvoice() {
  const [data, setData] = useState<InvoiceData>(defaultInvoice);
  const [preview, setPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const update = (field: keyof InvoiceData, value: string | number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), description: '', quantity: 1, unitPrice: 0 }],
    }));
  };

  const removeItem = (id: number) => {
    if (data.items.length <= 1) return;
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const discountAmount = (subtotal * data.discount) / 100;
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = (afterDiscount * data.taxRate) / 100;
  const total = afterDiscount + taxAmount;

  const handlePrint = async () => {
    setPreview(true);
    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      if (!printWindow || !printRef.current) return;
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
          <meta charset="UTF-8">
          <title>فاکتور ${data.invoiceNumber}</title>
          <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Vazirmatn', sans-serif; padding: 40px; color: #1a1a1a; background: #fff; }
            .invoice { max-width: 800px; margin: 0 auto; border: 2px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; }
            .header h1 { font-size: 28px; font-weight: 700; }
            .header p { opacity: 0.9; font-size: 14px; margin-top: 4px; }
            .body { padding: 30px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 30px; }
            .info-box { background: #f9fafb; border-radius: 8px; padding: 16px; }
            .info-box h3 { font-size: 12px; color: #6b7280; margin-bottom: 8px; font-weight: 600; }
            .info-box p { font-size: 14px; line-height: 1.8; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            th { background: #f3f4f6; padding: 12px 16px; text-align: right; font-size: 13px; font-weight: 600; color: #374151; }
            td { padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
            tr:last-child td { border-bottom: none; }
            .totals { display: flex; justify-content: flex-end; }
            .totals-table { width: 300px; }
            .totals-table tr td { padding: 8px 0; border-bottom: 1px dashed #e5e7eb; }
            .totals-table tr:last-child td { border-bottom: none; }
            .totals-table .total-row td { font-size: 18px; font-weight: 700; color: #6366f1; border-bottom: none; }
            .notes { background: #f9fafb; border-radius: 8px; padding: 16px; margin-top: 24px; }
            .notes h3 { font-size: 13px; color: #6b7280; margin-bottom: 8px; }
            .notes p { font-size: 14px; line-height: 1.8; color: #374151; }
            .footer { text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          ${printRef.current.innerHTML}
          <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }, 100);
  };

  const fmt = (n: number) => {
    try { return n.toLocaleString('fa-IR'); } catch { return String(n); }
  };

  const inputCls = 'w-full h-10 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)]';
  const labelCls = 'block text-sm font-medium text-foreground mb-1';

  return (
    <div className="space-y-4">
      <div className="glass-card glow-effect p-4">
        <div className="flex flex-wrap gap-2">
          {(['تومان', 'ریال', 'دلار', 'یورو'] as const).map(c => (
            <Button
              key={c}
              variant={data.currency === c ? 'default' : 'outline'}
              size="sm"
              onClick={() => update('currency', c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>شماره فاکتور</label>
          <input value={data.invoiceNumber} onChange={e => update('invoiceNumber', e.target.value)} dir="ltr" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>تاریخ صدور</label>
          <input type="date" value={data.invoiceDate} onChange={e => update('invoiceDate', e.target.value)} dir="ltr" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>تاریخ سررسید</label>
          <input type="date" value={data.dueDate} onChange={e => update('dueDate', e.target.value)} dir="ltr" className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card glow-effect p-4">
          <h3 className="text-lg font-bold mb-3">اطلاعات صادرکننده</h3>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>نام / شرکت</label>
              <input value={data.senderName} onChange={e => update('senderName', e.target.value)} placeholder="نام فروشنده" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>تلفن</label>
              <input value={data.senderPhone} onChange={e => update('senderPhone', e.target.value)} placeholder="شماره تماس" dir="ltr" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>آدرس</label>
              <textarea value={data.senderAddress} onChange={e => update('senderAddress', e.target.value)} placeholder="آدرس" className={`${inputCls} min-h-[60px] resize-y`} />
            </div>
          </div>
        </div>

        <div className="glass-card glow-effect p-4">
          <h3 className="text-lg font-bold mb-3">اطلاعات مشتری</h3>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>نام / شرکت</label>
              <input value={data.clientName} onChange={e => update('clientName', e.target.value)} placeholder="نام مشتری" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>تلفن</label>
              <input value={data.clientPhone} onChange={e => update('clientPhone', e.target.value)} placeholder="شماره تماس" dir="ltr" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>آدرس</label>
              <textarea value={data.clientAddress} onChange={e => update('clientAddress', e.target.value)} placeholder="آدرس" className={`${inputCls} min-h-[60px] resize-y`} />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card glow-effect p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">آیتم‌های فاکتور</h3>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 ml-1" />
            افزودن ردیف
          </Button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground font-medium px-1">
            <div className="col-span-5">شرح</div>
            <div className="col-span-2">تعداد</div>
            <div className="col-span-3">قیمت واحد ({data.currency})</div>
            <div className="col-span-1">حذف</div>
          </div>
          {data.items.map(item => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5">
                <input
                  value={item.description}
                  onChange={e => updateItem(item.id, 'description', e.target.value)}
                  placeholder="شرح آیتم..."
                  className={inputCls}
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  dir="ltr"
                  className={inputCls}
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  min="0"
                  value={item.unitPrice}
                  onChange={e => updateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                  dir="ltr"
                  placeholder="0"
                  className={inputCls}
                />
              </div>
              <div className="col-span-1">
                <button
                  className="inline-flex items-center justify-center h-9 w-9 rounded-md text-sm transition-colors hover:bg-accent disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  onClick={() => removeItem(item.id)}
                  disabled={data.items.length <= 1}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card glow-effect p-4">
          <h3 className="text-lg font-bold mb-3">مالیات و تخفیف</h3>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>نرخ مالیات ({toPersianDigits(data.taxRate)}٪)</label>
              <input
                type="range"
                min="0"
                max="30"
                step="0.5"
                value={data.taxRate}
                onChange={e => update('taxRate', parseFloat(e.target.value))}
                className="w-full mt-1"
              />
            </div>
            <div>
              <label className={labelCls}>تخفیف ({toPersianDigits(data.discount)}٪)</label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={data.discount}
                onChange={e => update('discount', parseFloat(e.target.value))}
                className="w-full mt-1"
              />
            </div>
          </div>
        </div>

        <div className="glass-card glow-effect p-4">
          <h3 className="text-lg font-bold mb-3">یادداشت</h3>
          <textarea
            value={data.notes}
            onChange={e => update('notes', e.target.value)}
            placeholder="توضیحات یا یادداشت اضافی..."
            className={`${inputCls} min-h-[80px] resize-y`}
          />
        </div>
      </div>

      <div className="glass-card glow-effect p-6">
        <div className="max-w-sm mr-auto space-y-2">
          <div className="flex justify-between text-sm">
            <span>جمع کل</span>
            <span>{fmt(subtotal)} {data.currency}</span>
          </div>
          {data.discount > 0 && (
            <div className="flex justify-between text-sm text-red-500">
              <span>تخفیف ({toPersianDigits(data.discount)}٪)</span>
              <span>-{fmt(discountAmount)} {data.currency}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>مالیات ({toPersianDigits(data.taxRate)}٪)</span>
            <span>{fmt(taxAmount)} {data.currency}</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-lg font-bold">
            <span>مبلغ نهایی</span>
            <span className="text-primary">{fmt(total)} {data.currency}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 ml-2" />
          چاپ / ذخیره PDF
        </Button>
        <Button variant="outline" onClick={() => setPreview(!preview)}>
          <FileText className="h-4 w-4 ml-2" />
          {preview ? 'بستن پیش‌نمایش' : 'پیش‌نمایش فاکتور'}
        </Button>
      </div>

      {preview && (
        <div className="glass-card glow-effect overflow-hidden">
          <div ref={printRef}>
            <div className="invoice" style={{ fontFamily: "'Vazirmatn', sans-serif", maxWidth: 800, margin: '0 auto', border: '2px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700 }}>فاکتور</h1>
                    <p style={{ opacity: 0.9, fontSize: 14, marginTop: 4 }}>شماره: {data.invoiceNumber}</p>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: 14, opacity: 0.9 }}>تاریخ صدور: {data.invoiceDate}</p>
                    {data.dueDate && <p style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>سررسید: {data.dueDate}</p>}
                  </div>
                </div>
              </div>

              <div style={{ padding: 30 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 30 }}>
                  <div style={{ background: '#f9fafb', borderRadius: 8, padding: 16 }}>
                    <h3 style={{ fontSize: 12, color: '#6b7280', marginBottom: 8, fontWeight: 600 }}>صادرکننده</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.8 }}>
                      {data.senderName || '-'}
                      {data.senderPhone && <><br />{data.senderPhone}</>}
                      {data.senderAddress && <><br />{data.senderAddress}</>}
                    </p>
                  </div>
                  <div style={{ background: '#f9fafb', borderRadius: 8, padding: 16 }}>
                    <h3 style={{ fontSize: 12, color: '#6b7280', marginBottom: 8, fontWeight: 600 }}>مشتری</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.8 }}>
                      {data.clientName || '-'}
                      {data.clientPhone && <><br />{data.clientPhone}</>}
                      {data.clientAddress && <><br />{data.clientAddress}</>}
                    </p>
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
                  <thead>
                    <tr>
                      <th style={{ background: '#f3f4f6', padding: '12px 16px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#374151' }}>ردیف</th>
                      <th style={{ background: '#f3f4f6', padding: '12px 16px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#374151' }}>شرح</th>
                      <th style={{ background: '#f3f4f6', padding: '12px 16px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#374151' }}>تعداد</th>
                      <th style={{ background: '#f3f4f6', padding: '12px 16px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#374151' }}>قیمت واحد</th>
                      <th style={{ background: '#f3f4f6', padding: '12px 16px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#374151' }}>جمع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((item, i) => (
                      <tr key={item.id}>
                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontSize: 14 }}>{toPersianDigits(i + 1)}</td>
                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontSize: 14 }}>{item.description || '-'}</td>
                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontSize: 14, textAlign: 'center' }}>{toPersianDigits(item.quantity)}</td>
                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontSize: 14, textAlign: 'center' }}>{fmt(item.unitPrice)}</td>
                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontSize: 14, textAlign: 'center', fontWeight: 600 }}>{fmt(item.quantity * item.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <table style={{ width: 280 }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px 0', borderBottom: '1px dashed #e5e7eb', fontSize: 14 }}>جمع کل</td>
                        <td style={{ padding: '8px 0', borderBottom: '1px dashed #e5e7eb', fontSize: 14, textAlign: 'left' }}>{fmt(subtotal)} {data.currency}</td>
                      </tr>
                      {data.discount > 0 && (
                        <tr>
                          <td style={{ padding: '8px 0', borderBottom: '1px dashed #e5e7eb', fontSize: 14, color: '#ef4444' }}>تخفیف ({toPersianDigits(data.discount)}٪)</td>
                          <td style={{ padding: '8px 0', borderBottom: '1px dashed #e5e7eb', fontSize: 14, textAlign: 'left', color: '#ef4444' }}>-{fmt(discountAmount)} {data.currency}</td>
                        </tr>
                      )}
                      <tr>
                        <td style={{ padding: '8px 0', borderBottom: '1px dashed #e5e7eb', fontSize: 14 }}>مالیات ({toPersianDigits(data.taxRate)}٪)</td>
                        <td style={{ padding: '8px 0', borderBottom: '1px dashed #e5e7eb', fontSize: 14, textAlign: 'left' }}>{fmt(taxAmount)} {data.currency}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '12px 0', fontSize: 20, fontWeight: 700, color: '#6366f1' }}>مبلغ نهایی</td>
                        <td style={{ padding: '12px 0', fontSize: 20, fontWeight: 700, color: '#6366f1', textAlign: 'left' }}>{fmt(total)} {data.currency}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {data.notes && (
                  <div style={{ background: '#f9fafb', borderRadius: 8, padding: 16, marginTop: 24 }}>
                    <h3 style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>یادداشت</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>{data.notes}</p>
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'center', padding: 20, borderTop: '1px solid #e5e7eb', color: '#9ca3af', fontSize: 12 }}>
                تولید شده توسط ابزارک | ابزارک دات آی‌آر
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}