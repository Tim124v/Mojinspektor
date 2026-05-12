function cleanInspectorContent(raw) {
  if (typeof raw !== 'string') return raw
  return raw
    .replace(/\*\*\[VIOLATION \d+ COUNTED[^\]]*\]\*\*/gi, '')
    .replace(/\[VIOLATION \d+ COUNTED[^\]]*\]/gi, '')
    .replace(/\*\*\[VIOLATION[^\]]+\]\*\*/gi, '')
    .replace(/\[VIOLATION[^\]]+\]/gi, '')
    .trim()
}

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user'
  const cleanContent = cleanInspectorContent(message.content)

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold mr-2 flex-shrink-0 mt-auto">
          🕵️
        </div>
      )}
      <div
        className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-primary text-white rounded-br-sm'
            : 'bg-card text-gray-800 rounded-bl-sm border border-gray-100'
        }`}
      >
        {cleanContent}
      </div>
    </div>
  )
}
