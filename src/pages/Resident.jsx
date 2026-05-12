import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import InfoSection from '../components/InfoSection'
import { residentInfo } from '../data/residentInfo'
import useAppStore from '../store/appStore'
import { allQuestions as questions } from '../data/questions'

const RESIDENT_QUESTIONS_COUNT = 10

export default function Resident() {
  const navigate = useNavigate()
  const residentProgress = useAppStore(s => s.residentProgress)
  const markInfoAsRead = useAppStore(s => s.markInfoAsRead)
  const updateResidentProgress = useAppStore(s => s.updateResidentProgress)
  const [tab, setTab] = useState('info')

  const residentQuestions = questions.filter(q => q.topicSlug === 'resident')

  function handleInfoAllRead() {
    markInfoAsRead()
    updateResidentProgress({ infoRead: true })
  }

  return (
    <div className="app-container pb-24">
      <Breadcrumbs items={[
        { label: 'Головна', path: '/' },
        { label: 'Сталий побут' }
      ]} />

      <div className="px-4 pt-2 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">🏠</div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">Сталий побут</h1>
            <p className="text-xs text-gray-400">Stały pobyt / karta stałego pobytu</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 px-4 mb-4">
        {['info', 'cards', 'simulation'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
              tab === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {t === 'info' ? '📚 Інфо' : t === 'cards' ? '🃏 Картки' : '👨‍💼 Симуляція'}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-900">Необхідна інформація</p>
            {residentProgress.infoRead && (
              <span className="text-xs text-success font-medium">✓ Прочитано</span>
            )}
          </div>
          <InfoSection sections={residentInfo} onAllRead={handleInfoAllRead} />
        </div>
      )}

      {tab === 'cards' && (
        <div className="px-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
            <p className="font-semibold text-gray-900 mb-1">Картки для підготовки</p>
            <p className="text-sm text-gray-500 mb-3">
              {residentQuestions.length > 0
                ? `${residentQuestions.length} питань про права, документи та процедуру`
                : 'Питання для цього розділу включені у загальну базу'
              }
            </p>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 mb-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Вивчено карток</p>
                <p className="text-xs text-gray-500">{residentProgress.cardsStudied} карток</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/cards?topic=resident')}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl text-sm min-h-11"
            >
              Почати вивчення
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="font-semibold text-gray-900 mb-1">Фінальний тест</p>
            <p className="text-sm text-gray-500 mb-3">20 питань, потрібно 80%+ для успіху</p>
            {residentProgress.lastScore !== null ? (
              <div className={`text-center py-2 rounded-lg mb-3 ${
                residentProgress.lastScore >= 80 ? 'bg-success-light text-success' : 'bg-orange-50 text-orange-600'
              }`}>
                <p className="font-bold text-lg">{residentProgress.lastScore}%</p>
                <p className="text-xs">{residentProgress.lastScore >= 80 ? 'Успішно! Ви готові ✓' : 'Потрібна підготовка'}</p>
              </div>
            ) : null}
            <button
              onClick={() => navigate('/cards?topic=resident&mode=test')}
              className="w-full border-2 border-primary text-primary font-bold py-3 rounded-xl text-sm min-h-11"
            >
              Пройти тест готовності
            </button>
          </div>
        </div>
      )}

      {tab === 'simulation' && (
        <div className="px-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">👔</div>
              <p className="font-bold text-gray-900">Інспектор Вонтробський</p>
              <p className="text-xs text-gray-400">Urząd Wojewódzki — відділ стало побуту</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span className="text-xs text-success">Онлайн</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center mb-4">
              Симуляція реального співбесіди для отримання карти сталого побуту. Інспектор перевірить вашу інтеграцію та рівень польської.
            </p>
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <p className="text-xs font-semibold text-blue-700 mb-2">Що перевіряє інспектор:</p>
              <ul className="space-y-1">
                {['Тривалість та легальність перебування', 'Стабільність роботи та доходів', 'Інтеграцію в польське суспільство', 'Рівень польської мови'].map((item, i) => (
                  <li key={i} className="text-xs text-blue-600">• {item}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => navigate('/inspector?mode=resident')}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl text-sm min-h-11"
            >
              Почати симуляцію співбесіди
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">Статистика симуляцій</p>
            <div className="flex items-center gap-3">
              <div className="text-center flex-1">
                <p className="text-xl font-bold text-gray-900">{residentProgress.simulationsDone}</p>
                <p className="text-xs text-gray-400">проведено</p>
              </div>
              <div className="w-px h-8 bg-gray-100"></div>
              <div className="text-center flex-1">
                <p className="text-xl font-bold text-gray-900">{residentProgress.lastScore ?? '—'}{residentProgress.lastScore ? '%' : ''}</p>
                <p className="text-xs text-gray-400">останній бал</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
