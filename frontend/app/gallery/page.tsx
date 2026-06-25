import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { X, ZoomIn, Phone, Mail, MapPin, Clock, CheckCircle, Loader2, Send } from 'lucide-react'
import PublicLayout from '@/app/_components/PublicLayout'
import { publicApi } from '@/lib/api'
import { GALLERY_CATEGORIES, COLLEGE } from '@/data/constants'

const PH = Array.from({length:12},(_,i)=>({_id:i,title:`Campus Photo ${i+1}`,category:GALLERY_CATEGORIES[i%GALLERY_CATEGORIES.length],image:null}))

export default function GalleryPage() {
  const [cat, setCat] = useState('')
  const [lightbox, setLightbox] = useState<any>(null)
  const { data } = useQuery({ queryKey:['gallery',cat], queryFn:()=>publicApi.getGallery({category:cat||undefined,limit:48}) })
  const images = data?.data?.data?.length ? data.data.data : PH

  // form state
  const [done, setDone] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ name:'', phone:'', email:'', subject:'', message:'' })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    // TODO: replace with real API call
    await new Promise(r => setTimeout(r, 1000))
    setSending(false)
    setDone(true)
  }

  return (
    <PublicLayout>
      <div className="bg-uipe-navy py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-80"/>
        <div className="hero-particles absolute inset-0"/>
        <div className="container-xl relative z-10">
          <p className="text-uipe-gold text-xs font-semibold tracking-widest uppercase mb-3">Visual Story</p>
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-4">Gallery</h1>
          <p className="text-white/55 text-lg max-w-xl">Life at UIPE — campus, events, achievements and more.</p>
        </div>
      </div>

      <section className="section-py bg-gray-50">
        <div className="container-xl">
          <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide flex-wrap">
            {['',  ...GALLERY_CATEGORIES].map((c,i)=>(
              <button key={i} onClick={()=>setCat(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${cat===c ? 'bg-uipe-navy text-white border-uipe-navy shadow-navy' : 'bg-white text-gray-500 border-gray-200 hover:border-uipe-navy/40 hover:text-uipe-navy'}`}>
                {c||'All Photos'}
              </button>
            ))}
          </div>

          <motion.div layout className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {images.map((img:any,i:number)=>(
              <motion.div key={img._id} layout initial={{opacity:0,scale:0.96}} animate={{opacity:1,scale:1}} transition={{delay:i*0.04}}
                className="group relative overflow-hidden rounded-xl bg-gray-200 cursor-pointer break-inside-avoid mb-3"
                onClick={()=>img.image?.url && setLightbox(img)}>
                {img.image?.url
                  ? <Image src={img.image.url} alt={img.title} width={400} height={300} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"/>
                  : <div className="w-full aspect-square bg-gradient-to-br from-uipe-navy/10 to-uipe-sky/10 flex items-center justify-center"><span className="text-gray-400 text-xs">{img.title}</span></div>}
                <div className="absolute inset-0 bg-uipe-navy/0 group-hover:bg-uipe-navy/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ZoomIn size={24} className="text-white"/>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-xs font-medium">{img.title}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
            onClick={()=>setLightbox(null)}>
            <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}}
              className="relative max-w-4xl max-h-[90vh]" onClick={e=>e.stopPropagation()}>
              <Image src={lightbox.image.url} alt={lightbox.title} width={1200} height={800} className="rounded-xl object-contain max-h-[80vh]"/>
              <button onClick={()=>setLightbox(null)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
                <X size={18}/>
              </button>
              <p className="absolute bottom-3 left-3 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">{lightbox.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="section-py bg-gray-50">
        <div className="container-xl grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {[
              {Icon:Phone,title:'Call Us',val:COLLEGE.phone,sub:'Mon–Sat, 9am–5pm',href:`tel:${COLLEGE.phone}`},
              {Icon:Mail,title:'Email Us',val:COLLEGE.email,sub:'Reply within 24 hours',href:`mailto:${COLLEGE.email}`},
              {Icon:MapPin,title:'Visit Us',val:COLLEGE.address,sub:'Lauriya, East Champaran',href:COLLEGE.mapLink},
              {Icon:Clock,title:'Office Hours',val:'Monday – Saturday',sub:'9:00 AM – 5:00 PM',href:'#'},
            ].map(({Icon,title,val,sub,href},i)=>(
              <motion.a key={i} href={href} target={href.startsWith('http')?'_blank':undefined} rel="noreferrer"
                initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all group">
                <div className="w-11 h-11 rounded-xl bg-uipe-navy/5 flex items-center justify-center shrink-0 group-hover:bg-uipe-navy transition-colors">
                  <Icon size={18} className="text-uipe-navy group-hover:text-white transition-colors"/>
                </div>
                <div>
                  <p className="font-semibold text-uipe-navy text-sm">{title}</p>
                  <p className="text-gray-700 text-sm mt-0.5">{val}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
                </div>
              </motion.a>
            ))}

            <div className="bg-uipe-navy rounded-2xl overflow-hidden h-48 relative">
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                <MapPin size={32} className="text-uipe-gold"/>
                <p className="text-white text-sm font-medium">Lauriya, East Champaran</p>
                <a href={COLLEGE.mapLink} target="_blank" rel="noreferrer"
                  className="text-xs text-uipe-gold hover:underline">Open in Google Maps →</a>
              </div>
            </div>
          </div>

          <motion.div initial={{opacity:0,x:24}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
            className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-navy p-8 md:p-10">
            {done ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={40} className="text-emerald-500"/>
                </div>
                <h3 className="font-heading font-bold text-uipe-navy text-2xl mb-2">Message Received!</h3>
                <p className="text-gray-500 mb-6">We'll get back to you within 24 hours.</p>
                <button onClick={()=>setDone(false)} className="text-sm text-uipe-sky hover:underline">Send another message</button>
              </div>
            ):(
              <>
                <h2 className="font-heading font-bold text-uipe-navy text-2xl mb-1">Send a Message</h2>
                <p className="text-gray-400 text-sm mb-7">Fill in the form and our team will be in touch.</p>
                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input name="name" placeholder="Full Name" required value={form.name} onChange={e=>setForm(f=>({ ...f, name:e.target.value }))} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-uipe-navy/20 focus:border-uipe-navy"/>
                    <input name="phone" placeholder="Phone Number" type="tel" value={form.phone} onChange={e=>setForm(f=>({ ...f, phone:e.target.value }))} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-uipe-navy/20 focus:border-uipe-navy"/>
                  </div>
                  <input name="email" placeholder="Email Address" type="email" required value={form.email} onChange={e=>setForm(f=>({ ...f, email:e.target.value }))} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-uipe-navy/20 focus:border-uipe-navy"/>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Subject<span className="text-red-400 ml-0.5">*</span></label>
                    <select required value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-uipe-navy/20 focus:border-uipe-navy bg-white transition-all">
                      <option value="">Select a subject</option>
                      {['Admission Inquiry','Course Information','Fee Structure','Scholarship','Hostel & Facilities','Other'].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Message<span className="text-red-400 ml-0.5">*</span></label>
                    <textarea required rows={5} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}
                      placeholder="Tell us how we can help..."
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-uipe-navy/20 focus:border-uipe-navy resize-none transition-all"/>
                  </div>
                  <button type="submit" disabled={sending}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-uipe-navy text-white text-sm font-semibold hover:bg-uipe-navy-light disabled:opacity-60 transition-all shadow-navy">
                    {sending ? <><Loader2 size={16} className="animate-spin"/>Sending…</> : <><Send size={15}/>Send Message</>}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  )
}