'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Braces, Copy, Check, ArrowLeftRight, FileJson } from 'lucide-react';

interface FieldDef {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example: string;
}

const typeOptions = [
  { value: 'string', label: 'رشته (String)' },
  { value: 'number', label: 'عدد (Number)' },
  { value: 'integer', label: 'عدد صحیح (Integer)' },
  { value: 'boolean', label: 'بولی (Boolean)' },
  { value: 'array', label: 'آرایه (Array)' },
  { value: 'object', label: 'شیء (Object)' },
  { value: 'null', label: 'خالی (Null)' },
];

const sampleInputs = [
  {
    title: 'کاربر',
    json: JSON.stringify({
      name: 'علی محمدی',
      email: 'ali@example.com',
      age: 28,
      isActive: true,
      role: 'admin',
      tags: ['developer', 'designer'],
      address: { city: 'تهران', street: 'ولیعصر' },
      createdAt: '2024-01-15T10:30:00Z'
    }, null, 2),
  },
  {
    title: 'محصول',
    json: JSON.stringify({
      id: 1,
      title: 'گوشی موبایل',
      price: 15000000,
      inStock: true,
      category: 'electronics',
      images: ['url1.jpg', 'url2.jpg'],
      rating: 4.5
    }, null, 2),
  },
  {
    title: 'سفارش',
    json: JSON.stringify({
      orderId: 'ORD-1234',
      customerName: 'مریم رضایی',
      items: [
        { productId: 1, quantity: 2, price: 50000 },
        { productId: 5, quantity: 1, price: 120000 }
      ],
      totalAmount: 220000,
      status: 'completed',
      isPaid: true
    }, null, 2),
  },
];

function inferFieldType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  return typeof value;
}

function jsonToFields(json: string): FieldDef[] {
  try {
    const obj = JSON.parse(json);
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return [];
    return Object.entries(obj).map(([key, value]) => ({
      name: key,
      type: inferFieldType(value),
      required: true,
      description: '',
      example: Array.isArray(value) ? JSON.stringify(value) : typeof value === 'object' ? JSON.stringify(value) : String(value),
    }));
  } catch {
    return [];
  }
}

function fieldsToJsonSchema(fields: FieldDef[], rootTitle: string): string {
  const properties: Record<string, any> = {};
  const required: string[] = [];

  fields.forEach(field => {
    const prop: any = { type: field.type };
    if (field.description) prop.description = field.description;
    if (field.example) prop.example = field.type === 'string' ? field.example : 
      (field.type === 'array' || field.type === 'object') ? (() => { try { return JSON.parse(field.example); } catch { return field.example; } })() : 
      field.type === 'number' || field.type === 'integer' ? Number(field.example) : 
      field.type === 'boolean' ? field.example === 'true' : field.example;

    if (field.type === 'array') {
      prop.type = 'array';
      prop.items = { type: 'string' };
    }
    if (field.type === 'object') {
      prop.type = 'object';
      prop.additionalProperties = true;
    }

    properties[field.name] = prop;
    if (field.required) required.push(field.name);
  });

  const schema: any = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    title: rootTitle,
    properties,
  };
  if (required.length > 0) schema.required = required;

  return JSON.stringify(schema, null, 2);
}

function jsonToSchema(json: string, rootTitle: string): string {
  const fields = jsonToFields(json);
  if (fields.length === 0) return '';
  return fieldsToJsonSchema(fields, rootTitle);
}

