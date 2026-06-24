import { useEffect, useRef, useState } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useQualForm } from '../context/QualFormContext';
import { supabase } from '../lib/supabase';

const TEAM_SIZE_OPTIONS = [
    { value: '', label: 'Select team size' },
    { value: 'solo-5', label: 'Solo / 1-5 employees' },
    { value: '5-15', label: '5-15 employees' },
    { value: '15-50', label: '15-50 employees' },
    { value: '50-plus', label: '50+ employees' },
];

const BUSINESS_TYPE_OPTIONS = [
    { value: '', label: 'Select business type' },
    { value: 'cpa-accounting', label: 'CPA / Accounting Firm' },
    { value: 'financial-advisory', label: 'Financial Advisory' },
    { value: 'bookkeeping-cfo', label: 'Bookkeeping / Fractional CFO' },
    { value: 'local-business', label: 'Local Business (Houston)' },
    { value: 'other', label: 'Other' },
];

export default function QualificationForm() {
    const { isOpen, formType, closeQualForm } = useQualForm();
    const overlayRef = useRef(null);
    const cardRef = useRef(null);
    const [selectedType, setSelectedType] = useState(formType);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        business_type: '',
        team_size: '',
        bottleneck: '',
    });

    useEffect(() => {
        if (isOpen) {
            setSelectedType(formType);
            setSubmitted(false);
            setSubmitting(false);
            setFormData({ name: '', email: '', company: '', business_type: '', team_size: '', bottleneck: '' });
        }
    }, [isOpen, formType]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';

            gsap.set(overlayRef.current, { display: 'flex' });
            gsap.fromTo(overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
            gsap.fromTo(cardRef.current,
                { opacity: 0, scale: 0.92, y: 40 },
                { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.1 }
            );
        } else {
            document.body.style.overflow = '';

            if (overlayRef.current) {
                gsap.to(cardRef.current, {
                    opacity: 0, scale: 0.95, y: 20,
                    duration: 0.3, ease: 'power2.in',
                });
                gsap.to(overlayRef.current, {
                    opacity: 0, duration: 0.3, ease: 'power2.in', delay: 0.1,
                    onComplete: () => {
                        gsap.set(overlayRef.current, { display: 'none' });
                    },
                });
            }
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) closeQualForm();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeQualForm]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            name: formData.name,
            email: formData.email,
            company: formData.company,
            business_type: formData.business_type,
            team_size: formData.team_size,
            bottleneck: formData.bottleneck || null,
            assessment_type: selectedType === 'gtm-audit' ? 'Firm Growth Audit' : 'AI Receptionist Demo',
        };

        try {
            if (supabase) {
                await supabase.from('lead_submissions').insert([payload]);
            }
            setSubmitted(true);
        } catch {
            setSubmitted(true);
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/20 transition-colors';

    return (
        <div
            ref={overlayRef}
            onClick={(e) => { if (e.target === overlayRef.current) closeQualForm(); }}
            className="fixed inset-0 z-[100] hidden items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            style={{ display: 'none' }}
        >
            <div
                ref={cardRef}
                className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#15151A] border border-white/10 rounded-[2rem] shadow-[0_0_60px_rgba(201,168,76,0.15)] p-8"
            >
                <button
                    onClick={closeQualForm}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors duration-200"
                >
                    <X size={20} />
                </button>

                {submitted ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-brand-accent/10 flex items-center justify-center mb-6">
                            <CheckCircle className="w-8 h-8 text-brand-accent" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">Request Received</h3>
                        <p className="text-white/50 text-sm max-w-xs leading-relaxed">
                            I'll review your information and reach out within 24 hours to schedule your free {selectedType === 'gtm-audit' ? 'firm growth audit' : 'AI receptionist demo'}.
                        </p>
                        <button
                            onClick={closeQualForm}
                            className="mt-8 text-brand-accent text-sm font-medium hover:underline"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 className="text-2xl font-semibold text-white mb-2 pr-8">Qualify for a Free Audit</h3>
                        <p className="text-white/40 text-sm mb-8">Tell me about your business and I'll prepare a custom assessment.</p>

                        <div className="flex bg-white/5 rounded-xl p-1 mb-6">
                            <button
                                type="button"
                                onClick={() => setSelectedType('gtm-audit')}
                                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                                    selectedType === 'gtm-audit'
                                        ? 'bg-brand-accent text-brand-primary'
                                        : 'text-white/50 hover:text-white/70'
                                }`}
                            >
                                Firm Growth Audit
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedType('ai-assessment')}
                                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                                    selectedType === 'ai-assessment'
                                        ? 'bg-brand-accent text-brand-primary'
                                        : 'text-white/50 hover:text-white/70'
                                }`}
                            >
                                AI Receptionist Demo
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className={inputClass}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Business Email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={inputClass}
                            />
                            <input
                                type="text"
                                name="company"
                                placeholder="Company Name"
                                required
                                value={formData.company}
                                onChange={handleChange}
                                className={inputClass}
                            />
                            <select
                                name="business_type"
                                required
                                value={formData.business_type}
                                onChange={handleChange}
                                className={`${inputClass} ${!formData.business_type ? 'text-white/30' : ''}`}
                            >
                                {BUSINESS_TYPE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value} disabled={!opt.value} className="bg-[#15151A] text-white">
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="team_size"
                                required
                                value={formData.team_size}
                                onChange={handleChange}
                                className={`${inputClass} ${!formData.team_size ? 'text-white/30' : ''}`}
                            >
                                {TEAM_SIZE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value} disabled={!opt.value} className="bg-[#15151A] text-white">
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <textarea
                                name="bottleneck"
                                placeholder="What's holding your firm back right now? (optional)"
                                rows={3}
                                value={formData.bottleneck}
                                onChange={handleChange}
                                className={`${inputClass} resize-none`}
                            />

                            <button
                                type="submit"
                                disabled={submitting}
                                className="group relative overflow-hidden bg-brand-accent text-brand-primary w-full py-4 rounded-[2rem] font-semibold text-sm tracking-wide transition-transform hover:scale-[1.03] active:scale-[0.97] duration-300 shadow-[0_0_30px_rgba(201,168,76,0.25)] mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        selectedType === 'gtm-audit' ? 'Request Free Audit' : 'Request Demo'
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay" />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
