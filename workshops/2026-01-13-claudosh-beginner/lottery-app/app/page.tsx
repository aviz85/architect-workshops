'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Participant {
  id: string
  name: string
}

interface Confetti {
  id: number
  x: number
  color: string
  delay: number
}

export default function LotteryPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [spinning, setSpinning] = useState(false)
  const [winners, setWinners] = useState<Participant[]>([])
  const [slotNames, setSlotNames] = useState<string[]>(['?', '?', '?'])
  const [showResults, setShowResults] = useState(false)
  const [confetti, setConfetti] = useState<Confetti[]>([])
  const [copied, setCopied] = useState(false)
  const spinInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchParticipants()
  }, [])

  const launchConfetti = useCallback(() => {
    const colors = ['#22C55E', '#FFD700', '#FF6B6B', '#4ECDC4', '#9B59B6', '#3498DB']
    const newConfetti: Confetti[] = []

    for (let i = 0; i < 150; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2
      })
    }
    setConfetti(newConfetti)

    // Launch multiple waves
    setTimeout(() => {
      const wave2: Confetti[] = []
      for (let i = 150; i < 300; i++) {
        wave2.push({
          id: i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 2
        })
      }
      setConfetti(prev => [...prev, ...wave2])
    }, 1000)

    setTimeout(() => {
      const wave3: Confetti[] = []
      for (let i = 300; i < 450; i++) {
        wave3.push({
          id: i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 2
        })
      }
      setConfetti(prev => [...prev, ...wave3])
    }, 2000)

    // Clear confetti after animation
    setTimeout(() => setConfetti([]), 6000)
  }, [])

  async function fetchParticipants() {
    try {
      const { data, error } = await supabase
        .from('workshop_registrations')
        .select('id, name')
        .eq('workshop_name', 'claudosh-beginner-2026-01-13')
        .eq('payment_status', 'paid')
        .not('email', 'is', null)
        .not('phone', 'is', null)
        .neq('email', '')
        .neq('phone', '')

      if (error) throw error
      setParticipants(data || [])
    } catch (err) {
      console.error('Error fetching participants:', err)
    } finally {
      setLoading(false)
    }
  }

  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  function startLottery() {
    if (participants.length < 3) {
      alert('צריך לפחות 3 משתתפים להגרלה!')
      return
    }

    setSpinning(true)
    setShowResults(false)
    setWinners([])
    setCopied(false)

    let spinCount = 0
    const maxSpins = 50
    const shuffled = shuffleArray(participants)
    const selectedWinners = shuffled.slice(0, 3)

    spinInterval.current = setInterval(() => {
      spinCount++

      const randomNames = [
        participants[Math.floor(Math.random() * participants.length)].name,
        participants[Math.floor(Math.random() * participants.length)].name,
        participants[Math.floor(Math.random() * participants.length)].name,
      ]
      setSlotNames(randomNames)

      if (spinCount >= maxSpins) {
        if (spinInterval.current) clearInterval(spinInterval.current)

        // Slot 1 stops
        setTimeout(() => {
          setSlotNames([selectedWinners[0].name, participants[Math.floor(Math.random() * participants.length)].name, participants[Math.floor(Math.random() * participants.length)].name])
        }, 300)

        // Slot 2 stops
        setTimeout(() => {
          setSlotNames([selectedWinners[0].name, selectedWinners[1].name, participants[Math.floor(Math.random() * participants.length)].name])
        }, 900)

        // Slot 3 stops - final reveal
        setTimeout(() => {
          setSlotNames([selectedWinners[0].name, selectedWinners[1].name, selectedWinners[2].name])
          setWinners(selectedWinners)
          setSpinning(false)
          setShowResults(true)
          launchConfetti()
        }, 1500)
      }
    }, 80)
  }

  function resetLottery() {
    setWinners([])
    setSlotNames(['?', '?', '?'])
    setShowResults(false)
    setCopied(false)
  }

  function generateClaudePrompt(): string {
    const winnerIds = winners.map(w => w.id).join(', ')
    const winnerNames = winners.map(w => w.name).join(', ')

    return `קלודוש היקר! 🎉

הגרלת סדנת "קלודוש הסוכן - מתחילים בקטן" (2026-01-13) הסתיימה!

הזוכים ב-3 Passes לניסיון חינמי של Claude Pro הם:
${winners.map((w, i) => `${i + 1}. ${w.name} (ID: ${w.id})`).join('\n')}

המשימה שלך:
1. פתח את קובץ הסדנה: workshops/2026-01-13-claudosh-beginner/workshop.md
2. מצא שם את הקישור לזוכים (בסקשן "מתנה 2: 3 Free Trial Passes")
3. שלוף מהדאטהבייס את פרטי הקשר (מייל וטלפון) של הזוכים לפי ה-IDs: ${winnerIds}
4. שלח לכל זוכה:
   - מייל עם הקישור והודעת מזל טוב
   - הודעת וואטסאפ עם הקישור והודעת מזל טוב

תודה! 🚀`
  }

  async function copyPrompt() {
    const prompt = generateClaudePrompt()
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>טוען משתתפים...</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          style={{
            position: 'fixed',
            left: `${c.x}%`,
            top: '-20px',
            width: '10px',
            height: '10px',
            backgroundColor: c.color,
            borderRadius: '50%',
            animation: `fall 3s ease-out ${c.delay}s forwards`,
            zIndex: 1000,
          }}
        />
      ))}

      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <h1 style={styles.title}>🎰 הגרלת הסדנה 🎰</h1>
      <h2 style={styles.subtitle}>קלודוש הסוכן - מתחילים בקטן!</h2>

      <div style={styles.participantCount}>
        👥 {participants.length} משתתפים בהגרלה
      </div>

      <div style={styles.slotMachine}>
        <div style={styles.slotsContainer}>
          {slotNames.map((name, index) => (
            <div
              key={index}
              style={{
                ...styles.slot,
                ...(spinning ? styles.slotSpinning : {}),
                ...(showResults ? styles.slotWinner : {})
              }}
            >
              <div style={styles.slotLabel}>זוכה #{index + 1}</div>
              <div style={styles.slotName}>{name}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.buttonContainer}>
        {!spinning && !showResults && (
          <button style={styles.spinButton} onClick={startLottery}>
            🎲 הגרל 3 זוכים! 🎲
          </button>
        )}

        {showResults && (
          <button style={styles.resetButton} onClick={resetLottery}>
            🔄 הגרלה חדשה
          </button>
        )}
      </div>

      {showResults && winners.length > 0 && (
        <div style={styles.winnersDetails}>
          <h3 style={styles.winnersTitle}>🎉 הזוכים! 🎉</h3>
          {winners.map((winner, index) => (
            <div key={winner.id} style={styles.winnerCard}>
              <div style={styles.winnerNumber}>#{index + 1}</div>
              <div style={styles.winnerInfo}>
                <div style={styles.winnerName}>{winner.name}</div>
                <div style={styles.winnerId}>ID: {winner.id}</div>
              </div>
            </div>
          ))}

          <div style={styles.copySection}>
            <p style={styles.copyInstructions}>
              👇 העתק את ההודעה הבאה לקלוד כדי לשלוח את הפרסים לזוכים
            </p>
            <button
              style={{
                ...styles.copyButton,
                ...(copied ? styles.copyButtonSuccess : {})
              }}
              onClick={copyPrompt}
            >
              {copied ? '✅ הועתק!' : '📋 העתק הודעה לקלוד'}
            </button>
          </div>
        </div>
      )}

      <div style={styles.footer}>
        <p>הגרלת 3 Passes לניסיון חינמי של Claude Pro</p>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    overflow: 'hidden',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '10px',
    textShadow: '0 0 20px rgba(34, 197, 94, 0.5)',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#22C55E',
    marginBottom: '30px',
  },
  participantCount: {
    fontSize: '1.2rem',
    background: 'rgba(34, 197, 94, 0.2)',
    padding: '10px 30px',
    borderRadius: '20px',
    marginBottom: '40px',
  },
  slotMachine: {
    background: 'linear-gradient(145deg, #2a2a4a, #1a1a3a)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.1)',
    border: '3px solid #22C55E',
  },
  slotsContainer: {
    display: 'flex',
    gap: '20px',
  },
  slot: {
    width: '200px',
    height: '150px',
    background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 100%)',
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #333',
    transition: 'all 0.3s ease',
  },
  slotSpinning: {
    borderColor: '#22C55E',
    boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)',
  },
  slotWinner: {
    borderColor: '#FFD700',
    boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
    background: 'linear-gradient(180deg, #1a1a2a 0%, #2a2a4a 100%)',
  },
  slotLabel: {
    fontSize: '0.9rem',
    color: '#888',
    marginBottom: '10px',
  },
  slotName: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '0 10px',
  },
  buttonContainer: {
    marginTop: '40px',
  },
  spinButton: {
    fontSize: '1.5rem',
    padding: '20px 50px',
    background: 'linear-gradient(145deg, #22C55E, #16a34a)',
    color: 'white',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 5px 20px rgba(34, 197, 94, 0.4)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  resetButton: {
    fontSize: '1.2rem',
    padding: '15px 40px',
    background: 'linear-gradient(145deg, #6366f1, #4f46e5)',
    color: 'white',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  winnersDetails: {
    marginTop: '40px',
    background: 'rgba(34, 197, 94, 0.1)',
    borderRadius: '20px',
    padding: '30px',
    width: '100%',
    maxWidth: '700px',
  },
  winnersTitle: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#FFD700',
    fontSize: '1.8rem',
  },
  winnerCard: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '15px 20px',
    marginBottom: '10px',
    border: '1px solid rgba(34, 197, 94, 0.3)',
  },
  winnerNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#22C55E',
    marginLeft: '20px',
    width: '60px',
  },
  winnerInfo: {
    flex: 1,
  },
  winnerName: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  winnerId: {
    fontSize: '0.85rem',
    color: '#888',
    fontFamily: 'monospace',
  },
  copySection: {
    marginTop: '30px',
    textAlign: 'center',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '20px',
  },
  copyInstructions: {
    color: '#aaa',
    marginBottom: '15px',
  },
  copyButton: {
    fontSize: '1.2rem',
    padding: '15px 40px',
    background: 'linear-gradient(145deg, #F59E0B, #D97706)',
    color: 'white',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  copyButtonSuccess: {
    background: 'linear-gradient(145deg, #22C55E, #16a34a)',
  },
  loadingText: {
    fontSize: '1.5rem',
    color: '#22C55E',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: '40px',
    color: '#666',
    fontSize: '0.9rem',
  },
}
