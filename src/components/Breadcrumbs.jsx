import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Breadcrumbs({ items }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-1 flex-wrap px-4 pt-3 pb-1">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="text-gray-300 text-xs">›</span>}
          {item.path ? (
            <button
              onClick={() => navigate(item.path)}
              className="text-xs text-primary font-medium"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-xs text-gray-500">{item.label}</span>
          )}
        </Fragment>
      ))}
    </div>
  )
}
