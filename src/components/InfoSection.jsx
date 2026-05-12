import { useState } from 'react'

function InfoBlock({ subtitle, text, items }) {
  return (
    <div className="mb-3">
      {subtitle && <p className="font-semibold text-gray-800 text-sm mb-1">{subtitle}</p>}
      {text && <p className="text-sm text-gray-600 leading-relaxed">{text}</p>}
      {items && (
        <ul className="space-y-1 mt-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-primary mt-0.5 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function InfoSection({ sections, onAllRead }) {
  const [openId, setOpenId] = useState(null)
  const [readIds, setReadIds] = useState(new Set())

  function toggle(id) {
    const next = openId === id ? null : id
    setOpenId(next)
    if (next) {
      const newRead = new Set(readIds).add(id)
      setReadIds(newRead)
      if (onAllRead && newRead.size >= sections.length) {
        onAllRead()
      }
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {sections.map(section => (
        <div
          key={section.id}
          className="bg-white rounded-xl border border-gray-100 overflow-hidden"
        >
          <button
            onClick={() => toggle(section.id)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{section.icon}</span>
              <span className="font-semibold text-sm text-gray-900">{section.title}</span>
            </div>
            <div className="flex items-center gap-2">
              {readIds.has(section.id) && (
                <span className="text-xs text-success font-medium">✓</span>
              )}
              <svg
                width="16" height="16" fill="none" viewBox="0 0 24 24"
                className={`transition-transform duration-200 ${openId === section.id ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
          {openId === section.id && (
            <div className="px-4 pb-4 border-t border-gray-50 pt-3 fade-in">
              {section.content.map((block, i) => (
                <InfoBlock key={i} {...block} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
