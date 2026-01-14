import React, { useRef, useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import JSZip from 'jszip'
import { renderAsync } from 'docx-preview'
import { Link } from 'react-router-dom'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`


const ChatPage = () => {
  const fileInputRef = useRef(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [activeTab, setActiveTab] = useState('shaxsiy')
  const [selected, setSelected] = useState(null)

  const people = [
    { id: 1, name: 'Ali Qodirov', avatar: '../assets/images/chat/2.png', last: 'Salom! Yozib qoldim', time: '12:30 PM', unread: 2 },
    { id: 2, name: 'Madina Toirova', avatar: '../assets/images/chat/3.png', last: 'Ertaga uchrashamiz', time: '11:05 AM', unread: 0 },
    { id: 3, name: 'Bekzod Karimov', avatar: '../assets/images/chat/4.png', last: 'Hujjat yuboring iltimos', time: 'Yesterday', unread: 1 }
  ]

  const groups = [
    { id: 11, name: 'Loyiha jamoasi', avatar: '../assets/images/chat/5.png', last: 'Meeting 5 daqiqa ichida', time: '9:20 AM', unread: 4 },
    { id: 12, name: 'Dizayn guruhi', avatar: '../assets/images/chat/6.png', last: 'Mockup tayyor', time: 'Yesterday', unread: 0 }
  ]

  const channels = [
    { id: 21, name: "E'lonlar", avatar: '../assets/images/chat/7.png', last: 'Yangilik: release v1.2', time: 'Today', unread: 0 },
    { id: 22, name: 'Texnik yangiliklar', avatar: '../assets/images/chat/8.png', last: 'Server patch o‘rnatildi', time: '2 days', unread: 0 }
  ]

  const sampleMessagesFor = (item) => {
    const now = new Date().toLocaleTimeString()
    return [
      { id: `${item.id}-1`, type: 'text', sender: 'them', text: item.last || 'Salom', time: item.time || now },
      { id: `${item.id}-2`, type: 'text', sender: 'me', text: 'Yaxshi, rahmat!', time: now }
    ]
  }

  const selectConversation = (item) => {
    setSelected(item)
    setMessages(sampleMessagesFor(item))
  }

  useEffect(() => {
    const list = activeTab === 'shaxsiy' ? people : activeTab === 'guruh' ? groups : channels
    if (list.length > 0) {
      setSelected(list[0])
      setMessages(sampleMessagesFor(list[0]))
    }
  }, [activeTab])

  const TabButtons = () => {
    const makeClass = (tab) => `px-4 py-2 font-medium w-full text-center ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-white'}`
    return (
      <>
        <button type="button" onClick={() => setActiveTab('shaxsiy')} className={makeClass('shaxsiy')}>Shaxsiy</button>
        <button type="button" onClick={() => setActiveTab('guruh')} className={makeClass('guruh')}>Guruh</button>
        <button type="button" onClick={() => setActiveTab('kanal')} className={makeClass('kanal')}>Kanal</button>
      </>
    )
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIconClass = (mime, name) => {
    const ext = name.split('.').pop()?.toLowerCase() || ''
    if (mime?.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext)) return 'ri-image-line'
    if (mime === 'application/pdf' || ext === 'pdf') return 'ri-file-pdf-line'
    if (mime?.startsWith('audio/') || ['mp3', 'wav', 'ogg'].includes(ext)) return 'ri-file-music-line'
    if (mime?.startsWith('video/') || ['mp4', 'webm', 'mov', 'mkv'].includes(ext)) return 'ri-file-video-line'
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'ri-file-zip-line'
    if (['doc', 'docx'].includes(ext)) return 'ri-file-word-line'
    if (['xls', 'xlsx'].includes(ext)) return 'ri-file-excel-line'
    if (['ppt', 'pptx'].includes(ext)) return 'ri-file-ppt-line'
    if (['txt', 'md', 'csv', 'json', 'xml'].includes(ext)) return 'ri-file-text-line'
    return 'ri-file-2-line'
  }

  const handleFile = (file) => {
    if (!file) return
    const id = Date.now() + Math.random()
    const newMsg = {
      id,
      type: 'file',
      sender: 'me',
      file: {
        name: file.name,
        size: file.size,
        mime: file.type,
        url: null,
      },
      progress: 0,
      status: 'uploading'
    }
    setMessages((s) => [...s, newMsg])

    const intervalId = setInterval(() => {
      setMessages((cur) => cur.map((m) => {
        if (m.id !== id) return m
        const next = Math.min(100, m.progress + Math.floor(Math.random() * 18) + 7)
        const updated = { ...m, progress: next }
        if (next >= 100) {
          updated.status = 'done'
          updated.file.url = URL.createObjectURL(file)
        }
        return updated
      }))
    }, 300)

    const stopCheck = setInterval(() => {
      const cur = messages.find((mm) => mm.id === id)
      if (cur && cur.progress >= 100) {
        clearInterval(intervalId)
        clearInterval(stopCheck)
      }
    }, 500)

    setTimeout(() => {
      clearInterval(intervalId)
      clearInterval(stopCheck)
    }, 30000)
  }

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (file) handleFile(file)
    e.target.value = null
  }

  const onDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files && e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const onSendText = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setMessages((s) => [...s, { id: Date.now(), type: 'text', sender: 'me', text, time: new Date().toLocaleTimeString() }])
    setText('')
  }

  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerFileType, setViewerFileType] = useState(null)
  const [viewerZipEntries, setViewerZipEntries] = useState([])
  const [viewerSelectedFile, setViewerSelectedFile] = useState(null)
  const [viewerNumPages, setViewerNumPages] = useState(null)
  const [viewerDocxHtml, setViewerDocxHtml] = useState(null)
  const docxContainerRef = useRef(null)

  const onPdfLoadSuccess = ({ numPages }) => setViewerNumPages(numPages)

  const openViewer = async (message) => {
    if (!message || !message.file) return
    try {
      let blob
      if (message.file.blob) {
        blob = message.file.blob
      } else if (message.file.url) {
        const res = await fetch(message.file.url)
        blob = await res.blob()
      } else {
        return
      }

      const mime = message.file.mime || blob.type || ''
      // ZIP
      if (mime === 'application/zip' || message.file.name?.endsWith('.zip')) {
        const zip = await JSZip.loadAsync(blob)
        const entries = []
        for (const p of Object.keys(zip.files)) {
          const entry = zip.files[p]
          const name = p.split('/').pop()
          if (!entry.dir && (name.endsWith('.pdf') || name.endsWith('.docx'))) {
            const fileBlob = await entry.async('blob')
            entries.push({ name, blob: fileBlob })
          }
        }
        setViewerZipEntries(entries)
        setViewerFileType('application/zip')
        setViewerSelectedFile(null)
        setViewerNumPages(null)
        setViewerDocxHtml(null)
        setViewerOpen(true)
        return
      }

      // PDF or DOCX
      if (mime === 'application/pdf' || message.file.name?.endsWith('.pdf')) {
        setViewerSelectedFile(blob)
        setViewerFileType('application/pdf')
        setViewerNumPages(null)
        setViewerDocxHtml(null)
        setViewerOpen(true)
        return
      }

      if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || message.file.name?.endsWith('.docx')) {
        setViewerSelectedFile(blob)
        setViewerFileType('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        setViewerNumPages(null)
        setViewerDocxHtml(null)
        setViewerOpen(true)
        return
      }
    } catch (err) {
      console.error('Viewer open error', err)
    }
  }

  const openZipEntry = async (entry) => {
    setViewerSelectedFile(entry.blob)
    const mime = entry.name.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    setViewerFileType(mime)
    setViewerDocxHtml(null)
    setViewerNumPages(null)
  }

  useEffect(() => {
    const renderDocx = async () => {
      if (viewerSelectedFile && viewerFileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        try {
          const buffer = await viewerSelectedFile.arrayBuffer()
          if (docxContainerRef.current) {
            docxContainerRef.current.innerHTML = ''
            await renderAsync(buffer, docxContainerRef.current)
            setViewerDocxHtml(docxContainerRef.current.innerHTML)
          }
        } catch (e) {
          console.error('docx render err', e)
        }
      }
    }
    renderDocx()
  }, [viewerSelectedFile, viewerFileType])

  return (
    <>
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        </div>
        <div className="chat-wrapper grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="card border-0 overflow-hidden col-span-12 md:col-span-4 xl:col-span-3 relative">
            <div className="flex items-center justify-between gap-2 px-5 pt-5 pb-4">
              <div className="flex items-center gap-4">
                <div className>
                  <img src="../assets/images/user.png" alt="image" />
                </div>
                <div className>
                  <h6 className="text-base mb-0">Aslamboy</h6>
                  <p className="mb-0 text-xs">Online</p>
                </div>
              </div>{/* chat-sidebar-single end */}
              <div className="dropdown">
                <button data-dropdown-toggle="dropdown1" className="text-neutral-800 dark:text-white" type="button">
                  <i className="ri-more-2-fill" />
                </button>
                <div id="dropdown1" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-lg border border-neutral-100 dark:border-neutral-600 w-44 dark:bg-gray-700">
                  <ul className="p-2 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <button type="submit" className="w-full text-start px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded dark:hover:text-white flex items-center gap-2">
                        <i className="text-base flex ri-user-line" />
                        Profile
                      </button>
                    </li>
                    <li>
                      <button type="button" className="w-full text-start px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded dark:hover:text-white flex items-center gap-2">
                        <i className="text-base flex ri-settings-4-line" />
                        Sozlamalar
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex  overflow-hidden w-full dark:bg-gray-700">
              <TabButtons />
            </div>

            <div className="chat-all-list flex flex-col gap-1.5 mt-3 max-h-[580px] overflow-y-auto">
              {(activeTab === 'shaxsiy' ? people : activeTab === 'guruh' ? groups : channels).map((item) => (
                <button key={item.id} type="button" onClick={() => selectConversation(item)} className={`flex items-center justify-between gap-2 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-600 px-6 py-2.5 ${selected?.id === item.id ? 'bg-neutral-100 dark:bg-neutral-700' : ''}`}>
                  <div className="flex items-center gap-2">
                    <div className="img">
                      <img src={item.avatar} alt={item.name} />
                    </div>
                    <div className="info">
                      <h6 className="text-sm mb-1 line-clamp-1">{item.name}</h6>
                      <p className="mb-0 text-xs line-clamp-1">{item.last}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-end">
                    <p className="mb-0 text-neutral-400 text-xs lh-1">{item.time}</p>
                    {item.unread > 0 && <span className="w-4 h-4 text-xs rounded-full bg-warning-600 text-white inline-flex items-center justify-center">{item.unread}</span>}
                  </div>
                </button>
              ))}
            </div>
            <button className='border-none cursor-pointer w-10 h-10 plus-chat bg-blue-700 rounded-full text-white text-xl flex justify-center align-middle items-center absolute right-6 bottom-6 hover:scale-110 hover:bg-blue-800 shadow-md'>
              <iconify-icon icon="mi:add" />
            </button>
          </div>
          <div className=" col-span-12 md:col-span-8 xl:col-span-9">
            <div className="card border-0 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between gap-2  px-6 py-2.5 active border-b border-neutral-200 dark:border-neutral-600">
                <div className="flex items-center gap-2">
                  <div className="img">
                    <img src="../assets/images/chat/11.png" alt="image" />
                  </div>
                  <div className="info">
                    <h6 className="text-base mb-0">{selected ? selected.name : 'Kathryn Murphy'}</h6>
                    <p className="mb-0">{selected ? (activeTab === 'guruh' ? 'Guruh' : activeTab === 'kanal' ? 'Kanal' : 'Online') : 'Online'}</p>
                  </div>
                </div>
                <div className="action inline-flex items-center gap-3">
                  <button type="button" className="text-xl text-neutral-600 dark:text-neutral-200">
                    <iconify-icon icon="mi:call" />
                  </button>
                  <button type="button" className="text-xl text-neutral-600 dark:text-neutral-200">
                    <iconify-icon icon="fluent:video-32-regular" />
                  </button>
                  <div className="dropdown">
                    <button data-dropdown-toggle="dropdown2" className="text-neutral-800 dark:text-white text-xl" type="button">
                      <i className="ri-more-2-fill" />
                    </button>
                    <div id="dropdown2" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-lg border border-neutral-100 dark:border-neutral-600 w-44 dark:bg-gray-700">
                      <ul className="p-2 text-sm text-gray-700 dark:text-gray-200">
                        <li>
                          <button type="submit" className="w-full text-start px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded dark:hover:text-white flex items-center gap-2">
                            <i className="ri-close-circle-line" />
                            All Clear
                          </button>
                        </li>
                        <li>
                          <button type="button" className="w-full text-start px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded dark:hover:text-white flex items-center gap-2">
                            <iconify-icon icon="ic:baseline-block" />
                            Block
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="chat-message-list max-h-[568px] min-h-[568px] overflow-y-auto flex flex-col p-6 gap-6" onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
                {messages.length === 0 && (
                  <>

                  </>
                )}

                {messages.map((m) => (
                  <div key={m.id} className={`max-w-[700px] ${m.sender === 'me' ? 'ms-auto text-white' : 'text-neutral-900 flex items-end gap-3'}`}>
                    {m.type === 'text' && (
                      m.sender === 'me' ? (
                        <div className="bg-primary-600 rounded-2xl rounded-ee-none p-5">
                          <p className="mb-3">{m.text}</p>
                          <p className="chat-time mb-0 text-xs"><span>{m.time || ''}</span></p>
                        </div>
                      ) : (
                        <>
                          <img src="../assets/images/chat/11.png" alt="image" className="avatar-lg object-fit-cover rounded-full" />
                          <div className="bg-neutral-50 dark:bg-dark-3 rounded-2xl rounded-es-none p-5">
                            <p className="mb-3">{m.text}</p>
                            <p className="chat-time mb-0 text-xs text-end text-neutral-500"><span>{m.time || ''}</span></p>
                          </div>
                        </>
                      )
                    )}

                    {m.type === 'file' && (
                      <div className={`flex items-center gap-3 ${m.sender === 'me' ? 'ms-auto' : ''}`}>
                        {m.sender !== 'me' && <img src="../assets/images/chat/11.png" alt="image" className="avatar-lg object-fit-cover rounded-full" />}
                        <div onClick={() => m.file.url && openViewer(m)} role="button" tabIndex={0} className={`cursor-pointer bg-blue-600  rounded-2xl rounded-es-none p-4 w-full max-w-[520px]`}>
                          <div className="flex items-center gap-3">
                            <i className={`${getFileIconClass(m.file.mime, m.file.name)} text-3xl text-neutral-300`} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-sm font-medium line-clamp-1">{m.file.name}</div>
                                <div className="text-xs text-neutral-300">{formatBytes(m.file.size)}</div>
                              </div>
                              <div className="text-xs text-neutral-300 mt-1">{m.status === 'uploading' ? 'Yuklanmoqda...' : 'Yuklandi'}</div>
                              <div className="w-full bg-blue-700 rounded h-2 mt-2 overflow-hidden">
                                <div style={{ width: `${m.progress}%` }} className={`h-2 bg-green-600`} />
                              </div>
                            </div>
                          </div>
                          {m.status === 'done' && m.file.url && (
                            <div className="mt-3">
                              {m.file.mime?.startsWith('image/') ? (
                                <img src={m.file.url} alt={m.file.name} className="max-w-full rounded" />
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <form onSubmit={onSendText} className="chat-message-box flex items-center justify-between py-4 border-t border-neutral-200 dark:border-neutral-600 mt-auto">
                <input value={text} onChange={(e) => setText(e.target.value)} type="text" className="border-0 grow bg-white dark:bg-transparent focus:border-0 focus:outline-none focus:ring-0" autoComplete="off" name="chatMessage" placeholder="Xabar kiriting..." />
                <input ref={fileInputRef} onChange={onFileChange} type="file" className="hidden" />
                <div className="chat-message-box-action flex items-center gap-4">
                  <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} className="text-xl flex" title="Attach file">
                    <i className="ri-attachment-line" />
                  </button>
                  <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} className="text-xl flex" title="Choose image/file">
                    <iconify-icon icon="solar:gallery-linear" />
                  </button>
                  <button type="submit" className="btn btn-sm btn-primary-600 rounded-lg inline-flex items-center gap-1">
                    Yuborish
                    <iconify-icon icon="f7:paperplane" />
                  </button>
                </div>
              </form>

              {/* Viewer modal */}

              {viewerOpen && (
                <div className="fixed inset-0 bg-black/70 dark:bg-black/80 flex items-center justify-center z-50 ">
                  <div className="w-[790px] h-[100vh] max-w-[1100px] bg-white dark:bg-[#1e1f25] shadow-xl overflow-auto">
                    <button onClick={() => setViewerOpen(false)} className=" text-white absolute top-8 right-[40px] text-7xl p-2 rounded px-3">✕</button>

                    {/* ZIP listing */}
                    {viewerFileType === 'application/zip' && (
                      <div>
                        <h3 className="text-lg font-bold mb-3">ZIP ichidagi fayllar:</h3>
                        {viewerZipEntries.length === 0 && <p>ZIP fayl ichida fayl mavjud emas.</p>}
                        <ul>
                          {viewerZipEntries.map((e, i) => (
                            <li key={i} className="mb-2">
                              <button className="text-blue-600 hover:underline" onClick={() => openZipEntry(e)}>{e.name}</button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* PDF viewer */}
                    {viewerSelectedFile && viewerFileType === 'application/pdf' && (
                      <Document file={viewerSelectedFile} onLoadSuccess={onPdfLoadSuccess}>
                        {Array.from(new Array(viewerNumPages), (_, i) => (
                          <Page key={`p_${i}`} pageNumber={i + 1} className="mb-4 flex justify-center" />
                        ))}
                      </Document>
                    )}

                    {/* DOCX viewer */}
                    {viewerSelectedFile && viewerFileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
                      <div>
                        <div ref={docxContainerRef} />
                      </div>
                    )}

                    {!viewerFileType && <p>Fayl yuklanmoqda...</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default ChatPage