export default function JsonSchemaGenerator() {
  const [mode, setMode] = useState<'json' | 'manual'>('json');
  const [jsonInput, setJsonInput] = useState('');
  const [schemaTitle, setSchemaTitle] = useState('MySchema');
  const [fields, setFields] = useState<FieldDef[]>([
    { name: 'id', type: 'integer', required: true, description: 'شناسه', example: '1' },
    { name: 'name', type: 'string', required: true, description: 'نام', example: '' },
    { name: 'email', type: 'string', required: true, description: 'ایمیل', example: '' },
  ]);
  const [schemaOutput, setSchemaOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateFromJson = () => {
    setError('');
    const schema = jsonToSchema(jsonInput, schemaTitle);
    if (!schema) {
      setError('JSON نامعتبر است. لطفا یک JSON معتبر وارد کنید.');
      setSchemaOutput('');
      return;
    }
    setSchemaOutput(schema);
  };

  const generateFromFields = () => {
    setError('');
    if (fields.length === 0) {
      setError('حداقل یک فیلد اضافه کنید.');
      return;
    }
    setSchemaOutput(fieldsToJsonSchema(fields, schemaTitle));
  };

  const addField = () => {
    setFields(prev => [...prev, { name: '', type: 'string', required: false, description: '', example: '' }]);
  };

  const removeField = (index: number) => {
    if (fields.length <= 1) return;
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: keyof FieldDef, value: string | boolean) => {
    setFields(prev => prev.map((f, i) => i === index ? { ...f, [key]: value } : f));
  };

  const loadSample = (json: string) => {
    setJsonInput(json);
    setMode('json');
    setError('');
    setSchemaOutput('');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(schemaOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJsonToFields = () => {
    const parsed = jsonToFields(jsonInput);
    if (parsed.length > 0) {
      setFields(parsed);
      setMode('manual');
      setError('');
    } else {
      setError('نتوانستیم فیلدها را از JSON استخراج کنیم.');
    }
  };

  const inputCls = 'w-full h-10 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)]';
  const labelCls = 'block text-sm font-medium text-foreground mb-1';

  return (
    <div className="space-y-4">
      <div className="glass-card glow-effect p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className={labelCls}>عنوان Schema</label>
            <input
              value={schemaTitle}
              onChange={e => setSchemaTitle(e.target.value)}
              placeholder="MySchema"
              dir="ltr"
              className={`${inputCls} mt-1`}
            />
          </div>
          <div className="flex gap-2 items-end">
            <Button variant={mode === 'json' ? 'default' : 'outline'} size="sm" onClick={() => setMode('json')}>
              <FileJson className="h-4 w-4 ml-1" />
              از JSON
            </Button>
            <Button variant={mode === 'manual' ? 'default' : 'outline'} size="sm" onClick={() => setMode('manual')}>
              <Braces className="h-4 w-4 ml-1" />
              دستی
            </Button>
          </div>
        </div>
      </div>

      <div className="glass-card glow-effect p-4">
        <label className="text-xs text-muted-foreground">نمونه‌های آماده:</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {sampleInputs.map((sample, i) => (
            <Button key={i} variant="outline" size="sm" onClick={() => loadSample(sample.json)}>
              {sample.title}
            </Button>
          ))}
        </div>
      </div>

      {mode === 'json' && (
        <div className="glass-card glow-effect p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">ورودی JSON</h3>
            <Button variant="outline" size="sm" onClick={handleJsonToFields}>
              <ArrowLeftRight className="h-4 w-4 ml-1" />
              ویرایش دستی فیلدها
            </Button>
          </div>
          <div className="space-y-3">
            <textarea
              value={jsonInput}
              onChange={e => { setJsonInput(e.target.value); setError(''); setSchemaOutput(''); }}
              placeholder='{ "name": "علی", "age": 30 }'
              dir="ltr"
              className={`${inputCls} min-h-[200px] resize-y font-mono text-sm`}
            />
            <Button onClick={generateFromJson}>
              <Braces className="h-4 w-4 ml-2" />
              تولید Schema
            </Button>
          </div>
        </div>
      )}

      {mode === 'manual' && (
        <div className="glass-card glow-effect p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">تعریف فیلدها</h3>
            <Button variant="outline" size="sm" onClick={addField}>
              + افزودن فیلد
            </Button>
          </div>
          <div className="space-y-4">
            {fields.map((field, i) => (
              <div key={i} className="p-3 rounded-lg bg-[var(--muted)]/50 space-y-3">
                <div className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-12 sm:col-span-3">
                    <label className={labelCls}>نام فیلد</label>
                    <input
                      value={field.name}
                      onChange={e => updateField(i, 'name', e.target.value)}
                      placeholder="fieldName"
                      dir="ltr"
                      className={`${inputCls} text-sm`}
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label className={labelCls}>نوع</label>
                    <select
                      value={field.type}
                      onChange={e => updateField(i, 'type', e.target.value)}
                      className="w-full h-10 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    >
                      {typeOptions.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label className={labelCls}>مثال</label>
                    <input
                      value={field.example}
                      onChange={e => updateField(i, 'example', e.target.value)}
                      placeholder="مقدار نمونه"
                      dir="ltr"
                      className={`${inputCls} text-sm`}
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-3 flex items-center gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={e => updateField(i, 'required', e.target.checked)}
                        className="rounded"
                      />
                      الزامی
                    </label>
                    <button
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-sm transition-colors hover:bg-accent disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                      onClick={() => removeField(i)}
                      disabled={fields.length <= 1}
                    >
                      <span className="text-red-500 text-lg">×</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>توضیحات</label>
                  <input
                    value={field.description}
                    onChange={e => updateField(i, 'description', e.target.value)}
                    placeholder="توضیح فیلد..."
                    className={`${inputCls} text-sm`}
                  />
                </div>
              </div>
            ))}
            <Button onClick={generateFromFields}>
              <Braces className="h-4 w-4 ml-2" />
              تولید Schema
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="glass-card glow-effect p-4 border-red-500/50">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {schemaOutput && (
        <div className="glass-card glow-effect p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">خروجی JSON Schema</h3>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 ml-1" /> : <Copy className="h-4 w-4 ml-1" />}
              کپی
            </Button>
          </div>
          <pre
            className="bg-[var(--muted)] rounded-lg p-4 text-sm font-mono overflow-x-auto leading-relaxed"
            dir="ltr"
          >
            {schemaOutput}
          </pre>
        </div>
      )}
    </div>
  );
}