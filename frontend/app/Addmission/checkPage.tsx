import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, CheckCircle, Clock, XCircle, AlertCircle, ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'
import PublicLayout from '@/components/layout/PublicLayout'
import { publicApi } from '@/lib/api'
import { toast } from 'sonner'

const STATUS_CONFIG: Record<string, any> = {
  pending:      { label:'Pending Review', Icon:Clock, color:'text-amber-600 bg-amber-50 border-amber-200' },
  under_review: { label:'Under Review',   Icon:AlertCircle, color:'text-blue-600 bg-blue-50 border-blue-200' },
  approved:     { label:'Approved',       Icon:CheckCircle, color:'text-emerald-600 bg-emerald-50 border-emerald-200' },
  rejected:     { label:'Rejected',       Icon:XCircle,    color:'text-red-600 bg-red-50 border-red-200' },
  waitlisted:   { label:'Waitlisted',     Icon:AlertCircle, color:'text-purple-600 bg-purple-50 border-purple-200' },
  enrolled:     { label:'Enrolled ✓',     Icon:CheckCircle, color:'text-teal-600 bg-teal-50 border-teal-200' },
}

export default function TrackApplicationPage() {
  const [appNo, setAppNo] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleTrack = async(e:React.FormEvent) => {
    e.preventDefault()
    if(!appNo.trim()) return
    setLoading(true)
    try {
      const res = await publicApi.checkAdmission(appNo.trim())
      setResult(res.data.data)
    } catch {
      toast.error('Application not found. Please check your application number.')
      setResult(null)
    } finally { setLoading(false) }
  }

  const cfg = result ? (STATUS_CONFIG[result.status]||STATUS_CONFIG.pending) : null

  return (
    <PublicLayout>
      <div className="bg-uipe-navy py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-80"/>
        <div className="container-xl relative z-10">
          <Link href="/admission" className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft size={14}/> Back to Admission
          </Link>
          <p className="text-uipe-gold text-xs font-semibold tracking-widest uppercase mb-3">Application Tracker</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">Track Your Application</h1>
        </div>
      </div>

      <section className="section-py bg-gray-50">
        <div className="container-xl max-w-2xl">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
            className="bg-white rounded-3xl border border-gray-100 shadow-navy p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-uipe-navy/5 flex items-center justify-center">
                <FileText size={22} className="text-uipe-navy"/>
              </div>
              <div>
                <h2 className="font-heading font-bold text-uipe-navy text-xl">Application Status</h2>
                <p className="text-gray-400 text-sm">Enter your application number below</p>
              </div>
            </div>

            <form onSubmit={handleTrack} className="flex gap-3 mb-8">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input value={appNo} onChange={e=>setAppNo(e.target.value)} placeholder="e.g. UIPE-2024-00001"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-uipe-navy/20 focus:border-uipe-navy transition-all font-mono"/>
              </div>
              <button type="submit" disabled={loading}
                className="px-6 py-3 bg-uipe-navy text-white rounded-xl text-sm font-semibold hover:bg-uipe-navy-light disabled:opacity-60 transition-all shadow-navy whitespace-nowrap">
                {loading ? 'Checking…' : 'Track'}
              </button>
            </form>

            {result && cfg && (
              <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
                className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="bg-uipe-navy px-6 py-5 text-white">
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Application Number</p>
                  <p className="font-heading font-bold text-2xl font-mono">{result.applicationNumber}</p>
                </div>
                <div className="p-6 grid sm:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Applicant Name</p>
                    <p className="font-semibold text-gray-800">{result.firstName} {result.lastName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Course Applied</p>
                    <p className="font-semibold text-gray-800">{result.courseApplied?.name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Academic Year</p>
                    <p className="font-semibold text-gray-800">{result.academicYear}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Current Status</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${cfg.color}`}>
                      <cfg.Icon size={14}/> {cfg.label}
                    </div>
                  </div>
                </div>
                {result.status==='approved' && (
                  <div className="mx-6 mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <p className="text-emerald-700 text-sm font-medium">🎉 Congratulations! Your application has been approved. Please visit the college with original documents for verification.</p>
                  </div>
                )}
              </motion.div>
            )}

            <p className="text-center text-gray-400 text-xs mt-6">Application number was sent to your email at the time of submission.</p>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  )
}