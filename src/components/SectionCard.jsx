import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

export default function SectionCard({
  icon,
  title,
  description,
  path,
  progress,
  status,
  color = '#DC143C',
  resumeBadge,
}) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const statusConfig = {
    not_started: { labelKey: 'section_status_not_started', bg: 'bg-gray-100', text: 'text-gray-700' },
    in_progress: { labelKey: 'section_status_in_progress', bg: 'bg-orange-100', text: 'text-orange-600' },
    ready: { labelKey: 'section_status_ready', bg: 'bg-success-light', text: 'text-success' },
  }
  const row = statusConfig[status] || statusConfig.not_started
  const statusInfo = { ...row, label: t[row.labelKey] || row.labelKey }

  return (
    <button
      onClick={() => navigate(path)}
      className="w-full bg-white rounded-xl p-4 text-left border border-gray-100 active:scale-98 transition-transform"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: color + '18' }}
        >
          {icon}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
          {statusInfo.label}
        </span>
      </div>
      <p className="font-bold text-gray-900 text-sm mb-0.5">{title}</p>
      {resumeBadge && (
        <span
          style={{
            display: 'inline-block',
            fontSize: '11px',
            background: resumeBadge.background,
            color: resumeBadge.color,
            padding: '2px 8px',
            borderRadius: '20px',
            fontWeight: '500',
            marginBottom: '6px',
          }}
        >
          {resumeBadge.label}
        </span>
      )}
      <p className="text-xs text-gray-600 mb-3">{description}</p>
      {progress !== undefined && (
        <>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, progress)}%`, backgroundColor: color }}
            />
          </div>
          <p className="text-xs text-gray-600">
            {(t.section_percent_done || '{n}%').replace('{n}', String(progress))}
          </p>
        </>
      )}
    </button>
  )
}
