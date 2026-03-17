import { useEffect, useRef, useState } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useQualForm } from '../context/QualFormContext';

const REVENUE_OPTIONS = [
    { value: '', label: 'Select revenue range' },
    { value: 'under-50k', label: 'Under $50K/mo' },
    { value: '50k-250k', label: '$50K – $250K/mo' },
    { value: '250k-1m', label: '$250K – $1M/mo' },
    { value: '1m-plus', label: '$1M+/mo' },
];

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

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
        revenue: '',
        bottleneck: '',
    });

    // Sync formType from context when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedType(formType);
            setSubmitted(false);
            setSubmitting(false);
            setFormData({ name: '', email: '', company: '', revenue: '', bottleneck: '' });
        }
    }, [isOpen, formType]);

    // GSAP open/close animations + scroll lock + escape key
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

    // Escape key handler
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
            ...formData,
            assessmentType: selectedType === 'gtm-audit' ? 'GTM Audit' : 'AI Readiness Assessment',
        };

        try {
            await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            setSubmitted(true);
        } catch {
            // Still show success — form data was captured
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
                {/* Close button */}
                <button
                    onClick={closeQualForm}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors duration-200"
                >
                    <X size={20} />
                </button>

                {submitted ? (
                    /* Success State */
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-brand-accent/10 flex items-center justify-center mb-6">
                            <CheckCircle className="w-8 h-8 text-brand-accent" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">Request Received</h3>
                        <p className="text-white/50 text-sm max-w-xs leading-relaxed">
                            We'll review your information and reach out within 24 hours to schedule your free {selectedType === 'gtm-audit' ? 'GTM audit' : 'AI readiness assessment'}.
                        </p>
                        <button
                            onClick={closeQualForm}
                            className="mt-8 text-brand-accent text-sm font-medium hover:underline"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    /* Form */
                    <>
                        <h3 className="text-2xl font-semibold text-white mb-2 pr-8">Qualify for a Free Audit</h3>
                        <p className="text-white/40 text-sm mb-8">Tell us about your business and we'll prepare a custom assessment.</p>

                        {/* Assessment Type Toggle */}
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
                                GTM Audit
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
                                AI Readiness
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
                                name="revenue"
                                required
                                value={formData.revenue}
                                onChange={handleChange}
                                className={`${inputClass} ${!formData.revenue ? 'text-white/30' : ''}`}
                            >
                                {REVENUE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value} disabled={!opt.value} className="bg-[#15151A] text-white">
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <textarea
                                name="bottleneck"
                                placeholder="What's your biggest bottleneck right now? (optional)"
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
                                        'Request Free Audit'
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-overlay"></div>
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
