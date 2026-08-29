import { FormEvent, useState } from 'react';
import { Download, KeyRound, UserPlus } from 'lucide-react';
import { createOfficer, downloadCredentials, getCredentials } from '@/services/api';
import { PageHeader, Section, DataField } from '@/components/DataField';
import type { OfficerCredentials, OfficerRegistration as Registration } from '@/types';

const initial: Registration = {
  fullName: '', officerId: '', email: '', phone: '', department: '', designation: '', username: '', password: '',
};

export function OfficerRegistration() {
  const [form, setForm] = useState<Registration>(initial);
  const [credentials, setCredentials] = useState<OfficerCredentials | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof Registration, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const created = await createOfficer(form);
      setCredentials(await getCredentials(created.officerId));
    } catch {
      setError('Officer registration could not be completed. Please retry.');
    } finally {
      setSaving(false);
    }
  };
  const download = async () => {
    if (!credentials) return;
    const blob = await downloadCredentials(credentials.officerId);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${credentials.officerId}-credentials.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (credentials) {
    return <div className="animate-fade-in">
      <PageHeader title="Officer Credentials" subtitle="Registration completed successfully" meta="READY" />
      <Section title="ISSUED CREDENTIALS" badge="PASSWORD PROTECTED" className="max-w-2xl">
        <div className="grid grid-cols-2 gap-x-8 gap-y-5 mb-7">
          <DataField label="Officer Name" value={credentials.officerName} />
          <DataField label="Officer ID" value={credentials.officerId} mono />
          <DataField label="Username" value={credentials.username} mono />
          <DataField label="Department" value={credentials.department} />
          <DataField label="Designation" value={credentials.designation} />
          <DataField label="Status" value={credentials.credentialStatus} />
        </div>
        <p className="text-xs text-graphite/60 dark:text-lilac/40 mb-5">The API should return an encrypted, password-protected credential PDF in production.</p>
        <button onClick={download} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-ivory bg-gold rounded-sm hover:bg-gold-dark transition-colors">
          <Download className="w-4 h-4" /> DOWNLOAD CREDENTIAL PDF
        </button>
      </Section>
    </div>;
  }

  return <div className="animate-fade-in max-w-3xl">
    <PageHeader title="Add New Officer" subtitle="Create screening-system access for an authorized officer" meta="ADMIN CONTROL" />
    <form onSubmit={submit}>
      <Section title="OFFICER DETAILS" className="mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ['fullName', 'Full Name'], ['officerId', 'Officer ID'], ['email', 'Official Email'], ['phone', 'Phone'],
            ['department', 'Department / Desk'], ['designation', 'Designation'], ['username', 'Username'], ['password', 'Initial Password'],
          ].map(([field, label]) => <label key={field} className="flex flex-col gap-1.5">
            <span className="micro-label text-graphite/60 dark:text-lilac/40">{label}</span>
            <input required type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'} value={form[field as keyof Registration]} onChange={(event) => update(field as keyof Registration, event.target.value)} className="px-3 py-2.5 text-sm bg-transparent border border-black/10 dark:border-white/10 rounded-sm text-graphite dark:text-ivory focus:outline-none focus:border-gold" />
          </label>)}
        </div>
      </Section>
      {error && <p className="text-sm text-vermilion mb-4">{error}</p>}
      <button disabled={saving} className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-ivory bg-gold rounded-sm hover:bg-gold-dark disabled:opacity-50 transition-colors">
        {saving ? <KeyRound className="w-4 h-4 animate-pulse" /> : <UserPlus className="w-4 h-4" />} {saving ? 'CREATING ACCESS' : 'CREATE OFFICER ACCESS'}
      </button>
    </form>
  </div>;
}
