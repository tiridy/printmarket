'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../utils/supabase'

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
  file_url?: string
  file_name?: string
}

export default function ChatPage() {
  const params  = useParams()
  const router  = useRouter()
  const orderId = params?.id as string
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef   = useRef<HTMLInputElement>(null)

  const [userId,     setUserId]     = useState<string | null>(null)
  const [messages,   setMessages]   = useState<Message[]>([])
  const [input,      setInput]      = useState('')
  const [sending,    setSending]    = useState(false)
  const [uploading,  setUploading]  = useState(false)
  const [loading,    setLoading]    = useState(true)
  const [orderTitle, setOrderTitle] = useState('Sipariş')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)

      const { data: order } = await supabase
        .from('orders').select('id, request:requests(title)').eq('id', orderId).single()
      if (order?.request && typeof order.request === 'object' && 'title' in order.request) {
        setOrderTitle((order.request as { title: string }).title ?? 'Sipariş')
      }

      const { data: msgs } = await supabase
        .from('messages').select('*').eq('order_id', orderId).order('created_at', { ascending: true })
      setMessages(msgs ?? [])
      setLoading(false)
    }
    init()
  }, [orderId, router])

  useEffect(() => {
    const channel = supabase
      .channel(`chat-${orderId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `order_id=eq.${orderId}` },
        (payload) => { setMessages(prev => [...prev, payload.new as Message]) })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [orderId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || !userId) return
    setSending(true)
    const content = input.trim()
    setInput('')
    await supabase.from('messages').insert({ order_id: orderId, sender_id: userId, content })
    setSending(false)
  }

  const sendFile = async (file: File) => {
    if (!userId) return
    setUploading(true)
    const path = `${orderId}/${userId}-${Date.now()}-${file.name}`
    const { error: upErr } = await supabase.storage.from('chat-files').upload(path, file)
    if (upErr) { setUploading(false); return }
    const { data: urlData } = supabase.storage.from('chat-files').getPublicUrl(path)
    await supabase.from('messages').insert({ order_id: orderId, sender_id: userId, content: '', file_url: urlData.publicUrl, file_name: file.name })
    setUploading(false)
  }

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })

  const isImage = (name?: string) =>
    /\.(jpg|jpeg|png|gif|webp)$/i.test(name ?? '')

  if (loading) return (
    <div className="flex h-screen items-center justify-center" style={{ background: 'var(--color-neutral-50)' }}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-orange-500" />
    </div>
  )

  return (
    <div className="flex h-screen flex-col" style={{ background: 'var(--color-neutral-50)' }}>

      {/* Header */}
      <header className="shrink-0 glass-light" style={{ borderBottom: '1px solid var(--color-neutral-200)' }}>
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-4 px-6">
          <Link href={`/orders/${orderId}`} className="transition hover:opacity-70" style={{ color: 'var(--color-neutral-400)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white" style={{ background: 'var(--color-brand-500)' }}>T</div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold" style={{ color: 'var(--color-neutral-900)' }}>{orderTitle}</p>
            <p className="text-xs" style={{ color: 'var(--color-success)' }}>● Aktif</p>
          </div>
          <Link href={`/orders/${orderId}`} className="text-xs hover:underline" style={{ color: 'var(--color-brand-500)' }}>Siparişi Gör</Link>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-3xl space-y-4">

          {messages.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-4xl mb-3">💬</p>
              <p className="font-semibold" style={{ color: 'var(--color-neutral-700)' }}>Henüz mesaj yok</p>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-neutral-400)' }}>Üreticinizle iletişime geçin.</p>
            </div>
          )}

          {messages.map((msg, idx) => {
            const isMe = msg.sender_id === userId
            const showDate =
              idx === 0 ||
              new Date(messages[idx - 1].created_at).toDateString() !== new Date(msg.created_at).toDateString()

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="my-4 text-center">
                    <span className="rounded-full px-3 py-1 text-xs" style={{ background: 'var(--color-neutral-100)', color: 'var(--color-neutral-400)' }}>
                      {new Date(msg.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                    </span>
                  </div>
                )}

                <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <div className="h-7 w-7 shrink-0 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">U</div>
                  )}

                  <div className="max-w-[70%] rounded-2xl px-4 py-2.5"
                    style={isMe
                      ? { background: 'var(--color-brand-500)', color: '#fff', borderBottomRightRadius: '4px' }
                      : { background: 'var(--color-neutral-0)', border: '1px solid var(--color-neutral-200)', color: 'var(--color-neutral-900)', borderBottomLeftRadius: '4px' }}>

                    {msg.file_url && (
                      isImage(msg.file_name) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={msg.file_url} alt={msg.file_name} className="max-w-full rounded-xl mb-1" />
                      ) : (
                        <a href={msg.file_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-xl border p-3 mb-1 text-xs"
                          style={isMe
                            ? { borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }
                            : { borderColor: 'var(--color-neutral-200)', color: 'var(--color-neutral-600)' }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                          </svg>
                          <span className="truncate">{msg.file_name}</span>
                        </a>
                      )
                    )}

                    {msg.content && (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    )}

                    <p className="mt-1 text-right text-[10px]" style={{ color: isMe ? 'rgba(255,255,255,0.6)' : 'var(--color-neutral-400)' }}>
                      {fmtTime(msg.created_at)}
                    </p>
                  </div>

                  {isMe && (
                    <div className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--color-brand-500)' }}>S</div>
                  )}
                </div>
              </div>
            )
          })}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="shrink-0 p-4" style={{ borderTop: '1px solid var(--color-neutral-200)', background: 'var(--color-neutral-0)' }}>
        <div className="mx-auto flex max-w-3xl items-end gap-3">
          <input ref={fileRef} type="file" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) sendFile(f) }} />

          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border transition disabled:opacity-50"
            style={{ borderColor: 'var(--color-neutral-200)', color: 'var(--color-neutral-400)' }}>
            {uploading ? (
              <div className="h-4 w-4 animate-spin rounded-full border border-gray-300 border-t-orange-500" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
              </svg>
            )}
          </button>

          <div className="flex-1 rounded-2xl border px-4 py-2.5 flex items-end gap-2"
            style={{ borderColor: 'var(--color-neutral-200)', background: 'var(--color-neutral-50)' }}>
            <textarea rows={1} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Mesajınızı yazın..."
              className="flex-1 resize-none bg-transparent text-sm placeholder-gray-400 focus:outline-none max-h-32"
              style={{ minHeight: '20px', color: 'var(--color-neutral-900)' }} />
          </div>

          <button onClick={sendMessage} disabled={!input.trim() || sending}
            className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--color-brand-500)', boxShadow: 'var(--shadow-brand)' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 rotate-90">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
