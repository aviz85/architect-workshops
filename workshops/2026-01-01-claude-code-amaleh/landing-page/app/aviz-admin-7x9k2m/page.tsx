'use client'

import { useState } from 'react'

interface VerificationResult {
  phone: string
  name?: string
  status: string
  paymentUpdated?: boolean
  whatsappSent?: boolean
  message?: string
}

export default function AdminPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<VerificationResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      setResults([])

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVerify = async () => {
    if (!selectedFile) {
      setError('נא לבחור צילום מסך')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResults(data.results || [])
        if (data.processed === 0) {
          setError('לא נמצאו מספרי טלפון או הרשמות תואמות')
        }
      } else {
        setError(data.error || 'שגיאה באימות')
      }
    } catch (err) {
      setError('שגיאה בתקשורת עם השרת')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1 style={{ color: '#22C55E', marginBottom: '8px', marginTop: '40px' }}>
        🔐 אימות תשלומים
      </h1>
      <p style={{ color: '#9CA3AF', marginBottom: '32px' }}>
        העלה צילום מסך מביט לאימות תשלומים ושליחת קישורים
      </p>

      <div className="form-container">
        <div className="form-group">
          <label className="form-label">צילום מסך מביט</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-input"
            style={{ padding: '12px' }}
          />
        </div>

        {preview && (
          <div style={{ marginBottom: '20px' }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                borderRadius: '8px',
                border: '2px solid #374151'
              }}
            />
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={!selectedFile || isProcessing}
          className="submit-btn"
          style={{ marginBottom: '20px' }}
        >
          {isProcessing ? '🔄 מעבד...' : '✅ אמת תשלומים'}
        </button>

        {error && (
          <div style={{
            padding: '16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#EF4444',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div>
            <h3 style={{ color: '#22C55E', marginBottom: '16px' }}>תוצאות:</h3>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #374151' }}>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#9CA3AF' }}>טלפון</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#9CA3AF' }}>שם</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#9CA3AF' }}>סטטוס</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#9CA3AF' }}>תשלום</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#9CA3AF' }}>WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #1F2937' }}>
                    <td style={{ padding: '12px', direction: 'ltr' }}>{result.phone}</td>
                    <td style={{ padding: '12px' }}>{result.name || '-'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: result.status === 'success'
                          ? 'rgba(34, 197, 94, 0.2)'
                          : 'rgba(239, 68, 68, 0.2)',
                        color: result.status === 'success' ? '#22C55E' : '#EF4444'
                      }}>
                        {result.status === 'success' ? 'הצלחה' : result.message || result.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {result.paymentUpdated ? '✅' : '❌'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {result.whatsappSent ? '✅' : '❌'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="note" style={{ marginTop: '24px' }}>
        <strong>איך זה עובד:</strong>
        <br />1. העלה צילום מסך מאפליקציית ביט עם פרטי התשלומים
        <br />2. המערכת מזהה מספרי טלפון בצילום באמצעות Gemini AI
        <br />3. לכל מספר שנמצא - מעדכן סטטוס תשלום ל-"bit"
        <br />4. שולח הודעת WhatsApp עם קישור לזום
      </div>
    </div>
  )
}
